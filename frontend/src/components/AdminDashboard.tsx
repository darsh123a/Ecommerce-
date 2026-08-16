import React, { useEffect, useState } from 'react';
import { Users, Store, Package, Clock, RefreshCw, AlertCircle, LogOut } from 'lucide-react';
import { fetchAdminDashboardStats, type AdminDashboardStats } from '../api/adminApi';
import { useAuth } from '../context/AuthContext';
import { VendorManagement } from './VendorManagement';
import { CategoryManagement } from './CategoryManagement';
import { ProductManagement } from './ProductManagement';
import { UserManagement } from './UserManagement';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vendors' | 'categories' | 'products' | 'users'>('dashboard');

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminDashboardStats();
      setStats(data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load admin dashboard statistics.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="lyzo-page">
      <header className="lyzo-header">
        <div className="lyzo-nav" style={{ justifyContent: 'space-between' }}>
          <a href="#" className="logo">
            Lyzo Admin<b>.</b>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'dashboard' ? '#B8863B' : 'white',
                  fontWeight: activeTab === 'dashboard' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'dashboard' ? '2px solid #B8863B' : 'none',
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'vendors' ? '#B8863B' : 'white',
                  fontWeight: activeTab === 'vendors' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'vendors' ? '2px solid #B8863B' : 'none',
                }}
              >
                Vendor Management
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'categories' ? '#B8863B' : 'white',
                  fontWeight: activeTab === 'categories' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'categories' ? '2px solid #B8863B' : 'none',
                }}
              >
                Category Management
              </button>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'products' ? '#B8863B' : 'white',
                  fontWeight: activeTab === 'products' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'products' ? '2px solid #B8863B' : 'none',
                }}
              >
                Product Management
              </button>
              <button
                onClick={() => setActiveTab('users')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'users' ? '#B8863B' : 'white',
                  fontWeight: activeTab === 'users' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'users' ? '2px solid #B8863B' : 'none',
                }}
              >
                User Management
              </button>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'white' }}>
                Logged in as <strong>{user?.name}</strong> (Admin)
              </span>
              <button
                onClick={logout}
                className="btn-primary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        {activeTab === 'dashboard' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
                  Marketplace Dashboard
                </h1>
                <p className="login-subtitle" style={{ textAlign: 'left' }}>
                  Overview of customers, vendors, products, and pending approvals.
                </p>
              </div>
              <button
                onClick={loadStats}
                disabled={isLoading}
                className="btn-primary"
                style={{ width: 'auto', background: '#0F2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
                Refresh
              </button>
            </div>

            {error && (
              <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }} />
                <p style={{ color: '#5B6472' }}>Loading statistics...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {/* Stat 1: Total Customers */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Customers
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#0F2A4A' }}>
                        {stats?.total_customers ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(15, 42, 74, 0.08)', padding: '0.75rem', borderRadius: '8px', color: '#0F2A4A' }}>
                      <Users size={24} />
                    </div>
                  </div>
                </div>

                {/* Stat 2: Total Vendors */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Vendors
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#0F2A4A' }}>
                        {stats?.total_vendors ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(184, 134, 59, 0.12)', padding: '0.75rem', borderRadius: '8px', color: '#B8863B' }}>
                      <Store size={24} />
                    </div>
                  </div>
                </div>

                {/* Stat 3: Total Products */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Products
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#0F2A4A' }}>
                        {stats?.total_products ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(47, 107, 79, 0.12)', padding: '0.75rem', borderRadius: '8px', color: '#2F6B4F' }}>
                      <Package size={24} />
                    </div>
                  </div>
                </div>

                {/* Stat 4: Pending Approvals */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Pending Approvals
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#C53030' }}>
                        {stats?.pending_approvals ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(197, 48, 48, 0.12)', padding: '0.75rem', borderRadius: '8px', color: '#C53030' }}>
                      <Clock size={24} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'vendors' ? (
          <VendorManagement />
        ) : activeTab === 'categories' ? (
          <CategoryManagement />
        ) : activeTab === 'products' ? (
          <ProductManagement />
        ) : (
          <UserManagement />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
