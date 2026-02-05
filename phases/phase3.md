# Phase 3: Modern UI & Canvas Foundation

**Timeline:** Week 5-7 (3 weeks)  
**Team:** 2 Developers  
**Status:** 🚀 Ready to Start

---

## 📋 Phase Overview

### Goal
Transform AgentWeave with a **stunning, premium UI** and add the visual workflow canvas foundation.

### What You'll Have By End of Phase 3
- ✨ **Beautiful Modern UI** - Glass morphism, gradients, smooth animations
- 🎨 **Design System** - shadcn/ui components with custom styling
- 🎭 **Framer Motion** - Page transitions and micro-animations
- 📊 **Dashboard** - Animated workflow cards with status indicators
- 🖼️ **ReactFlow Canvas** - Interactive workflow builder foundation
- 🎯 **CRUD Operations** - Create, read, update, delete workflows
- 💾 **Workflow Persistence** - Save workflow state to database
- 🧪 **Tests Passing** - 80%+ coverage maintained
- 📱 **Responsive Design** - Works beautifully on all devices

### Success Criteria
- [ ] UI looks premium and modern (glass effects, gradients)
- [ ] All pages have smooth Framer Motion animations
- [ ] Dashboard displays workflows with beautiful cards
- [ ] Can create, edit, delete workflows
- [ ] ReactFlow canvas renders and allows node placement
- [ ] Workflow state persists to database
- [ ] Dark mode works perfectly
- [ ] Mobile responsive
- [ ] All tests passing (80%+ coverage)
- [ ] Code reviewed by both developers

---

## 🎨 UI Transformation Goals

### Visual Excellence Checklist
- ✨ **Gradient backgrounds** on every page
- 🪟 **Glass morphism** effects (backdrop blur)
- 🎭 **Smooth animations** (Framer Motion)
- 🎨 **Color-coded status** badges (blue=active, green=success, red=error)
- 💎 **Lucide icons** throughout
- 🎪 **Toast notifications** for all user actions
- 📐 **Card-based layouts** with subtle shadows
- 🌈 **Consistent spacing** and typography

### Design Inspiration
Think: **Linear, Vercel, Stripe** - Premium SaaS aesthetics

---

## 🚀 Step-by-Step Implementation

### Step 1: Install UI Libraries (20 minutes)

**Install shadcn/ui (Component Library):**
```bash
cd frontend

# Initialize shadcn/ui
npx shadcn@latest init

# When prompted:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind config: Yes
# - Components directory: src/components
# - Utils directory: src/lib
# - React Server Components: No
# - Write config: Yes

# Install core components
npx shadcn@latest add button card input label badge separator tabs dialog dropdown-menu popover tooltip context-menu
```

**Install Animation & Icon Libraries:**
```bash
# Framer Motion for animations
npm install framer-motion

# Lucide React for icons
npm install lucide-react

# Toast notifications
npm install sonner

# Form handling (already installed in Phase 2, but verify)
npm install react-hook-form @hookform/resolvers zod
```

**Install ReactFlow for Canvas:**
```bash
npm install reactflow
```

**Verify installations:**
```bash
npm list framer-motion lucide-react sonner reactflow
```

---

### Step 2: Configure Tailwind with Design Tokens (15 minutes)

**Update `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(142, 76%, 36%)",
          foreground: "hsl(0, 0%, 100%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: 0, transform: "translateX(-10px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in": "slide-in 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Update `src/index.css` with CSS variables:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### Step 3: Create Layout Components (30 minutes)

**Create `src/components/layout/AppLayout.tsx`:**
```typescript
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header with Glass Effect */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  🤖 AgentWeave
                </h1>
              </motion.div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/workflows">
                <Button variant="ghost">Workflows</Button>
              </Link>
            </nav>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

---

### Step 4: Create Beautiful Dashboard (45 minutes)

