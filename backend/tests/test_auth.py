from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine
from app.models.user import User
from app.core.security import verify_password
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
import pytest


client = TestClient(app)


# Create tables before tests
@pytest.fixture(autouse=True)
def setup_database():
    """Create tables before each test and drop after"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_user():
    """Test user registration"""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_register_duplicate_email():
    """Test duplicate email rejection"""
    # Register first user
    client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "password123"
    })
    
    # Try to register again with same email
    response = client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "password456"
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_login_success():
    """Test successful login"""
    # Register user
    client.post("/auth/register", json={
        "email": "login@example.com",
        "password": "password123"
    })
    
    # Login
    response = client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_login_wrong_password():
    """Test login with wrong password"""
    # Register user
    client.post("/auth/register", json={
        "email": "wrong@example.com",
        "password": "correctpassword"
    })
    
    # Try login with wrong password
    response = client.post("/auth/login", json={
        "email": "wrong@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_login_nonexistent_user():
    """Test login with non-existent email"""
    response = client.post("/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "password123"
    })
    assert response.status_code == 401


def test_get_current_user():
    """Test getting current user info"""
    # Register and get token
    reg_response = client.post("/auth/register", json={
        "email": "current@example.com",
        "password": "password123",
        "full_name": "Current User"
    })
    token = reg_response.json()["access_token"]
    
    # Get user info
    response = client.get("/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "current@example.com"
    assert data["full_name"] == "Current User"
    assert "id" in data
    assert data["is_active"] == True



def test_get_me_without_token():
    """Test accessing protected route without token"""
    response = client.get("/auth/me")
    assert response.status_code == 403  # Forbidden


def test_get_me_invalid_token():
    """Test accessing protected route with invalid token"""
    response = client.get("/auth/me", headers={
        "Authorization": "Bearer invalid_token_here"
    })
    assert response.status_code == 401


def test_password_hashing():
    """Test that passwords are hashed in database"""
    # Register user
    client.post("/auth/register", json={
        "email": "hash@example.com",
        "password": "mypassword123"
    })
    
    # Check password is hashed in DB
    db = SessionLocal()
    user = db.query(User).filter(User.email == "hash@example.com").first()
    
    assert user.hashed_password != "mypassword123"
    assert verify_password("mypassword123", user.hashed_password)
    
    db.close()


def test_register_short_password():
    """Test registration with password too short"""
    response = client.post("/auth/register", json={
        "email": "short@example.com",
        "password": "short"  # Less than 8 characters
    })
    assert response.status_code == 422  # Validation error


def test_register_invalid_email():
    """Test registration with invalid email"""
    response = client.post("/auth/register", json={
        "email": "not-an-email",
        "password": "password123"
    })
    assert response.status_code == 422  # Validation error
