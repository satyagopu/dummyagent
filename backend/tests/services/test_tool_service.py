import pytest
from app.services.tool_service import tool_service

def test_get_available_tools():
    tools = tool_service.get_available_tools()
    assert len(tools) > 0
    names = [t["name"] for t in tools]
    assert "Calculator" in names
    # Wikipedia might fail if dependecies missing, but usually works
    
def test_get_tool():
    tool = tool_service.get_tool("Calculator")
    assert tool is not None
    assert tool.name == "Calculator"
    
    tool = tool_service.get_tool("non_existent")
    assert tool is None

def test_execute_tool_calculator():
    result = tool_service.execute_tool("Calculator", "2 + 2")
    assert result == "4"
    
    # Error case
    result = tool_service.execute_tool("Calculator", "1 / 0")
    assert "Error" in result

def test_execute_unknown_tool():
    with pytest.raises(ValueError, match="Tool 'unknown' not found"):
        tool_service.execute_tool("unknown", "query")
