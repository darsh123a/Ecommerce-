import { useEffect, useState } from 'react';
import axios from 'axios';
import { Server, Database, Layout, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiStatusResponse {
  status: string;
  app: string;
  environment: string;
  database: {
    status: string;
    name: string;
    driver: string;
  };
  timestamp: string;
}

export function App() {
  const [status, setStatus] = useState<ApiStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<ApiStatusResponse>(`${API_URL}/status`, { timeout: 5000 });
      setStatus(res.data);
      setLastCheck(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="badge">
          <span className="pulse-dot"></span>
          Environment Ready
        </div>
        <h1 className="title">Multi-Vendor E-Commerce Stack</h1>
        <p className="subtitle">
          Verified local development environment running React Frontend, Laravel REST API, and PostgreSQL 18.
        </p>
      </header>

      <div className="grid">
        {/* Frontend Card */}
        <div className="card status-active">
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper" style={{ color: '#61dafb' }}>
                <Layout size={22} />
              </div>
              <h2 className="card-title">React Frontend</h2>
            </div>
            <span className="status-badge active">Operational</span>
          </div>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Framework</span>
              <span className="info-value">React + TypeScript</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bundler</span>
              <span className="info-value">Vite 6</span>
            </div>
            <div className="info-item">
              <span className="info-label">Port</span>
              <span className="info-value">5173</span>
            </div>
            <div className="info-item">
              <span className="info-label">API Base URL</span>
              <span className="info-value">{API_URL}</span>
            </div>
          </div>
        </div>

        {/* Backend Card */}
        <div className={`card ${loading ? 'status-loading' : error ? 'status-error' : 'status-active'}`}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper" style={{ color: '#ff2d20' }}>
                <Server size={22} />
              </div>
              <h2 className="card-title">Laravel REST API</h2>
            </div>
            <span className={`status-badge ${loading ? 'loading' : error ? 'error' : 'active'}`}>
              {loading ? 'Connecting...' : error ? 'Offline' : 'Connected'}
            </span>
          </div>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Framework</span>
              <span className="info-value">PHP 8.5 + Laravel 12</span>
            </div>
            <div className="info-item">
              <span className="info-label">Server App</span>
              <span className="info-value">{status?.app || 'Laravel'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Environment</span>
              <span className="info-value">{status?.environment || 'local'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Health Route</span>
              <span className="info-value">GET /api/status</span>
            </div>
          </div>
        </div>

        {/* Database Card */}
        <div className={`card ${loading ? 'status-loading' : error || status?.database.status !== 'connected' ? 'status-error' : 'status-active'}`}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper" style={{ color: '#336791' }}>
                <Database size={22} />
              </div>
              <h2 className="card-title">PostgreSQL Database</h2>
            </div>
            <span className={`status-badge ${loading ? 'loading' : status?.database.status === 'connected' ? 'active' : 'error'}`}>
              {loading ? 'Checking...' : status?.database.status === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Engine</span>
              <span className="info-value">PostgreSQL 18</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database Name</span>
              <span className="info-value">{status?.database.name || 'ecommerce_platform'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Driver</span>
              <span className="info-value">{status?.database.driver || 'pgsql'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Port / Host</span>
              <span className="info-value">5432 / 127.0.0.1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="response-box">
        <div className="response-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {error ? <AlertCircle size={18} color="#ef4444" /> : <CheckCircle2 size={18} color="#10b981" />}
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Live API Response Payload {lastCheck && `(Last checked: ${lastCheck})`}
            </span>
          </div>
          <button className="btn-refresh" onClick={checkHealth} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Re-test Connection
          </button>
        </div>
        <pre className="code-block">
          {loading
            ? '// Fetching health status from backend REST API...'
            : error
            ? `// Error connecting to backend API:\n${error}\n\nMake sure the Laravel backend server is running on http://localhost:8000 using:\nphp artisan serve`
            : JSON.stringify(status, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
