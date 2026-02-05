# Phase 1: Project Foundation

**Timeline:** Week 1-2  
**Team:** 2 Developers  
**Status:** 🚀 Ready to Start

---

## 📋 Phase Overview

### Goal
Set up project structure, development environment, and basic "Hello World" API + Frontend with tests.

### What You'll Have By End of Phase 1
- ✅ Working monorepo structure
- ✅ Backend API with FastAPI + SQLite
- ✅ Frontend with React + TypeScript + Vite
- ✅ Tests passing with 80%+ coverage
- ✅ Error boundaries implemented
- ✅ Performance monitoring setup
- ✅ Security tools configured
- ✅ Git repository initialized
- ✅ CI/CD pipeline with quality gates

### Success Criteria
- [ ] Can run backend and see "Hello World"
- [ ] Can run frontend and see UI
- [ ] All tests passing (80%+ coverage)
- [ ] Error boundary catches errors gracefully
- [ ] Security audit passing (no high/critical issues)
- [ ] Code reviewed by both developers
- [ ] Performance baseline established
- [ ] Committed to Git
- [ ] Ready to start Phase 2

---

## 🏗️ Architecture Decisions

### Database
**Decision:** SQLite (file-based) for development
- **Why:** Zero setup, easy to start
- **File:** `agentweave.db` (auto-created)
- **Migration:** Easy switch to PostgreSQL later (same code!)

### Backend Stack
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy (supports SQLite and PostgreSQL)
- **API Style:** REST
- **Testing:** Pytest

