# Phase 4: LLM Integration & Workflow Execution

## Overview
This phase focuses on breathing life into the static workflow canvas. We will implement the actual execution engine that powers the workflows, integrate LLM capabilities (Gemini/OpenAI), and enable users to run their designed agents.

## Goals
1.  **Backend Execution Engine:** Build a graph traversal engine to execute nodes in order.
2.  **LLM Service:** Integrate LangChain/LLM providers to process text generation requests.
3.  **Frontend Nodes:** create fully functional `LLMNode` and `InputNode` components with configuration forms.
4.  **Real-time Feedback:** Stream execution status and results back to the frontend.

## detailed Tasks

### 1. Backend: LLM Service Setup
- [ ] Install `langchain` and `langchain-google-genai` (or standard `openai`).
- [ ] Create `LLMService` to handle model initialization and prompt execution.
- [ ] Implement API endpoint to test simple LLM generation.
- [ ] Securely handle API keys.

### 2. Backend: Execution Engine
- [ ] Design `GraphExecutor` class to topological sort and execute the graph.
- [ ] Implement `NodeProcessor` interface for different node types.
- [ ] Create `LLMProcessor` to handle the actual LLM calls during execution.
- [ ] Implement state management to pass data (outputs -> inputs) between nodes.

### 3. Frontend: Canvas Enhancements
- [ ] Create `LLMNode` component with:
    -   Model selection dropdown.
    -   System prompt input.
    -   Temperature slider.
- [ ] Implement `InputNode` for workflow starting arguments.
- [ ] Update `WorkflowEditorPage` to save node configuration data.

### 4. Integration & Execution
- [ ] Create `POST /api/workflows/{id}/run` endpoint.
- [ ] Connect "Run" button in frontend to trigger execution.
- [ ] Display execution results in a specialized "Output" or "Logs" panel.
- [ ] Handle errors gracefully during execution.

## verification Plan
- **Unit Tests:** Test graph traversal logic and LLM service mocking.
- **Integration Tests:** Run a full workflow (Input -> LLM -> Output) and verify response.
- **Manual Verification:** Build a "Joke Generator" workflow in the UI and run it.
