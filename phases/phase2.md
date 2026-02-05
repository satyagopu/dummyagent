# Phase 2: Authentication System

**Timeline:** Week 3-4  
**Team:** 2 Developers  
**Status:** 🚀 Ready to Start

---

## 📋 Phase Overview

### Goal
Implement secure user authentication with email/password registration, JWT-based login, and protected routes.

### What You'll Have By End of Phase 2
- ✅ User registration with email/password
- ✅ Login system with JWT tokens
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ User dashboard showing profile info
- ✅ Modern login/register UI with animations
- ✅ Secure password hashing (bcrypt)
- ✅ Tests passing with 80%+ coverage
- ✅ Token persistence (localStorage)

### Success Criteria
- [ ] User can register with email/password
- [ ] User can login and receive JWT token
- [ ] Protected routes redirect to login when not authenticated
- [ ] Dashboard displays user information
- [ ] Passwords are hashed in database
- [ ] All tests passing (8+ backend, 4+ frontend)
- [ ] Security audit passing
- [ ] Code reviewed by both developers

---

## 🏗️ Architecture Overview

### Authentication Flow
```
1. User Registration:
   Email + Password → Hash Password → Save to DB → Auto Login

2. User Login:
   Email + Password → Verify Hash → Generate JWT → Return Token

3. Protected Routes:
   Check Token → Validate JWT → Allow Access OR Redirect to Login

4. Token Storage:
   Store JWT in localStorage → Include in API requests
```

### Database Schema
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Backend - User Model (30 minutes)

**Create app/models/__init__.py:**
```bash
cd backend
mkdir -p app/models
touch app/models/__init__.py
```

**Create app/models/user.py:**
```python
from sqlalchemy import Boolean, Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<User {self.email}>"
```

---

### Step 2: Backend - Security Utilities (30 minutes)

**Create app/core/__init__.py:**
```bash
mkdir -p app/core
touch app/core/__init__.py
```

**Create app/core/security.py:**
```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-change-in-production"  # TODO: Move to .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

---

### Step 3: Backend - Pydantic Schemas (20 minutes)

**Create app/schemas/__init__.py:**
```bash
mkdir -p app/schemas
touch app/schemas/__init__.py
```

**Create app/schemas/auth_schemas.py:**
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    """Schema for user data response"""
    id: uuid.UUID
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
```

---

### Step 4: Backend - Auth API Endpoints (45 minutes)

**Create app/api/__init__.py:**
```bash
mkdir -p app/api
touch app/api/__init__.py
```

**Create app/api/auth.py:**
```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth_schemas import UserRegister, UserLogin, Token, UserResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_pw = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pw,
        full_name=user_data.full_name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user
```

---

### Step 5: Backend - Update Main App (15 minutes)

**Update app/main.py:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth
from app.db.database import create_tables

