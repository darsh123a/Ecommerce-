import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Unauthorized() {
  const { user } = useAuth();

  const homePath =
    user?.role === 'vendor' ? '/vendor' : user?.role === 'admin' ? '/admin' : user?.role === 'customer' ? '/customer' : '/login';

  return (
    <div className="lyzo-page">
      <main className="main-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div className="login-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ color: '#C53030', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <ShieldAlert size={48} />
          </div>
          <h1 className="login-title">Access Denied</h1>
          <p className="login-subtitle" style={{ marginBottom: '1.5rem' }}>
            You do not have permission to access this area. Your current role is <strong>{user?.role || 'Guest'}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user && (
              <Link to={homePath} className="btn-primary" style={{ textDecoration: 'none' }}>
                Go to your dashboard
              </Link>
            )}
            <Link
              to="/login"
              className="btn-primary"
              style={{ textDecoration: 'none', background: '#0F2A4A' }}
            >
              Return to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Unauthorized;
