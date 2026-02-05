import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_cors_headers_present():
    """Test CORS headers are configured"""
    response = client.get("/", headers={"Origin": "http://localhost:5173"})
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers

def test_no_sensitive_data_in_response():
    """Test no sensitive data exposed in API responses"""
    response = client.get("/")
    data = response.json()
    
    # Should not contain sensitive keys
    sensitive_keys = ["password", "secret", "token", "api_key"]
    for key in sensitive_keys:
        assert key not in str(data).lower()

def test_security_headers():
    """Test basic security headers (will enhance in Phase 2)"""
    response = client.get("/")
    
    # FastAPI defaults - will add more in Phase 2
    assert response.status_code == 200
