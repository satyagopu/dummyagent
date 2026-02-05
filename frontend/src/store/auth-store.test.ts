import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthStore } from '../store/auth-store';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Auth Store', () => {
    beforeEach(() => {
        // Clear store state before each test
        useAuthStore.setState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            const mockToken = 'mock-jwt-token';
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                full_name: 'Test User',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            };

            mockedAxios.post.mockResolvedValueOnce({
                data: { access_token: mockToken, token_type: 'bearer' },
            });
            mockedAxios.get.mockResolvedValueOnce({
                data: mockUser,
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.register('test@example.com', 'password123', 'Test User');
            });

            expect(result.current.token).toBe(mockToken);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.error).toBeNull();
        });

        it('should handle registration error', async () => {
            mockedAxios.post.mockRejectedValueOnce({
                response: { data: { detail: 'Email already registered' } },
            });

            const { result } = renderHook(() => useAuthStore());

            try {
                await act(async () => {
                    await result.current.register('test@example.com', 'password123');
                });
            } catch (error) {
                // Expected error
            }

            await waitFor(() => {
                expect(result.current.token).toBeNull();
                expect(result.current.isAuthenticated).toBe(false);
                expect(result.current.error).toBe('Email already registered');
            });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const mockToken = 'mock-jwt-token';
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                full_name: 'Test User',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            };

            mockedAxios.post.mockResolvedValueOnce({
                data: { access_token: mockToken, token_type: 'bearer' },
            });
            mockedAxios.get.mockResolvedValueOnce({
                data: mockUser,
            });

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.login('test@example.com', 'password123');
            });

            expect(result.current.token).toBe(mockToken);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.user).toEqual(mockUser);
        });

        it('should handle login error', async () => {
            mockedAxios.post.mockRejectedValueOnce({
                response: { data: { detail: 'Incorrect email or password' } },
            });

            const { result } = renderHook(() => useAuthStore());

            try {
                await act(async () => {
                    await result.current.login('test@example.com', 'wrongpassword');
                });
            } catch (error) {
                // Expected error
            }

            await waitFor(() => {
                expect(result.current.error).toBe('Incorrect email or password');
            });
        });
    });

    describe('logout', () => {
        it('should clear auth state on logout', () => {
            const { result } = renderHook(() => useAuthStore());

            // Set initial state
            act(() => {
                useAuthStore.setState({
                    token: 'mock-token',
                    user: { id: '123', email: 'test@example.com', full_name: 'Test', is_active: true, created_at: '2024-01-01' },
                    isAuthenticated: true,
                });
            });

            act(() => {
                result.current.logout();
            });

            expect(result.current.token).toBeNull();
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });

    describe('fetchUser', () => {
        it('should fetch user data with valid token', async () => {
            const mockUser = {
                id: '123',
                email: 'test@example.com',
                full_name: 'Test User',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            };

            mockedAxios.get.mockResolvedValueOnce({
                data: mockUser,
            });

            const { result } = renderHook(() => useAuthStore());

            act(() => {
                useAuthStore.setState({ token: 'mock-token' });
            });

            await act(async () => {
                await result.current.fetchUser();
            });

            expect(result.current.user).toEqual(mockUser);
        });

        it('should clear auth on fetch error', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Unauthorized'));

            const { result } = renderHook(() => useAuthStore());

            act(() => {
                useAuthStore.setState({ token: 'invalid-token', isAuthenticated: true });
            });

            await act(async () => {
                await result.current.fetchUser();
            });

            expect(result.current.token).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
        });
    });

    describe('clearError', () => {
        it('should clear error message', () => {
            const { result } = renderHook(() => useAuthStore());

            act(() => {
                useAuthStore.setState({ error: 'Some error' });
            });

            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBeNull();
        });
    });
});
