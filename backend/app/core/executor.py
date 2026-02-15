from typing import List, Dict, Any, Set, Optional
from collections import deque
import logging
from app.services.llm_service import get_llm_service
from app.services.tool_service import tool_service
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

logger = logging.getLogger(__name__)

# Lazy imports placeholders or handle inside methods if strict lazy loading needed, 
# but for now we put imports at top for cleanliness, wrapping optional ones.
try:
    from langchain_openai import ChatOpenAI
except ImportError:
    ChatOpenAI = None
try:
    from langchain_anthropic import ChatAnthropic
except ImportError:
    ChatAnthropic = None

REACT_PROMPT_TEMPLATE = """Answer the following questions as best you can. You have access to the following tools:

{tools}

IMPORTANT:
1. You may ONLY use the tools listed above.
2. If you need a tool that is not listed, DO NOT fabricate one.
3. Instead, answer the question using your internal knowledge or state that you cannot answer.
4. If the tools are empty, you must answer directly using your knowledge.

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

System: {system_message}
Question: {input}
Thought:{agent_scratchpad}"""

class GraphExecutor:
    def __init__(self):
        self.llm_service = get_llm_service()

    async def execute(self, nodes: List[Dict], edges: List[Dict], initial_inputs: Dict[str, Any] = None, user_api_keys: Dict[str, str] = None) -> Dict[str, Any]:
        """
        Execute a workflow graph.
        Returns the final state/outputs of all nodes.
        """
        adjacency_list = {node['id']: [] for node in nodes}
        in_degree = {node['id']: 0 for node in nodes}
        node_map = {node['id']: node for node in nodes}
        
        # Build graph
        for edge in edges:
            source = edge['source']
            target = edge['target']
            adjacency_list[source].append(target)
            in_degree[target] += 1

        # Kahn's Algorithm for Topological Sort
        queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])
        sorted_nodes = []
        
        while queue:
            node_id = queue.popleft()
            sorted_nodes.append(node_id)
            
            for neighbor in adjacency_list[node_id]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(sorted_nodes) != len(nodes):
            raise ValueError("Workflow contains a cycle and cannot be executed.")

        # Execution Phase
        execution_context = {}  # Stores outputs of each node: {node_id: output_data}
        if initial_inputs:
            execution_context['initial_inputs'] = initial_inputs

        execution_logs = []

        for node_id in sorted_nodes:
            node = node_map[node_id]
            node_type = node.get('type', 'default')
            node_data = node.get('data', {})
            
            try:
                # Gather inputs from incoming edges
                inputs = self._gather_inputs(node_id, edges, execution_context)
                
                # Execute Node Logic
                output = await self._process_node(node_type, node_data, inputs, execution_context, user_api_keys)
                
                execution_context[node_id] = output
                execution_logs.append({
                    "node_id": node_id,
                    "status": "success",
                    "output": output
                })
                
            except Exception as e:
                execution_logs.append({
                    "node_id": node_id,
                    "status": "error",
                    "error": str(e)
                })
                # For now, stop on error
                break

        return {
            "results": execution_context,
            "logs": execution_logs
        }

    def _gather_inputs(self, node_id: str, edges: List[Dict], context: Dict) -> Dict:
        """Collect outputs from parent nodes to serve as inputs for the current node."""
        inputs = {}
        incoming_edges = [e for e in edges if e['target'] == node_id]
        
        for edge in incoming_edges:
            source_id = edge['source']
            source_output = context.get(source_id)
            if source_output:
                # Simple merging of outputs.
                # In a real system, you'd map specific output keys to input keys.
                if isinstance(source_output, dict):
                    inputs.update(source_output)
                else:
                    inputs['input'] = source_output
                    
        return inputs

    async def _process_node(self, node_type: str, data: Dict, inputs: Dict, context: Dict, user_api_keys: Dict[str, str] = None) -> Any:
        """Process a single node based on its type."""
        
        if node_type == 'input':
            return {**data, **context.get('initial_inputs', {})}
            
        elif node_type == 'llm':
            return await self._process_llm_node(data, inputs, user_api_keys)
            
        elif node_type == 'output':
            # Output nodes just capture the final state
            return inputs
            
        elif node_type == 'agent':
            return await self._process_agent_node(data, inputs, user_api_keys)

        elif node_type == 'tool':
            return self._process_tool_node(data, inputs)
            
        elif node_type == 'end':
            # End node - semantically same as output, just stops the branch
            return inputs

        else:
            # Pass-through for unknown nodes
            return inputs

    async def _process_llm_node(self, data: Dict, inputs: Dict, user_api_keys: Dict[str, str] = None) -> Dict:
        """Handle LLM Node execution."""
        system_prompt = data.get('system_prompt', 'You are a helpful assistant.')
        user_prompt = inputs.get('prompt') or inputs.get('input') or inputs.get('value') or data.get('prompt') or "Hello!"
        
        model = data.get('model', 'gemini-pro')
        temperature = float(data.get('temperature', 0.7))
        
        # Determine key
        api_key = None
        if user_api_keys:
            if "gpt" in model:
                api_key = user_api_keys.get('openai')
            elif "gemini" in model:
                api_key = user_api_keys.get('google')
            elif "claude" in model:
                api_key = user_api_keys.get('anthropic')

        response = await self.llm_service.generate_text(
            prompt=user_prompt,
            system_prompt=system_prompt,
            model_name=model,
            temperature=temperature,
            api_key=api_key
        )
        return {"generated_text": response}

    async def _process_agent_node(self, data: Dict, inputs: Dict, user_api_keys: Dict[str, str] = None) -> Dict:
        """Handle Agent Node execution with ReAct loop."""
        # 1. Get configuration
        system_prompt = data.get('system_prompt', 'You are a helpful AI assistant.')
        model_name = data.get('model', 'gemini-1.5-pro')
        selected_tool_names = data.get('tools', [])
        
        # 2. Prepare Tools
        tools = []
        for name in selected_tool_names:
            tool = tool_service.get_tool(name)
            if tool:
                tools.append(tool)
        
        # 3. Initialize LLM
        llm = self._initialize_llm(model_name, user_api_keys)

        # 4. Construct Prompt
        prompt = PromptTemplate.from_template(REACT_PROMPT_TEMPLATE)
        
        # 5. Create Agent
        try:
            agent = create_react_agent(llm, tools, prompt)
            agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)
            
            # 6. Execute
            input_text = inputs.get('input') or inputs.get('query') or inputs.get('value') or " "
            
            result = await agent_executor.ainvoke({
                "input": input_text,
                "system_message": system_prompt
            })
            output_text = result.get('output', str(result))
            return {"output": output_text, "generated_text": output_text}
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")
            return {"output": f"Agent Error: {str(e)}", "error": str(e)}

    def _process_tool_node(self, data: Dict, inputs: Dict) -> Dict:
        """Handle Tool Node execution."""
        tool_name = data.get('tool')
        input_data = inputs.get('input') or inputs.get('query') or inputs.get('expression') or inputs.get('value') or " "
        
        if not tool_name:
            raise ValueError("Tool node missing 'tool' name configuration")
            
        output = tool_service.execute_tool(tool_name, str(input_data))
        return {"output": output}

    def _initialize_llm(self, model_name: str, user_api_keys: Dict[str, str] = None):
        """Helper to initialize the correct LLM backend based on model name."""
        api_key = None
        
        if "gpt" in model_name:
            if user_api_keys: api_key = user_api_keys.get('openai')
            if ChatOpenAI:
                 return ChatOpenAI(model=model_name, temperature=0, api_key=api_key) # If api_key is None, it falls back to env if configured
            logger.warning("langchain_openai not installed or failed to import, fallback to Gemini")

        if "claude" in model_name:
             if user_api_keys: api_key = user_api_keys.get('anthropic')
             if ChatAnthropic:
                return ChatAnthropic(model=model_name, temperature=0, api_key=api_key)
        
        # Default to Gemini
        api_model_name = "gemini-1.5-pro"
        if "gemini" in model_name: 
            api_model_name = "gemini-1.5-pro"
            if user_api_keys: api_key = user_api_keys.get('google')
        
        return ChatGoogleGenerativeAI(model=api_model_name, temperature=0, google_api_key=api_key)

