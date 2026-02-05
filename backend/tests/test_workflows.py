from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine, SessionLocal
from app.models.workflow import Workflow
from app.models.user import User
import pytest
from unittest.mock import patch, AsyncMock

client = TestClient(app)

# Database setup fixture
@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(setup_database):
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def auth_token():
    """Register a user and return access token"""
    email = "workflow_test@example.com"
    client.post("/auth/register", json={
        "email": email,
        "password": "password123",
        "full_name": "Workflow Tester"
    })
    response = client.post("/auth/login", json={
        "email": email,
        "password": "password123"
    })
    return response.json()["access_token"]

@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}

# --- CRUD Tests ---

def test_create_workflow(auth_headers):
    response = client.post("/workflows/", json={
        "name": "My First Workflow",
        "description": "A test workflow",
        "canvas_state": {"nodes": [], "edges": []}
    }, headers=auth_headers)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My First Workflow"
    assert "id" in data
    return data["id"]

def test_get_workflows(auth_headers):
    # Ensure at least one exists
    client.post("/workflows/", json={"name": "List Test", "canvas_state": {}}, headers=auth_headers)
    
    response = client.get("/workflows/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_get_workflow_by_id(auth_headers):
    # Create
    create_res = client.post("/workflows/", json={"name": "Get By ID", "canvas_state": {}}, headers=auth_headers)
    workflow_id = create_res.json()["id"]
    
    # Get
    response = client.get(f"/workflows/{workflow_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Get By ID"

def test_get_workflow_not_found(auth_headers):
    response = client.get("/workflows/non-existent-id", headers=auth_headers)
    assert response.status_code == 404

def test_update_workflow(auth_headers):
    # Create
    create_res = client.post("/workflows/", json={"name": "To Update", "canvas_state": {}}, headers=auth_headers)
    workflow_id = create_res.json()["id"]
    
    # Update
    response = client.put(f"/workflows/{workflow_id}", json={
        "name": "Updated Name",
        "status": "active"
    }, headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["status"] == "active"

def test_update_workflow_not_found(auth_headers):
    response = client.put("/workflows/non-existent-id", json={"name": "New"}, headers=auth_headers)
    assert response.status_code == 404

def test_delete_workflow(auth_headers):
    # Create
    create_res = client.post("/workflows/", json={"name": "To Delete", "canvas_state": {}}, headers=auth_headers)
    workflow_id = create_res.json()["id"]
    
    # Delete
    response = client.delete(f"/workflows/{workflow_id}", headers=auth_headers)
    assert response.status_code == 204
    
    # Verify gone
    get_res = client.get(f"/workflows/{workflow_id}", headers=auth_headers)
    assert get_res.status_code == 404

def test_delete_workflow_not_found(auth_headers):
    response = client.delete("/workflows/non-existent-id", headers=auth_headers)
    assert response.status_code == 404

# --- Execution Tests ---

@patch("app.core.executor.GraphExecutor.execute")
def test_execute_workflow_success(mock_execute, auth_headers):
    # Mock executor response
    mock_execute.return_value = {
        "results": {"1": {"output": "result"}},
        "logs": []
    }
    
    # Create workflow with nodes
    nodes = [{"id": "1", "type": "input", "data": {}}]
    create_res = client.post("/workflows/", json={
        "name": "Exec Flow",
        "canvas_state": {"nodes": nodes, "edges": []}
    }, headers=auth_headers)
    workflow_id = create_res.json()["id"]
    
    # Execute
    response = client.post(f"/workflows/{workflow_id}/execute", json={
        "initial_inputs": {"start": "now"}
    }, headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "results" in data

def test_execute_workflow_no_nodes(auth_headers):
    # Create empty workflow
    create_res = client.post("/workflows/", json={
        "name": "Empty Flow",
        "canvas_state": {}
    }, headers=auth_headers)
    workflow_id = create_res.json()["id"]
    
    response = client.post(f"/workflows/{workflow_id}/execute", json={}, headers=auth_headers)
    assert response.status_code == 400
    assert "no nodes" in response.json()["detail"].lower()
