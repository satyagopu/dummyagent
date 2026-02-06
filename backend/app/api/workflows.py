from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.workflow import Workflow
from app.models.user import User
from app.schemas.workflow_schemas import WorkflowCreate, WorkflowUpdate, WorkflowResponse, WorkflowExecutionRequest, WorkflowExecutionResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/workflows", tags=["Workflows"])

@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new workflow"""
    new_workflow = Workflow(
        user_id=str(current_user.id),
        name=workflow_data.name,
        description=workflow_data.description,
        canvas_state=workflow_data.canvas_state or {}
    )
    
    db.add(new_workflow)
    db.commit()
    db.refresh(new_workflow)
    
    return new_workflow

@router.get("/", response_model=List[WorkflowResponse])
async def get_workflows(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all workflows for current user"""
    workflows = db.query(Workflow).filter(Workflow.user_id == str(current_user.id)).all()
    return workflows

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific workflow"""
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.user_id == str(current_user.id)
    ).first()
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    return workflow

@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: str,
    workflow_data: WorkflowUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a workflow"""
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.user_id == str(current_user.id)
    ).first()
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    # Update fields
    if workflow_data.name is not None:
        workflow.name = workflow_data.name
    if workflow_data.description is not None:
        workflow.description = workflow_data.description
    if workflow_data.canvas_state is not None:
        workflow.canvas_state = workflow_data.canvas_state
    if workflow_data.status is not None:
        workflow.status = workflow_data.status
    
    db.commit()
    db.refresh(workflow)
    
    return workflow

@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a workflow"""
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.user_id == str(current_user.id)
    ).first()
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    db.delete(workflow)
    db.commit()
    
    return None

@router.post("/{workflow_id}/execute", response_model=WorkflowExecutionResponse)
async def execute_workflow(
    workflow_id: str,
    execution_request: WorkflowExecutionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute a workflow"""
    from app.core.executor import GraphExecutor
    
    nodes = []
    edges = []

    # 1. Stateless Execution: Use nodes/edges from request if provided
    if execution_request.nodes:
        nodes = execution_request.nodes
        edges = execution_request.edges or []
    
    # 2. Stateful Execution: Fetch from DB if not provided
    else:
        workflow = db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == str(current_user.id)
        ).first()
        
        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        canvas_state = workflow.canvas_state or {}
        nodes = canvas_state.get('nodes', [])
        edges = canvas_state.get('edges', [])
    
    if not nodes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workflow has no nodes to execute"
        )
        
    executor = GraphExecutor()
    try:
        execution_result = await executor.execute(
            nodes=nodes,
            edges=edges,
            initial_inputs=execution_request.initial_inputs
        )
        
        return {
            "workflow_id": workflow_id,
            "status": "success",
            "results": execution_result.get("results", {}),
            "logs": execution_result.get("logs", [])
        }
    except Exception as e:
        # In case of overall execution failure (e.g. cycle detected)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