### Frontend Stack
- **Build Tool:** Vite (fast, modern)
- **Framework:** React 18 + TypeScript
- **State:** Zustand (will add in Phase 3)
- **Styling:** Basic CSS (Tailwind in Phase 3)
- **Testing:** Vitest (Vite's test runner)

### Project Structure
**Monorepo** - Everything in one repository

```
agentweave/
├── frontend/              # React TypeScript app
│   ├── src/
│   │   ├── components/    # React components (Phase 3+)
│   │   ├── pages/         # Page components (Phase 3+)
│   │   ├── store/         # Zustand stores (Phase 3+)
│   │   └── utils/         # Helper functions
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # FastAPI Python app
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # FastAPI app entry
│   │   ├── api/           # API routes (Phase 2+)
│   │   ├── services/      # Business logic (Phase 2+)
│   │   ├── models/        # SQLAlchemy models (Phase 2+)
│   │   ├── schemas/       # Pydantic schemas (Phase 2+)
│   │   ├── db/            # Database config
│   │   │   └── database.py
│   │   └── core/          # Config, security (Phase 2+)
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_main.py
│   ├── requirements.txt
│   └── pytest.ini
│
├── shared/                # Shared code (Phase 4+)
│   └── types/             # TypeScript types shared between FE/BE
│
├── .github/
│   └── workflows/
│       └── test.yml       # CI/CD pipeline
│
├── .gitignore
├── README.md
└── agentweave.db          # SQLite database (created on first run)
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Initialize Project (15 minutes)

**Create project directory:**
```bash
# Create main folder
mkdir agentweave
cd agentweave

# Initialize Git
git init
git branch -M main

# Create folder structure
mkdir frontend backend shared .github
mkdir .github/workflows
mkdir -p backend/app/db backend/tests
```

**Create .gitignore:**
```bash
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
.venv/
ENV/
env/
*.egg-info/
.pytest_cache/
.coverage
htmlcov/

# SQLite
*.db
*.sqlite
*.sqlite3

# Node
node_modules/
dist/
build/
.env
.env.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.cursor/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
Desktop.ini

# Logs
*.log
logs/
EOF
```

---

### Step 2: Backend Setup (45 minutes)

**Navigate to backend:**
```bash
cd backend
```

**Create Python virtual environment:**
```bash
# Create venv
python -m venv venv

# Activate (choose your OS):
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Verify Python version
python --version  # Should be 3.11+
```

**Create requirements.txt:**
```bash
cat > requirements.txt << 'EOF'
# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0

# Database
sqlalchemy==2.0.25
pydantic==2.5.3

# Security (Phase 2)
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
httpx==0.26.0
EOF
```

**Install dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Create app/__init__.py:**
```bash
touch app/__init__.py
touch app/db/__init__.py
touch tests/__init__.py
```

**Create app/main.py:**
```python
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(
    title="AgentWeave API",
    description="AI Workflow Automation Platform",
    version="0.1.0"
)

# CORS middleware (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - returns welcome message"""
    return {
        "message": "Welcome to AgentWeave API!",
        "version": "0.1.0",
        "status": "Phase 1 - Setup Complete"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"  # Will implement in Phase 2
    }

@app.get("/api/v1/info")
async def api_info():
    """API information"""
    return {
        "api_version": "v1",
        "endpoints": {
            "root": "/",
            "health": "/health",
            "info": "/api/v1/info"
        }
    }
EOF
```

**Create app/db/database.py:**
```python
cat > app/db/database.py << 'EOF'
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database URL (file-based)
# Will be easy to switch to PostgreSQL later
SQLALCHEMY_DATABASE_URL = "sqlite:///./agentweave.db"

# Create engine
# connect_args is only needed for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    """
    Database session dependency.
    Use in FastAPI routes like: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create all tables
def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

# Note: When migrating to PostgreSQL, just change the URL:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/agentweave"
# Everything else stays the same!
EOF
```

**Create pytest.ini:**
```ini
cat > pytest.ini << 'EOF'
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
python_classes = Test*
asyncio_mode = auto

# Show print statements
addopts = -v -s --tb=short
EOF
```

**Create tests/test_main.py:**
```python
cat > tests/test_main.py << 'EOF'
from fastapi.testclient import TestClient
from app.main import app

# Create test client
client = TestClient(app)

def test_root_endpoint():
    """Test root endpoint returns welcome message"""
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["status"] == "Phase 1 - Setup Complete"

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"

def test_api_info():
    """Test API info endpoint"""
    response = client.get("/api/v1/info")
    assert response.status_code == 200
    
    data = response.json()
    assert "api_version" in data
    assert data["api_version"] == "v1"
    assert "endpoints" in data

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.get("/", headers={"Origin": "http://localhost:5173"})
    assert response.status_code == 200
    # CORS headers should be present
    assert "access-control-allow-origin" in response.headers
EOF
```

**Run tests:**
```bash
pytest

# Expected output:
# ===== test session starts =====
# collected 4 items
# tests/test_main.py::test_root_endpoint PASSED
# tests/test_main.py::test_health_check PASSED
# tests/test_main.py::test_api_info PASSED
# tests/test_main.py::test_cors_headers PASSED
# ===== 4 passed in 0.5s =====
```

**Run backend server:**
```bash
uvicorn app.main:app --reload --port 8000

# Should see:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# Open http://localhost:8000 in browser - should see JSON response!
```

---

### Step 3: Frontend Setup with Vite (30 minutes)

**Navigate to frontend:**
```bash
cd ../frontend
```

**Create React app with Vite:**
```bash
# Create Vite project with React + TypeScript
npm create vite@latest . -- --template react-ts

# This will create a Vite project in current directory
# Choose: React → TypeScript
```

**Install dependencies:**
```bash
npm install
npm install axios
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Update package.json scripts:**
```bash
# Add test script to package.json
# Open package.json and update "scripts":
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Create vitest.config.ts:**
```typescript
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
EOF
```

**Create test setup:**
```bash
mkdir src/test
cat > src/test/setup.ts << 'EOF'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
EOF
```

**Clean up default files:**
```bash
# Remove default Vite files we'll replace
rm src/App.css src/index.css
```

**Create src/index.tsx:**
```typescript
cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
```

**Create src/App.tsx:**
```typescript
cat > src/App.tsx << 'EOF'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface ApiResponse {
  message: string;
  version: string;
  status: string;
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from backend
    axios.get<ApiResponse>('http://localhost:8000/')
      .then(response => {
        setApiData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to connect to backend');
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AgentWeave</h1>
        <p className="subtitle">AI Workflow Automation Platform</p>
        
        <div className="status-card">
          {loading && <p>Loading...</p>}
          
          {error && (
            <div className="error">
              <p>{error}</p>
              <p className="hint">Make sure backend is running on port 8000</p>
            </div>
          )}
          
          {apiData && (
            <div className="success">
              <h2>✅ Backend Connected!</h2>
              <p><strong>Message:</strong> {apiData.message}</p>
              <p><strong>Version:</strong> {apiData.version}</p>
              <p><strong>Status:</strong> {apiData.status}</p>
            </div>
          )}
        </div>

        <div className="next-steps">
          <h3>Phase 1 Complete! 🎉</h3>
          <p>Next: Phase 2 - Authentication System</p>
        </div>
      </header>
    </div>
  );
}

export default App;
EOF
```

**Create src/App.css:**
```css
cat > src/App.css << 'EOF'
.App {
  text-align: center;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 20px;
}

.App-header h1 {
  margin: 0;
  font-size: 3em;
  animation: fadeIn 1s;
}

.subtitle {
  margin: 10px 0 40px 0;
  font-size: 1.2em;
  opacity: 0.9;
}

.status-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  min-width: 400px;
  margin: 20px 0;
}

.success {
  animation: slideIn 0.5s;
}

.success h2 {
  margin-top: 0;
  font-size: 1.5em;
}

.success p {
  font-size: 0.9em;
  margin: 10px 0;
}

.error {
  color: #ff6b6b;
}

.error .hint {
  font-size: 0.8em;
  opacity: 0.8;
  margin-top: 10px;
}

.next-steps {
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.next-steps h3 {
  margin-top: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
EOF
```

**Create src/index.css:**
```css
cat > src/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF
```

**Create src/App.test.tsx (Vitest tests):**
```typescript
cat > src/App.test.tsx << 'EOF'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('App', () => {
  it('renders AgentWeave title', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        message: 'Test message',
        version: '0.1.0',
        status: 'Phase 1 - Setup Complete'
      }
    })
    
    render(<App />)
    expect(screen.getByText(/AgentWeave/i)).toBeInTheDocument()
  })

  it('fetches data from backend', async () => {
    const mockData = {
      message: 'Hello',
      version: '0.1.0',
      status: 'Phase 1 - Setup Complete'
    }
    
    vi.mocked(axios.get).mockResolvedValue({ data: mockData })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/Backend Connected/i)).toBeInTheDocument()
    })
  })
})
EOF
```

**Run frontend:**
```bash
npm run dev

