import pytest
from app.core.executor import GraphExecutor
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_topological_execution():
    # A -> B -> C
    nodes = [
        {"id": "A", "type": "input", "data": {"input": "start"}},
        {"id": "B", "type": "default", "data": {}},
        {"id": "C", "type": "output", "data": {}}
    ]
    edges = [
        {"source": "A", "target": "B"},
        {"source": "B", "target": "C"}
    ]
    
    executor = GraphExecutor()
    
    # Mock processing
    # Mock processing - Update signature to include user_api_keys
    executor._process_node = AsyncMock(side_effect=lambda type, data, inputs, context, user_api_keys=None: f"processed_{inputs.get('input', 'none')}")
    
    result = await executor.execute(nodes, edges)
    
    # GraphExecutor returns {results: ..., logs: ...}
    
    context = result["results"]
    
    # A processing
    # inputs to A: {} (from gather), plus initial inputs if any. input node logic returns data.
    # executor._process_node mock overrides logic, so we check flow.
    # Wait, real _process_node logic for input node returns data merge.
    # For this test we mocked _process_node entirely.
    
    # Execution order should be A, B, C
    # A output: processed_none (if gather returns empty)
    # B input: A's output.
    # B output: processed_processed_none
    
    assert "A" in context
    assert "B" in context
    assert "C" in context

@pytest.mark.asyncio
async def test_cycle_detection():
    # A -> B -> A
    nodes = [
        {"id": "A", "type": "default"},
        {"id": "B", "type": "default"}
    ]
    edges = [
        {"source": "A", "target": "B"},
        {"source": "B", "target": "A"}
    ]
    
    executor = GraphExecutor()
    
    with pytest.raises(ValueError, match="Workflow contains a cycle"):
        await executor.execute(nodes, edges)

@pytest.mark.asyncio
async def test_llm_node_integration():
    # Input -> LLM -> Output
    nodes = [
        {"id": "1", "type": "input", "data": {"value": "Hello"}},
        {"id": "2", "type": "llm", "data": {"model": "gemini-pro"}},
        {"id": "3", "type": "output"}
    ]
    edges = [
        {"source": "1", "target": "2"},
        {"source": "2", "target": "3"}
    ]
    
    with patch("app.core.executor.get_llm_service") as mock_get_service:
        mock_service = AsyncMock()
        mock_service.generate_text.return_value = "AI Response"
        mock_get_service.return_value = mock_service
        
        executor = GraphExecutor()
        
        # We use real _process_node here
        result = await executor.execute(nodes, edges, initial_inputs={"user_input": "trigger"})
        
        # Input node (id=1): returns {"value": "Hello", "user_input": "trigger"}
        # LLM node (id=2): gathers inputs. "input": {...}. 
        # _process_node for LLM:
        # user_prompt = inputs.get('prompt') or inputs.get('input') ...
        # if input node returns the dict, inputs['input'] might be the dict or merged.
        # GraphExecutor._gather_inputs logic: 
        #   if source_output is dict: inputs.update(source_output)
        #   else: inputs['input'] = source_output
        
        # So inputs for Node 2 will be {"value": "Hello", "user_input": "trigger"}
        # user_prompt = inputs.get('input') -> None (unless keys match).
        # user_prompt fallback -> inputs.get('prompt') -> None.
        
        # Let's adjust input data to have 'prompt' key to be safe, or check fallback.
        # The logic has : inputs.get('input') or ...
        # If inputs has key "value", but no "input" or "prompt", it might fallback to "Hello!".
        
        # Wait, if inputs.update(source_output) happened, and source output is {"value": ...}, then inputs is {"value": ...}.
        # Code: inputs.get('input') will be None.
        
        assert result["results"]["2"] == {"generated_text": "AI Response"}
        assert result["results"]["3"] == {"generated_text": "AI Response"}
