import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuthStore } from '../store/auth-store';

// Mock the auth store
vi.mock('../store/auth-store');

describe('ProtectedRoute', () => {
    it('should render children when authenticated', () => {
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
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to login when not authenticated', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            fetchUser: vi.fn(),
            clearError: vi.fn(),
        });

        const { container } = render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );

        // Should not render protected content
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
});