# Vite dev server starts on http://localhost:5173
# Open in browser - should see: "Backend Connected!" message
```

**Update backend CORS for Vite:**
```bash
# Edit backend/app/main.py
# Change port from 3000 to 5173:
allow_origins=["http://localhost:5173"]  # Vite default port
```

**Run frontend tests:**
```bash
npm test

# Should see Vitest running tests
# ✓ src/App.test.tsx (2 tests)
```

---

### Step 3.5: Error Boundaries (15 minutes)

**Why:** Catch JavaScript errors gracefully instead of showing blank screen

**Create src/components/ErrorBoundary.tsx:**
```typescript
cat > src/components/ErrorBoundary.tsx << 'EOF'
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (later: send to logging service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // TODO Phase 5: Send to error tracking service (Sentry)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1>🚨 Oops! Something went wrong</h1>
          <p style={{ fontSize: '1.2em', margin: '20px 0' }}>
            We're sorry for the inconvenience. The error has been logged.
          </p>
          
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px',
              fontSize: '1em',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Try Again
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '800px',
              width: '100%'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                🐛 Error Details (Development Only)
              </summary>
              <pre style={{
                marginTop: '10px',
                whiteSpace: 'pre-wrap',
                fontSize: '0.8em'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
EOF
```

**Update src/main.tsx to use ErrorBoundary:**
```typescript
# Edit src/main.tsx to wrap App with ErrorBoundary:
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
EOF
```

**Create ErrorBoundary test:**
```typescript
cat > src/components/ErrorBoundary.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// Component that throws error
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    // Suppress error console output for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
EOF
```

---

### Step 3.6: Code Coverage Setup (10 minutes)

**Update package.json to add coverage scripts:**
```json
# Add to frontend/package.json "scripts" section:
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

**Install coverage tools:**
```bash
cd frontend
npm install -D @vitest/coverage-v8
```

**Update vitest.config.ts for coverage:**
```typescript
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/main.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
})
EOF
```

**Update backend for coverage:**
```bash
cd backend
pip install pytest-cov

# Add to pytest.ini:
cat > pytest.ini << 'EOF'
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    -v
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-report=xml
    --cov-fail-under=80
EOF
```

**Run coverage reports:**
```bash
# Frontend:
cd frontend
npm run test:coverage
# Opens HTML report at coverage/index.html

# Backend:
cd backend
pytest --cov=app --cov-report=html
# Opens HTML report at htmlcov/index.html
```

---

### Step 3.7: Performance Monitoring Setup (15 minutes)

**Create performance utility:**
```typescript
cat > src/utils/performance.ts << 'EOF'
/**
 * Performance monitoring utilities
 * Phase 1: Basic metrics
 * Later phases: Send to analytics service
 */

export const logPageLoad = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.log('📊 Performance Metrics:');
    console.log(`  Page Load Time: ${pageLoadTime}ms`);
    console.log(`  Backend Response: ${connectTime}ms`);
    console.log(`  DOM Render Time: ${renderTime}ms`);

    // TODO Phase 5: Send to analytics
    // analytics.track('page_performance', { pageLoadTime, connectTime, renderTime });
  });
};

export const measureAPICall = async <T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    console.log(`⚡ API Call [${name}]: ${duration.toFixed(2)}ms`);
    
    // Warn if slow
    if (duration > 1000) {
      console.warn(`⚠️ Slow API call detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ API Call [${name}] failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
};

// Bundle size checker (run in dev mode)
export const checkBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('💾 Check bundle size: npm run build && du -sh dist');
  }
};
EOF
```

**Update App.tsx to use performance monitoring:**
```typescript
# Add to src/App.tsx imports:
import { logPageLoad, measureAPICall } from './utils/performance';

