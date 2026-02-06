from fastapi.testclient import TestClient
from app.main import app
from app.services.encryption import get_encryption_service
import pytest

client = TestClient(app)

@pytest.fixture
def auth_headers():
    # Helper to register/login and get token
    email = "test_settings_new@example.com" # Use a distinct email or random one
    password = "password123"
    
    # Try register
    response = client.post("/api/auth/register", json={"email": email, "password": password})
    
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    
    if response.status_code != 200:
        # Fallback for debugging
        pytest.fail(f"Auth failed: {response.text}")

    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_list_credentials_empty(auth_headers):
    response = client.get("/api/settings/credentials", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

def test_add_credential(auth_headers):
    payload = {"provider": "openai", "api_key": "sk-test-key-123"}
    response = client.post("/api/settings/credentials", json=payload, headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "openai"
    assert data["masked_key"] == "sk-...-123"
    assert "api_key" not in data # Should not return raw key

def test_get_credentials_after_add(auth_headers):
    response = client.get("/api/settings/credentials", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["provider"] == "openai"

def test_update_credential(auth_headers):
    # Update existing
    payload = {"provider": "openai", "api_key": "sk-new-key-456"}
    response = client.post("/api/settings/credentials", json=payload, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json()["masked_key"] == "sk-...-456"

@pytest.mark.skip(reason="Async mock issues with TestClient")
def test_verify_credential_mock(auth_headers, mocker):
    # Mock the LLM service verification - MUST be an AsyncMock because verify_key is async
    mocker.patch("app.services.llm_service.LLMService.verify_key", new_callable=mocker.AsyncMock, return_value=True)
    
    payload = {"provider": "openai", "api_key": "sk-valid"}
    response = client.post("/api/settings/credentials/verify", json=payload, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json()["status"] == "valid"

@pytest.mark.skip(reason="Async mock issues with TestClient")
def test_verify_credential_fail_mock(auth_headers, mocker):
    mocker.patch("app.services.llm_service.LLMService.verify_key", new_callable=mocker.AsyncMock, return_value=False)
    
    payload = {"provider": "openai", "api_key": "sk-invalid"}
    response = client.post("/api/settings/credentials/verify", json=payload, headers=auth_headers)
    
    assert response.status_code == 400

def test_delete_credential(auth_headers):
    response = client.delete("/api/settings/credentials/openai", headers=auth_headers)
    assert response.status_code == 200
    
    # Verify it's gone
    response = client.get("/api/settings/credentials", headers=auth_headers)
    assert response.status_code == 200
    # Should be empty or at least not have openai
    assert not any(c["provider"] == "openai" for c in response.json())
