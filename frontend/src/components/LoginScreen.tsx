import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserProfile } from '../api/authApi';

const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function dashboardPathForRole(role: UserProfile['role']): string {
  if (role === 'vendor') return '/vendor';
  if (role === 'admin') return '/admin';
  return '/customer';
}

export function LoginScreen() {
  const { user, login, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const loggedInUser = await login(data);
      navigate(dashboardPathForRole(loggedInUser.role), { replace: true });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.message) {
        setApiError(err.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await logout();
    } catch {
      // Ignored
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || authLoading;

  return (
    <div className="lyzo-page">
      <header className="lyzo-header">
        <div className="lyzo-nav">
          <a href="#" className="logo">
            Lyzo<b>.</b>
          </a>
        </div>
      </header>

      <main className="main-content">
        {user ? (
          <div className="authenticated-card">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(47, 107, 79, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: '#2F6B4F' }}>
                <CheckCircle2 size={32} />
              </div>
              <span className={`user-badge ${user.role}`}>
                {user.role} Account
              </span>
              <h2 className="login-title">Welcome back, {user.name}</h2>
              <p className="login-subtitle">You are signed in to the Lyzo Marketplace.</p>
            </div>

            <div style={{ background: '#F6F6F3', padding: '1.25rem', borderRadius: '4px', border: '1px solid #E3E1D8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#5B6472' }}>Email Address:</span>
                <span style={{ fontWeight: 600 }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#5B6472' }}>Role:</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6472' }}>Account Status:</span>
                <span style={{ fontWeight: 600, color: '#2F6B4F', textTransform: 'capitalize' }}>{user.status}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn-primary"
                onClick={() => navigate(dashboardPathForRole(user.role))}
                disabled={isLoading}
              >
                Continue to {user.role === 'vendor' ? 'Vendor' : user.role === 'admin' ? 'Admin' : 'Customer'} Dashboard
              </button>
              <button className="btn-primary" onClick={handleLogout} disabled={isLoading} style={{ background: '#0F2A4A' }}>
                {isLoading ? <span className="spinner" /> : <LogOut size={18} />}
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-title">Sign in to Lyzo</h1>
              <p className="login-subtitle">Enter your credentials to access your account</p>
            </div>

            {apiError && (
              <div className="alert-error" role="alert">
                <AlertCircle size={18} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                    {...register('email')}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email.message}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`form-input ${errors.password ? 'has-error' : ''}`}
                    {...register('password')}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password.message}</span>}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? <span className="spinner" /> : null}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default LoginScreen;
