import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import { useAuthStore } from '../store/auth-store';

// Mock the auth store
vi.mock('../store/auth-store');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('RegisterPage', () => {
    const mockRegister = vi.fn();
    const mockClearError = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: mockRegister,
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: mockClearError,
        });
    });

    it('should render registration form', () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should handle form submission with full name', async () => {
        mockRegister.mockResolvedValueOnce(undefined);

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        const fullNameInput = screen.getByLabelText(/full name/i);
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockClearError).toHaveBeenCalled();
            expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
        });
    });

    it('should handle form submission without full name', async () => {
        mockRegister.mockResolvedValueOnce(undefined);

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', undefined);
        });
    });

    it('should display error message', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: 'Email already registered',
            login: vi.fn(),
            register: mockRegister,
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: mockClearError,
        });

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
});
