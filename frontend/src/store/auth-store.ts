import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

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
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName?: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/api/auth/login`, {
                        email,
                        password,
                    });

                    const { access_token } = response.data;
                    set({ token: access_token, isAuthenticated: true });

                    // Fetch user data
                    await get().fetchUser();
                } catch (error: any) {
                    const errorMessage = error.response?.data?.detail || 'Login failed';
                    set({ error: errorMessage, isAuthenticated: false });
                    throw new Error(errorMessage);
                } finally {
                    set({ isLoading: false });
                }
            },

            register: async (email: string, password: string, fullName?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/api/auth/register`, {
                        email,
                        password,
                        full_name: fullName,
                    });

                    const { access_token } = response.data;
                    set({ token: access_token, isAuthenticated: true });

                    // Fetch user data
                    await get().fetchUser();
                } catch (error: any) {
                    const errorMessage = error.response?.data?.detail || 'Registration failed';
                    set({ error: errorMessage, isAuthenticated: false });
                    throw new Error(errorMessage);
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            fetchUser: async () => {
                const { token } = get();
                if (!token) return;

                try {
                    const response = await axios.get(`${API_URL}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    set({ user: response.data });
                } catch (error: any) {
                    console.error('Failed to fetch user:', error);
                    set({ token: null, isAuthenticated: false, user: null });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
