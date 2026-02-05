import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { measureAPICall } from './utils/performance';
import './App.css';

interface ApiResponse {
  message: string;
  version: string;
  status: string;
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    measureAPICall('health-check', () => 
      axios.get<ApiResponse>('http://localhost:8000/')
    )
      .then(response => {
        setApiData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to connect to backend');
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AgentWeave</h1>
        <p className="subtitle">AI Workflow Automation Platform</p>
        
        <div className="status-card">
          {loading && <p>Loading...</p>}
          
          {error && (
            <div className="error">
              <p>{error}</p>
              <p className="hint">Make sure backend is running on port 8000</p>
            </div>
          )}
          
          {apiData && (
            <div className="success">
              <h2>✅ Backend Connected!</h2>
              <p><strong>Message:</strong> {apiData.message}</p>
              <p><strong>Version:</strong> {apiData.version}</p>
              <p><strong>Status:</strong> {apiData.status}</p>
            </div>
          )}
        </div>

        <div className="next-steps">
          <h3>Phase 1 Complete! 🎉</h3>
          <p>Next: Phase 2 - Authentication System</p>
        </div>
      </header>
    </div>
  );
}

export default App;