# In useEffect:
useEffect(() => {
  logPageLoad();
  
  measureAPICall('health-check', () => 
    axios.get<ApiResponse>('http://localhost:8000/')
  )
    .then(response => {
      setApiData(response.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to connect to backend');
      setLoading(false);
      console.error(err);
    });
}, []);
```

**Add Vite bundle analyzer:**
```bash
cd frontend
npm install -D rollup-plugin-visualizer

# Update vite.config.ts:
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          axios: ['axios']
        }
      }
    }
  }
})
EOF
```

**Build and check bundle size:**
```bash
npm run build
# Opens bundle visualization
# Target: Initial load < 500KB
```

---

### Step 3.8: Security Configuration (20 minutes)

**Frontend security setup:**
```bash
cd frontend

# Check for vulnerabilities
npm audit

# Fix auto-fixable issues
npm audit fix

# For high/critical issues that can't be auto-fixed:
# Review manually and update dependencies
```

**Create .env.example:**
```bash
cat > .env.example << 'EOF'
# Frontend Environment Variables
# Copy to .env.local and fill in values

# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Environment
VITE_ENV=development

# DO NOT commit .env.local to git!
EOF
```

**Update .gitignore:**
```bash
cat >> ../.gitignore << 'EOF'

# Environment files
.env
.env.local
.env.*.local
**/*.env

# Coverage reports
coverage/
htmlcov/
.coverage

# Build artifacts
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Database
*.db
*.sqlite
*.sqlite3
EOF
```

**Backend security setup:**
```bash
cd backend

# Install security tools
pip install pip-audit bandit python-dotenv

# Audit dependencies
pip-audit

# Run security linter
bandit -r app/

# Create .env.example:
cat > .env.example << 'EOF'
# Backend Environment Variables
# Copy to .env and fill in values

# Database
DATABASE_URL=sqlite:///./agentweave.db

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENVIRONMENT=development

# DO NOT commit .env to git!
EOF
```

**Update backend/app/main.py for environment variables:**
```python
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AgentWeave API",
    description="AI Workflow Automation Platform",
    version="0.1.0"
)

# Get allowed origins from environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Welcome to AgentWeave API! 🤖",
        "version": "0.1.0",
        "status": "Phase 1 - Setup Complete",
        "api_version": "v1",
        "endpoints": {
            "health": "/",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "database": "connected"  # TODO: Add actual DB check in Phase 2
    }
EOF
```

**Create backend security test:**
```python
cat > tests/test_security.py << 'EOF'
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
EOF
```

**Add security to CI/CD pipeline:**
```yaml
# Add to .github/workflows/test.yml in backend-tests job:

      - name: Security audit
        working-directory: ./backend
        run: |
          pip install pip-audit bandit
          pip-audit
          bandit -r app/ -ll

# Add to frontend-tests job:

      - name: Security audit
        working-directory: ./frontend
        run: npm audit --audit-level=high
```

---

### Step 4: GitHub Actions (CI/CD) (15 minutes)

**Create .github/workflows/test.yml:**
```yaml
cat > ../.github/workflows/test.yml << 'EOF'
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      
      - name: Run tests
        working-directory: ./backend
        run: |
          pytest -v --tb=short
      
      - name: Check test coverage
        working-directory: ./backend
        run: |
          pip install pytest-cov
          pytest --cov=app --cov-report=term-missing
  
  frontend-tests:
    name: Frontend Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run tests
        working-directory: ./frontend
        run: npm test -- --run --coverage
      
      - name: Build
        working-directory: ./frontend
        run: npm run build
EOF
```

---

### Step 5: Create Root README (10 minutes)

**Create README.md in project root:**
```markdown
cat > ../README.md << 'EOF'
# AgentWeave

AI Workflow Automation Platform - Build, deploy, and manage AI agent workflows visually.

## Current Status: Phase 1 Complete! ✅

- ✅ Project structure set up
- ✅ Backend API running (FastAPI + SQLite)
- ✅ Frontend UI running (React + TypeScript)
- ✅ Tests passing (4 backend, frontend working)
- ✅ CI/CD pipeline configured

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Setup

1. **Clone repository:**
```bash
git clone <your-repo-url>
cd agentweave
```

2. **Start Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

3. **Start Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

4. **Open in browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Run Tests

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## Project Structure

```
agentweave/
├── frontend/          # React TypeScript app
├── backend/           # FastAPI Python app
├── shared/            # Shared code
├── .github/           # CI/CD
└── agentweave.db      # SQLite database
```

## Development

- **Backend:** Python 3.11, FastAPI, SQLAlchemy, SQLite
- **Frontend:** Vite, React 18, TypeScript, Axios
- **Testing:** Pytest, Vitest
- **CI/CD:** GitHub Actions

## Next Steps

✅ Phase 1: Project Setup (Complete!)  
🚀 Phase 2: Authentication System (Next)

See `/docs` folder for detailed documentation.

## License

[Your License]
EOF
```

---

## ✅ Phase 1 Completion Checklist

Go through this checklist before moving to Phase 2:

### Infrastructure
- [ ] Git repository initialized
- [ ] `.gitignore` configured properly (includes .env, coverage, etc.)
- [ ] Folder structure created
- [ ] Virtual environment created (Python)
- [ ] Node modules installed (frontend)
- [ ] Environment variable templates created (.env.example)

### Backend
- [ ] FastAPI app running on http://localhost:8000
- [ ] Can see JSON response in browser
- [ ] API docs working at http://localhost:8000/docs
- [ ] Database file created (`agentweave.db`)
- [ ] All backend tests passing (including security tests)
- [ ] Environment variables loaded from .env
- [ ] CORS configured properly

### Frontend
- [ ] Vite dev server running on http://localhost:5173
- [ ] Can see UI with gradient background
- [ ] Frontend successfully fetches data from backend
- [ ] Shows "Backend Connected!" message
- [ ] No console errors in browser
- [ ] Error boundary working (try throwing error to test)

### Testing & Coverage
- [ ] Backend tests passing: `pytest --cov=app` → All tests ✅
- [ ] Backend code coverage >= 80%
- [ ] Frontend tests passing: `npm test` → All tests ✅
- [ ] Frontend code coverage >= 80%
- [ ] Coverage reports generated (HTML)
- [ ] ErrorBoundary test passing
- [ ] Security tests passing
- [ ] CI/CD pipeline file created

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms (health check)
- [ ] Bundle size checked: `npm run build` (< 500KB initial)
- [ ] Performance logging working in console
- [ ] No memory leaks detected
- [ ] Build optimization configured

### Security
- [ ] No secrets committed to Git
- [ ] `.env` files in `.gitignore`
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] `pip-audit` shows no high/critical vulnerabilities
- [ ] `bandit` security scan passing
- [ ] CORS configured (not allowing all origins)
- [ ] Environment variables used for sensitive config
- [ ] Security tests passing

### Error Handling
- [ ] ErrorBoundary component created and tested
- [ ] ErrorBoundary wraps entire app
- [ ] User-friendly error messages shown
- [ ] Backend has try/catch in endpoints
- [ ] Errors logged to console (with context)
- [ ] Error states tested

### Code Quality
- [ ] All code committed to Git
- [ ] Code reviewed by both developers
- [ ] README.md created and accurate
- [ ] Code is readable and well-commented
- [ ] No TypeScript 'any' types (use proper types)
- [ ] No console.logs left in production code (except error logging)
- [ ] Consistent code formatting

### Demo
- [ ] Can show working backend (browser)
- [ ] Can show working frontend (browser)
- [ ] Frontend talks to backend successfully
- [ ] Can show error boundary working
- [ ] Can show test coverage reports
- [ ] Can show performance metrics in console
- [ ] Can explain the architecture

### Documentation
- [ ] README.md complete with setup instructions
- [ ] .env.example files created
- [ ] Code has inline comments for complex logic
- [ ] Both developers can explain the codebase

### Knowledge Transfer
- [ ] Both developers understand the code structure
- [ ] Both developers can run the project locally
- [ ] Both developers know how to add tests
- [ ] Both developers know how to check coverage
- [ ] Both developers know how to run security audits
- [ ] Both developers understand error boundary usage

---

## 🎉 Celebrate Phase 1 Completion!

**What you've accomplished:**
- ✅ Professional project structure
- ✅ Working full-stack application (Backend + Frontend)
- ✅ Tests passing with 80%+ coverage
- ✅ Error boundaries protecting the UI
- ✅ Performance monitoring in place
- ✅ Security tools configured
- ✅ CI/CD pipeline with quality gates
- ✅ Production-ready foundation
- ✅ Ready for Phase 2!

**Take these actions:**
1. **Take screenshots** of:
   - Backend running (http://localhost:8000)
   - Frontend showing "Backend Connected!" (http://localhost:5173)
   - Tests passing with coverage reports
   - Error boundary working
   - Performance metrics in console
   - Security audits passing
   - Bundle size analysis

2. **Verify everything works:**
```bash
# Backend
cd backend
pytest --cov=app
pip-audit
bandit -r app/

# Frontend
cd frontend
npm test -- --coverage
npm audit
npm run build

# All should pass! ✅
```

3. **Commit everything:**
```bash
git add .
git commit -m "feat: complete Phase 1 - production-ready foundation

## Features
- Set up monorepo structure (backend/ + frontend/)
- Add FastAPI backend with health endpoints
- Add Vite + React + TypeScript frontend
- Configure SQLite database with SQLAlchemy

## Quality & Testing
- Add pytest with 80%+ coverage
- Add Vitest with 80%+ coverage
- Configure GitHub Actions CI/CD
- Add ErrorBoundary for graceful error handling

## Performance
- Performance monitoring utilities
- Bundle size optimization
- API response time tracking
- Vite for fast builds

## Security
- Environment variable configuration
- Security audits (pip-audit, npm audit, bandit)
- CORS properly configured
- No secrets in code

## Documentation
- Comprehensive README
- .env.example templates
- Code quality standards documented

✅ Phase 1 complete! All tests passing, 80%+ coverage, security audits clean."

git push origin main
```

3. **Update project status:**
   - Mark Phase 1 as complete
   - Celebrate with your teammate! 🎊
   - Take a break before starting Phase 2

---

## 🐛 Troubleshooting

### Backend won't start
**Error:** "Module not found"
```bash
# Make sure venv is activated:
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate      # Windows

# Reinstall dependencies:
pip install -r requirements.txt
```

### Frontend can't connect to backend
**Error:** "Network Error" or CORS error
```bash
# 1. Make sure backend is running:
#    Open http://localhost:8000 - should see JSON

# 2. Check CORS in backend main.py:
#    allow_origins=["http://localhost:5173"]  # Vite dev server

# 3. Clear browser cache and reload
```

### Tests failing
**Error:** Tests won't run
```bash
# Backend:
cd backend
pytest -v  # Verbose mode to see what's failing

# Frontend:
cd frontend
npm test -- --verbose
```

### Port already in use
**Error:** "Port 8000 is already in use"
```bash
# Kill the process:
# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

### SQLite database locked
**Error:** "database is locked"
```bash
# Stop all running processes
# Delete the database file:
rm agentweave.db

# Restart backend - it will recreate the database
```

### Still stuck?
1. Check the error message carefully
2. Google the error
3. Ask ChatGPT/Claude
4. Pair program with your teammate
5. Take a break and come back fresh

**Don't stay stuck for more than 2 hours!**

---

## 📚 Code Snippets Reference

### Running Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Running Frontend
```bash
cd frontend
npm start
```

### Running Tests
```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

### Common Git Commands
```bash
# Check status
git status

# Add all files
git add .

# Commit with message
git commit -m "your message"

# Push to GitHub
git push origin main

# Create new branch
git checkout -b phase-2-auth
```

---

## 🔜 What's Next: Phase 2

In Phase 2, we'll build:
- User registration (email + password)
- Login system
- JWT authentication
- Protected routes
- User dashboard

**Estimated time:** 2 weeks

See `phases/phase2.md` (will create when starting Phase 2)

---

## 📞 Need Help?

- **Documentation:** See main README.md
- **Requirements:** See SMARTBOTS_REQUIREMENTS.md
- **Overview:** See AGILE_EXECUTION_PLAN.md
- **Issues:** Create GitHub issue
- **Questions:** Ask your teammate!

---

**Phase 1 Complete! Time to move to Phase 2! 🚀**
