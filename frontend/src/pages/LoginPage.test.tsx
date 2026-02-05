import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { useAuthStore } from '@/store/auth-store';

// Mock the auth store
vi.mock('../store/auth-store');

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('LoginPage', () => {
    const mockLogin = vi.fn();
    const mockClearError = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: null,
            login: mockLogin,
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: mockClearError,
        });
    });

    it('should render login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mockLogin.mockResolvedValueOnce(undefined);

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockClearError).toHaveBeenCalled();
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it('should display error message', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: 'Invalid credentials',
            login: mockLogin,
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: mockClearError,
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should disable form when loading', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: true,
            error: null,
            login: mockLogin,
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: mockClearError,
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/Email/i)).toBeDisabled();
        expect(screen.getByLabelText(/Password/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });
});
