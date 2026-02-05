import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// Component that throws error
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    // Suppress error console output for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const CustomFallback = <div>Custom Error Message</div>;
    
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('resets error state when Try Again button is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    let shouldThrow = true;
    const ConditionalThrow = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Recovered Content</div>;
    };
    
    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    );
    
    // Error UI should be visible
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    
    // Change to not throw
    shouldThrow = false;
    
    // Click Try Again button
    const tryAgainButton = screen.getByText(/Try Again/i);
    fireEvent.click(tryAgainButton);
    
    // Re-render
    rerender(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    );
    
    // Should show the recovered content
    expect(screen.getByText('Recovered Content')).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('logs error to console when error occurs', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('shows error details in development mode', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Set development mode
    const originalEnv = import.meta.env.DEV;
    vi.stubGlobal('import.meta', { env: { DEV: true } });
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    // Should show error details
    expect(screen.getByText(/Error Details/i)).toBeInTheDocument();
    
    // Restore
    vi.stubGlobal('import.meta', { env: { DEV: originalEnv } });
    spy.mockRestore();
  });
});
