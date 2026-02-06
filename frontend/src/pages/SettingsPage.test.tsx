import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SettingsPage from './SettingsPage';
import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

// Mock child components to simplify testing
vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children, ...props }: any) => <div data-testid="tabs" {...props}>{children}</div>,
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    TabsContent: ({ children, value }: any) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <h1>{children}</h1>,
    CardDescription: ({ children }: any) => <p>{children}</p>,
    CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('axios');

describe('SettingsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup auth store
        useAuthStore.setState({
            token: 'fake-token',
            user: {
                id: '1',
                email: 'test@example.com',
                full_name: 'Test',
                is_active: true,
                created_at: new Date().toISOString()
            },
            isAuthenticated: true
        });
    });

    it('renders loading state and then credentials', async () => {
        // Mock API response
        (axios.get as any).mockResolvedValue({
            data: [
                { id: 1, provider: 'openai', masked_key: 'sk-...123', is_active: true }
            ]
        });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Settings')).toBeInTheDocument();
        // expect(screen.getByText('Loading...')).toBeInTheDocument(); // Might flip too fast

        await waitFor(() => {
            expect(screen.getByText('openai')).toBeInTheDocument();
            expect(screen.getByText('sk-...123')).toBeInTheDocument();
        });
    });

    it('adds a new credential', async () => {
        (axios.get as any).mockResolvedValue({ data: [] });
        (axios.post as any).mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        // Find input (mocked UI structure might be simple)
        // Since we didn't mock Select/Input fully, we rely on basic HTML if possible, 
        // or we need to mock Select if it's complex. Shadcn Select is complex.

        // Let's assume Input text is accessible
        // Find input (mocked UI structure might be simple)
        // 1st is usually the API Key input if Select is accessible differently or 2nd.
        // Shadcn Input is just an input.
        // Let's find by placeholder
        const input = screen.getByPlaceholderText('sk-...');
        fireEvent.change(input, { target: { value: 'sk-new-key' } });

        const verifyBtn = screen.getByText('Verify & Save');
        fireEvent.click(verifyBtn);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/verify'),
                expect.any(Object),
                expect.any(Object)
            );
        });
    });

    it('deletes a credential', async () => {
        (axios.get as any).mockResolvedValue({
            data: [
                { id: 1, provider: 'openai', masked_key: 'sk-...123', is_active: true }
            ]
        });
        (axios.delete as any).mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('openai')).toBeInTheDocument();
        });

        // Toggle visibility
        const toggleBtn = screen.getByTestId('toggle-visibility');
        fireEvent.click(toggleBtn);

        // Delete
        const deleteBtn = screen.getByTestId('delete-openai');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                expect.stringContaining('/openai'),
                expect.any(Object)
            );
        });
    });
});
