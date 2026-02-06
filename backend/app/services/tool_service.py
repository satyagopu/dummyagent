from typing import List, Dict, Any, Optional
from langchain_core.tools import Tool
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_core.pydantic_v1 import BaseModel, Field

# Defines a simple calculator tool since langchain's often requires extra dependencies
def calculator_func(input_str: str) -> str:
    """Calculates a mathematical expression."""
    try:
        # Dangerous for production, but standard for simple calculator checks
        # In a real app, use a safer eval or library
        return str(eval(input_str))
    except Exception as e:
        return f"Error calculating: {str(e)}"

class ToolService:
    def __init__(self):
        self._tools: Dict[str, Tool] = {}
        self._initialize_default_tools()

    def _initialize_default_tools(self):
        """Register default tools."""
        
        # 1. Calculator
        calc_tool = Tool(
            name="Calculator",
            func=calculator_func,
            description="Useful for performing mathematical calculations. Input should be a mathematical expression like '2 + 2'."
        )
        self.register_tool(calc_tool)

        # 2. Wikipedia (if available)
        try:
            wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())
            wiki_tool = Tool(
                name="Wikipedia",
                func=wikipedia.run,
                description="Useful for querying Wikipedia for information."
            )
            self.register_tool(wiki_tool)
        except Exception as e:
            print(f"Failed to initialize Wikipedia tool: {e}")

    def register_tool(self, tool: Tool):
        """Register a new tool."""
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> Optional[Tool]:
        """Get a specific tool by name."""
        return self._tools.get(name)

    def get_available_tools(self) -> List[Dict[str, Any]]:
        """List all available tools metadata."""
        return [
            {
                "name": name,
                "description": tool.description,
                "args": tool.args
            }
            for name, tool in self._tools.items()
        ]

    def execute_tool(self, tool_name: str, input_data: str) -> str:
        """Execute a tool by name."""
        tool = self.get_tool(tool_name)
        if not tool:
            raise ValueError(f"Tool '{tool_name}' not found")
        
        try:
            return tool.run(input_data)
        except Exception as e:
            return f"Error executing tool {tool_name}: {str(e)}"

# Singleton instance
tool_service = ToolService()
