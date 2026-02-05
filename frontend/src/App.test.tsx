import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('App', () => {
  it('renders AgentWeave title', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        message: 'Test message',
        version: '0.1.0',
        status: 'Phase 1 - Setup Complete'
      }
    })
    
    render(<App />)
    expect(screen.getByText(/AgentWeave/i)).toBeInTheDocument()
  })

  it('fetches data from backend', async () => {
    const mockData = {
      message: 'Hello',
      version: '0.1.0',
      status: 'Phase 1 - Setup Complete'
    }
    
    vi.mocked(axios.get).mockResolvedValue({ data: mockData })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/Backend Connected/i)).toBeInTheDocument()
    })
  })

  it('shows error message when backend fails', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to connect to backend/i)).toBeInTheDocument()
    })
  })
})