# Create FastAPI app
app = FastAPI(
    title="AgentWeave API",
    description="AI Workflow Automation Platform",
    version="0.2.0"  # Updated for Phase 2
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Include routers
app.include_router(auth.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AgentWeave API!",
        "version": "0.2.0",
        "status": "Phase 2 - Authentication Complete"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "database": "connected"}
```

---

### Step 6: Backend - Tests (30 minutes)

**Create tests/test_auth.py:**
```python
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine
import pytest

client = TestClient(app)

# Create tables before tests
@pytest.fixture(autouse=True)
def setup_database():
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

def test_get_me_without_token():
    """Test accessing protected route without token"""
    response = client.get("/auth/me")
    assert response.status_code == 403  # Forbidden

def test_password_hashing():
    """Test that passwords are hashed in database"""
    from app.core.security import verify_password
    from app.db.database import SessionLocal
    from app.models.user import User
    
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
```

**Run backend tests:**
```bash
cd backend
pytest tests/test_auth.py -v --cov=app/api/auth --cov=app/core/security
```

---

### Step 7: Frontend - Install UI Libraries (10 minutes)

```bash
cd frontend

# Install routing
npm install react-router-dom

# Install state management
npm install zustand

# Install form handling
npm install react-hook-form @hookform/resolvers zod

# Install UI components (we'll use shadcn/ui in Phase 3, for now basic styling)
npm install sonner  # Toast notifications
```

---

### Step 8: Frontend - Auth Store (20 minutes)

**Create src/store/auth-store.ts:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const API_URL = 'http://localhost:8000';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        
        const { access_token } = response.data;
        set({ token: access_token, isAuthenticated: true });
        
        // Fetch user data
        await get().fetchUser();
      },

      register: async (email: string, password: string, fullName?: string) => {
        const response = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          full_name: fullName,
        });
        
        const { access_token } = response.data;
        set({ token: access_token, isAuthenticated: true });
        
        // Fetch user data
        await get().fetchUser();
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          set({ user: response.data });
        } catch (error) {
          // Token invalid, logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

### Step 9: Frontend - Login Page (30 minutes)

**Create src/pages/LoginPage.tsx:**
```typescript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'sonner';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🤖 AgentWeave</h1>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
```

**Create src/pages/LoginPage.css:**
```css
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

.auth-card h1 {
  margin: 0 0 10px 0;
  font-size: 2em;
  text-align: center;
  color: #667eea;
}

.auth-card h2 {
  margin: 0 0 5px 0;
  font-size: 1.5em;
  text-align: center;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### Step 10: Frontend - Register Page (20 minutes)

**Create src/pages/RegisterPage.tsx:**
```typescript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'sonner';
import './LoginPage.css';  // Reuse same styles

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🤖 AgentWeave</h1>
        <h2>Create Account</h2>
        <p className="subtitle">Start building AI workflows</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name (Optional)</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <small style={{ color: '#666' }}>Minimum 8 characters</small>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
```

---

### Step 11: Frontend - Dashboard Page (25 minutes)

**Create src/pages/DashboardPage.tsx:**
```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🤖 AgentWeave</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user.full_name || user.email}! 👋</h2>
          <p>Your AI workflow automation platform is ready.</p>
        </div>

        <div className="user-card">
          <h3>Profile Information</h3>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.full_name || 'Not set'}</p>
            <p><strong>Status:</strong> {user.is_active ? '✅ Active' : '❌ Inactive'}</p>
            <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="next-steps">
          <h3>🎉 Phase 2 Complete!</h3>
          <p>Authentication system is working!</p>
          <p className="hint">Next: Phase 3 - Workflow Canvas</p>
        </div>
      </div>
    </div>
  );
}
```

**Create src/pages/DashboardPage.css:**
```css
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-header h1 {
  color: white;
  margin: 0;
  font-size: 1.8em;
}

.btn-logout {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  animation: slideUp 0.5s ease-out;
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.welcome-section p {
  margin: 0;
  color: #666;
}

.user-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  animation: slideUp 0.6s ease-out;
}

.user-card h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.user-info p {
  margin: 10px 0;
  color: #555;
}

.next-steps {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  animation: slideUp 0.7s ease-out;
}

.next-steps h3 {
  margin: 0 0 10px 0;
  color: #667eea;
}

.next-steps p {
  margin: 5px 0;
  color: #555;
}

.hint {
  color: #999;
  font-style: italic;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5em;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### Step 12: Frontend - Protected Route Component (15 minutes)

**Create src/components/ProtectedRoute.tsx:**
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

### Step 13: Frontend - Update App with Routing (20 minutes)

**Update src/App.tsx:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Testing \u0026 Verification

### Backend Tests
```bash
cd backend
pytest tests/test_auth.py -v --cov=app/api/auth --cov=app/core/security

# Expected: 8+ tests passing, coverage ≥80%
```

### Frontend Manual Testing
1. **Registration:**
   - Go to http://localhost:5173/register
   - Fill form and submit
   - Should redirect to dashboard

2. **Login:**
   - Go to http://localhost:5173/login
   - Enter credentials
   - Should redirect to dashboard

3. **Protected Routes:**
   - Logout
   - Try accessing /dashboard
   - Should redirect to /login

4. **Token Persistence:**
   - Login
   - Refresh page
   - Should stay logged in

### Security Audit
```bash
# Backend
cd backend
pip-audit
bandit -r app/

# Frontend
cd frontend
npm audit --audit-level=high
```

---

## 📝 Completion Checklist

- [ ] Backend user model created
- [ ] Password hashing implemented
- [ ] JWT token generation working
- [ ] Auth API endpoints functional
- [ ] Backend tests passing (8+ tests)
- [ ] Frontend auth store created
- [ ] Login page implemented
- [ ] Register page implemented
- [ ] Dashboard page implemented
- [ ] Protected routes working
- [ ] Token persistence working
- [ ] Security audit passing
- [ ] Code reviewed
- [ ] Documentation updated

---

## 🎉 Success!

Once all checklist items are complete, you have:
- ✅ Secure authentication system
- ✅ Beautiful modern UI
- ✅ Protected routes
- ✅ Token-based auth
- ✅ Ready for Phase 3!

**Next:** Phase 3 - Modern UI \u0026 Workflow Canvas
