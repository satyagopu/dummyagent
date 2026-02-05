import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
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

describe('DashboardPage', () => {
    const mockLogout = vi.fn();
    const mockFetchUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render dashboard with user data', () => {
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
            logout: mockLogout,
            fetchUser: mockFetchUser,
            clearError: vi.fn(),
        });

        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should fetch user on mount', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            token: 'mock-token',
            user: null,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: mockLogout,
            fetchUser: mockFetchUser,
            clearError: vi.fn(),
        });

        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(mockFetchUser).toHaveBeenCalled();
    });

    it('should handle logout', () => {
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
            logout: mockLogout,
            fetchUser: mockFetchUser,
            clearError: vi.fn(),
        });

        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
    });

    it('should display user without full name', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: true,
            token: 'mock-token',
            user: {
                id: '123',
                email: 'test@example.com',
                full_name: null,
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: mockLogout,
            fetchUser: mockFetchUser,
            clearError: vi.fn(),
        });

        render(
            <BrowserRouter>
                <DashboardPage />
            </BrowserRouter>
        );

        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
});
