from typing import List, Dict, Any, Optional
import logging
from langchain_core.tools import Tool
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from pydantic import BaseModel, Field
from simpleeval import simple_eval

logger = logging.getLogger(__name__)

def calculator_func(input_str: str) -> str:
    """
    Calculates a mathematical expression.
    WARNING: Uses eval() - strictly for demonstration checks.
    """
    try:
        # Use simpleeval for safe mathematical expression evaluation
        # This prevents arbitrary code execution (B307)
        return str(simple_eval(input_str))
    except Exception as e:
        logger.error(f"Calculator error for input '{input_str}': {e}")
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
            logger.warning(f"Failed to initialize Wikipedia tool: {e}")

    def register_tool(self, tool: Tool):
        """Register a new tool."""
        self._tools[tool.name] = tool
        logger.info(f"Registered tool: {tool.name}")

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
            logger.error(f"Tool not found: {tool_name}")
            raise ValueError(f"Tool '{tool_name}' not found")
        
        try:
            return tool.run(input_data)
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return f"Error executing tool {tool_name}: {str(e)}"

# Singleton instance
tool_service = ToolService()
