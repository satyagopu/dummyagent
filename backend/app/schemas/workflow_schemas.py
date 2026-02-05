from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class WorkflowCreate(BaseModel):
    """Schema for creating a workflow"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    canvas_state: Optional[Dict[str, Any]] = {}

class WorkflowUpdate(BaseModel):
    """Schema for updating a workflow"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    canvas_state: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class WorkflowResponse(BaseModel):
    """Schema for workflow response"""
    id: str
    user_id: str
    name: str
    description: Optional[str]
    canvas_state: Dict[str, Any]
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class WorkflowExecutionRequest(BaseModel):
    """Schema for executing a workflow"""
    initial_inputs: Optional[Dict[str, Any]] = None

class WorkflowExecutionResponse(BaseModel):
    """Schema for execution results"""
    workflow_id: str
    status: str
    results: Dict[str, Any]
    logs: List[Dict[str, Any]]
