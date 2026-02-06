# Phase 5: Advanced Tooling & Custom Nodes

## 🎯 Goal
Expand the agent builder's capabilities by implementing:
1.  **Tool Registry**: Enable agents to use external tools (Calculator, Search, etc.).
2.  **Custom Nodes**: Allow users to define nodes with dynamic input/output schemas.
3.  **Agent Node**: Create a self-contained node that runs a ReAct loop.

## 🛠️ Implementation Guide

### 1. Backend: Tool Registry (✅ In Progress)
- [x] **New Service**: `app/services/tool_service.py`
    - Manage and serve tools (`Calculator`, `Wikipedia`).
    - Methods: `register_tool`, `get_available_tools`, `execute_tool`.
- [x] **API Update**: `GET /api/workflows/tools`
    - Endpoint to fetch list of available tools for the frontend.
- [x] **Executor Update**: `app/core/executor.py`
    - Handle `tool` node type.
    - Execute appropriate tool from registry.

### 2. Frontend: Advanced Nodes (✅ In Progress)
- [x] **Tool Node**: `src/components/nodes/ToolNode.tsx`
    - Dropdown to select tool.
    - Dynamic inputs based on tool selection.
- [x] **End Node**: `src/components/nodes/EndNode.tsx`
    - Visual terminator for workflows.
- [x] **Custom Node**: `src/components/nodes/CustomNode.tsx`
    - **User-Defined Control**: Users can click "Add Input" or "Add Output" to define the node's interface.
    - **Dynamic Schema**: Unlike Tool Nodes (where the system defines inputs), Custom Nodes act as a blank canvas where the user decides the shape of the data flow.
    - **Flexibility**: Enables creating specific data structures or intermediate steps with custom port definitions.

### 3. Agentic Capabilities (⏳ Planned)
- [ ] **Agent Node**: `src/components/nodes/AgentNode.tsx`
    - Configurable "Agent" (System Prompt, Model, Allowed Tools).
    - **Backend Logic**: This node's execution is special.
        - Instead of a single pass, it runs a **ReAct Loop** (Reason -> Act -> Observe).
        - It constructs a mini-graph or uses LangChain's AgentExecutor internally.
    - **No "Loop Holes"**: The loop is contained *within* the node, preserving the main graph's DAG structure.

## ✅ Verification Checklist
- [x] **Tool Execution**: Verify `Input -> Calculator -> Output` works.
- [x] **Custom Node**: Verify user can create a node with 3 inputs and 2 outputs and data flows correctly.
- [ ] **Agent Node**: Verify Agent Node can use "Search" tool to answer a complex question (e.g., "What is the population of France?").

## ⚠️ Key Considerations
- **Security**: Creating Custom Nodes allows arbitrary data flow; ensure types are handled gracefully.
- **Agent Loops**: Ensure `AgentNode` has a maximum iteration limit (e.g., 10 steps) to prevent infinite loops.