**Create `src/pages/DashboardPage.tsx`:**
```typescript
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Edit, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  last_run: string;
  executions_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch workflows from API
    // For now, mock data
    setTimeout(() => {
      setWorkflows([
        {
          id: '1',
          name: 'Customer Support Agent',
          description: 'AI-powered customer support chatbot',
          status: 'active',
          last_run: '2 hours ago',
          executions_count: 450,
          created_at: '2026-01-15',
        },
        {
          id: '2',
          name: 'Email Assistant',
          description: 'Automated email responses',
          status: 'active',
          last_run: '1 day ago',
          executions_count: 120,
          created_at: '2026-01-20',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Play className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.full_name || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your AI workflows and deployments
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="shadow-accent">
          <CardHeader className="pb-3">
            <CardDescription>Total Workflows</CardDescription>
            <CardTitle className="text-3xl">{workflows.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-accent">
          <CardHeader className="pb-3">
            <CardDescription>Active Deployments</CardDescription>
            <CardTitle className="text-3xl">
              {workflows.filter(w => w.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-accent">
          <CardHeader className="pb-3">
            <CardDescription>Total Executions</CardDescription>
            <CardTitle className="text-3xl">
              {workflows.reduce((sum, w) => sum + w.executions_count, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Workflows Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Workflows</h2>
          <Link to="/workflows/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <Card className="shadow-accent">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No workflows yet. Create your first AI workflow!
              </p>
              <Link to="/workflows/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="shadow-accent hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                      {getStatusBadge(workflow.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last run:</span>
                        <span>{workflow.last_run}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Executions:</span>
                        <span className="font-medium">{workflow.executions_count}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Link to={`/workflows/${workflow.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toast.error('Delete not implemented yet')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Step 5: Backend - Workflow Model & API (45 minutes)

**Create `backend/app/models/workflow.py`:**
```python
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.db.database import Base

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    canvas_state = Column(JSON, nullable=True, default={})  # ReactFlow state
    status = Column(String(50), default="inactive")  # active, inactive, error
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="workflows")
    
    def __repr__(self):
        return f"<Workflow {self.name}>"
```

**Update `backend/app/models/user.py`:**
```python
# Add to User model:
from sqlalchemy.orm import relationship

# Inside User class:
workflows = relationship("Workflow", back_populates="user", cascade="all, delete-orphan")
```

**Create `backend/app/schemas/workflow_schemas.py`:**
```python
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

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
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    description: Optional[str]
    canvas_state: Dict[str, Any]
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

**Create `backend/app/api/workflows.py`:**
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.workflow import Workflow
from app.models.user import User
from app.schemas.workflow_schemas import WorkflowCreate, WorkflowUpdate, WorkflowResponse
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
        user_id=current_user.id,
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
    workflows = db.query(Workflow).filter(Workflow.user_id == current_user.id).all()
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
        Workflow.user_id == current_user.id
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
        Workflow.user_id == current_user.id
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
        Workflow.user_id == current_user.id
    ).first()
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    db.delete(workflow)
    db.commit()
    
    return None
```

**Update `backend/app/main.py`:**
```python
# Add import
from app.api import workflows

# Add router
app.include_router(workflows.router)
```

---

### Step 6: ReactFlow Canvas Foundation (60 minutes)

**Create `src/pages/WorkflowEditorPage.tsx`:**
```typescript
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Save, Play } from 'lucide-react';
import { toast } from 'sonner';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
];

export default function WorkflowEditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    const workflowState = { nodes, edges };
    console.log('Saving workflow:', workflowState);
    toast.success('Workflow saved!');
    // TODO: Save to backend
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Workflow Editor</h1>
          <p className="text-muted-foreground">Build your AI workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Test
          </Button>
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div
        className="h-[calc(100vh-200px)] rounded-lg border bg-card shadow-accent"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </motion.div>
    </div>
  );
}
```

---

### Step 7: Update Routing (15 minutes)

**Update `src/App.tsx`:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/auth-store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkflowEditorPage from './pages/WorkflowEditorPage';
import AppLayout from './components/layout/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="workflows/:id/edit" element={<WorkflowEditorPage />} />
          <Route path="workflows/new" element={<WorkflowEditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### Step 8: Testing (45 minutes)

**Backend Tests - `backend/tests/test_workflows.py`:**
```python
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine
import pytest

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def get_auth_token():
    """Helper to get auth token"""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    return response.json()["access_token"]

def test_create_workflow():
    """Test creating a workflow"""
    token = get_auth_token()
    
    response = client.post(
        "/workflows/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Workflow",
            "description": "A test workflow"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Workflow"
    assert "id" in data

def test_get_workflows():
    """Test getting all workflows"""
    token = get_auth_token()
    
    # Create a workflow first
    client.post(
        "/workflows/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Test Workflow"}
    )
    
    # Get workflows
    response = client.get(
        "/workflows/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Workflow"

def test_update_workflow():
    """Test updating a workflow"""
    token = get_auth_token()
    
    # Create workflow
    create_response = client.post(
        "/workflows/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Original Name"}
    )
    workflow_id = create_response.json()["id"]
    
    # Update workflow
    response = client.put(
        f"/workflows/{workflow_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Updated Name"}
    )
    
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"

def test_delete_workflow():
    """Test deleting a workflow"""
    token = get_auth_token()
    
    # Create workflow
    create_response = client.post(
        "/workflows/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "To Delete"}
    )
    workflow_id = create_response.json()["id"]
    
    # Delete workflow
    response = client.delete(
        f"/workflows/{workflow_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 204
    
    # Verify deleted
    get_response = client.get(
        f"/workflows/{workflow_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 404
```

**Run tests:**
```bash
cd backend
pytest tests/test_workflows.py -v --cov=app/api/workflows
```

---

## ✅ Phase 3 Completion Checklist

### UI & Design
- [ ] shadcn/ui installed and configured
- [ ] Tailwind CSS with design tokens
- [ ] Framer Motion animations on all pages
- [ ] Glass morphism effects (backdrop blur)
- [ ] Gradient backgrounds
- [ ] Lucide icons throughout
- [ ] Toast notifications working
- [ ] Dark mode functional

### Components
- [ ] AppLayout with header and navigation
- [ ] DashboardPage with animated cards
- [ ] WorkflowEditorPage with ReactFlow
- [ ] Status badges with colors
- [ ] Responsive design (mobile + desktop)

### Backend
- [ ] Workflow model created
- [ ] Workflow CRUD API endpoints
- [ ] Database migrations run
- [ ] User-workflow relationship

### Testing
- [ ] Backend tests passing (8+ tests)
- [ ] Frontend tests passing
- [ ] 80%+ code coverage
- [ ] Manual testing complete

### Quality
- [ ] Code reviewed by both developers
- [ ] No linting errors
- [ ] Performance acceptable
- [ ] Security audit passing

---

## 🎯 Demo Checklist

Before moving to Phase 4, demo these features:

1. ✅ **Beautiful UI** - Show gradient backgrounds, glass effects
2. ✅ **Smooth Animations** - Page transitions, card animations
3. ✅ **Dashboard** - Display workflows with status badges
4. ✅ **Create Workflow** - Add new workflow via UI
5. ✅ **Edit Workflow** - Open ReactFlow canvas
6. ✅ **Delete Workflow** - Remove workflow
7. ✅ **Responsive** - Show on mobile/tablet
8. ✅ **Dark Mode** - Toggle and verify

---

## 🚀 Next Steps

After Phase 3 is complete:
- **Phase 4:** First LLM Node (OpenAI, Anthropic integration)
- **Phase 5:** Credentials Management
- **Phase 6:** More Basic Nodes (HTTP, If/Else, Variables)

---

**Time Estimate:** 3 weeks (15-21 days)  
**Complexity:** Medium-High  
**Impact:** HIGH - This is where AgentWeave becomes visually stunning! ✨
