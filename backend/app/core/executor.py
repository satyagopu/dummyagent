from typing import List, Dict, Any, Set
from collections import deque
from app.services.llm_service import get_llm_service

class GraphExecutor:
    def __init__(self):
        self.llm_service = get_llm_service()

    async def execute(self, nodes: List[Dict], edges: List[Dict], initial_inputs: Dict[str, Any] = None) -> Dict[str, Any]:
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
                output = await self._process_node(node_type, node_data, inputs, execution_context)
                
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

    async def _process_node(self, node_type: str, data: Dict, inputs: Dict, context: Dict) -> Any:
        """Process a single node based on its type."""
        
        if node_type == 'input':
            # Input nodes just pass through their configuration or initial inputs
            return {**data, **context.get('initial_inputs', {})}
            
        elif node_type == 'llm':
            # Construct prompt from inputs + system prompt
            system_prompt = data.get('system_prompt', 'You are a helpful assistant.')
            user_prompt = inputs.get('prompt') or inputs.get('input') or data.get('prompt') or "Hello!"
            
            # Simple template substitution if needed (e.g., "Hello {name}")
            # For now, just append inputs if they simplify things
            
            model = data.get('model', 'gemini-pro')
            temperature = float(data.get('temperature', 0.7))
            
            response = await self.llm_service.generate_text(
                prompt=user_prompt,
                system_prompt=system_prompt,
                model_name=model,
                temperature=temperature
            )
            return {"generated_text": response}
            
        elif node_type == 'output':
            # Output nodes just capture the final state
            return inputs
            
        elif node_type == 'tool':
            # Execute a tool
            tool_name = data.get('tool')
            input_data = inputs.get('input') or inputs.get('query') or inputs.get('expression') or " "
            
            if not tool_name:
                raise ValueError("Tool node missing 'tool' name configuration")
                
            from app.services.tool_service import tool_service
            output = tool_service.execute_tool(tool_name, str(input_data))
            return {"output": output}

        elif node_type == 'end':
            # End node - semantically same as output, just stops the branch
            return inputs

        else:
            # Pass-through for unknown nodes
            return inputs
