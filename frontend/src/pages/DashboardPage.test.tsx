import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

// Mock the auth store
vi.mock('../store/auth-store');

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock UI components
vi.mock('../components/ui/card', () => ({
    Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
    CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('../components/ui/button', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    ),
}));

vi.mock('../components/ui/badge', () => ({
    Badge: ({ children, variant, ...props }: any) => (
        <span data-testid="badge" data-variant={variant} {...props}>{children}</span>
    ),
}));

const mockUser = {
    id: '123',
    email: 'test@example.com',
    full_name: 'Test User',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
};

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            token: 'mock-token',
            user: mockUser,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: vi.fn(),
        });
    });

    it('should render dashboard with user full name', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome back, Test User!/i)).toBeInTheDocument();
    });

    it('should render dashboard with email when no full name', async () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            token: 'mock-token',
            user: { ...mockUser, full_name: null },
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: vi.fn(),
        });

        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome back, test@example.com!/i)).toBeInTheDocument();
    });

    it('should render with default greeting when no user', async () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            token: 'mock-token',
            user: null,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: vi.fn(),
        });

        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome back, there!/i)).toBeInTheDocument();
    });

    it('should display workflow stats cards', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Total Workflows')).toBeInTheDocument();
        expect(screen.getByText('Active Deployments')).toBeInTheDocument();
        expect(screen.getByText('Total Executions')).toBeInTheDocument();
    });

    it('should display create workflow button', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        const buttons = screen.getAllByText('Create Workflow');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('should show loading state initially', () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Loading workflows...')).toBeInTheDocument();
    });

    it('should display workflows after loading', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Customer Support Agent')).toBeInTheDocument();
            expect(screen.getByText('Email Assistant')).toBeInTheDocument();
        }, { timeout: 1000 });
    });

    it('should render active status badges', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            const badges = screen.getAllByTestId('badge');
            expect(badges.length).toBeGreaterThan(0);
        }, { timeout: 1000 });
    });

    it('should have edit and delete buttons for workflows', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            const editButtons = screen.getAllByText('Edit');
            expect(editButtons).toHaveLength(2);

            const deleteButtons = screen.getAllByLabelText('Delete workflow');
            expect(deleteButtons).toHaveLength(2);
        }, { timeout: 1000 });
    });

    it('should show toast when delete is clicked', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Customer Support Agent')).toBeInTheDocument();
        }, { timeout: 1000 });

        const deleteButtons = screen.getAllByLabelText('Delete workflow');
        deleteButtons[0].click();

        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Delete not implemented yet');
    });

    it('should display workflow execution counts and last run times', async () => {
        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('450')).toBeInTheDocument();
            expect(screen.getByText('120')).toBeInTheDocument();
            expect(screen.getByText('2 hours ago')).toBeInTheDocument();
            expect(screen.getByText('1 day ago')).toBeInTheDocument();
        }, { timeout: 1000 });
    });
});
