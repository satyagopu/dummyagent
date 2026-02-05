import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useAuthStore } from './store/auth-store';

// Mock all the page components
vi.mock('./pages/LoginPage', () => ({
    default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./pages/RegisterPage', () => ({
    default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock('./pages/DashboardPage', () => ({
    default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

vi.mock('./pages/WorkflowEditorPage', () => ({
    default: () => <div data-testid="workflow-editor-page">Workflow Editor Page</div>,
}));

// Mock AppLayout
vi.mock('./components/layout/AppLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="app-layout">{children}</div>
    ),
}));

// Mock ProtectedRoute
vi.mock('./components/ProtectedRoute', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock auth store
vi.mock('./store/auth-store');

// Mock sonner
vi.mock('sonner', () => ({
    Toaster: () => <div data-testid="toaster" />,
}));

// Mock Outlet from react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Outlet: () => <div data-testid="outlet" />,
    };
});

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            token: 'mock-token',
            user: {
                id: '123',
                email: 'test@example.com',
                full_name: 'Test User',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: vi.fn(),
        });
    });

    it('should render App component with BrowserRouter', () => {
        render(<App />);

        // Should render Toaster
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('should render App component with routes', () => {
        render(<App />);

        // App should render without errors
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });
});

