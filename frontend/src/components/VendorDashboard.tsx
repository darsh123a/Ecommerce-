import React, { useEffect, useState } from 'react';
import { Package, CheckCircle, Clock, ShoppingBag, RefreshCw, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchVendorDashboardStats, type VendorDashboardStats } from '../api/vendorApi';
import { VendorProfile } from './VendorProfile';
import { VendorProductManagement } from './VendorProductManagement';
import { VendorInventory } from './VendorInventory';
import { VendorOrders } from './VendorOrders';

export function VendorDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'profile'>('dashboard');

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVendorDashboardStats();
      setStats(data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load vendor dashboard statistics.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadStats();
    }
  }, [activeTab]);

  return (
    <div className="lyzo-page">
      <header className="lyzo-header">
        <div className="lyzo-nav" style={{ justifyContent: 'space-between' }}>
          <a href="#" className="logo">
            Lyzo Vendor<b>.</b>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'dashboard' ? '#B8863B' : '#5B6472',
                  fontWeight: activeTab === 'dashboard' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'dashboard' ? '2px solid #B8863B' : 'none',
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'products' ? '#B8863B' : '#5B6472',
                  fontWeight: activeTab === 'products' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'products' ? '2px solid #B8863B' : 'none',
                }}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'inventory' ? '#B8863B' : '#5B6472',
                  fontWeight: activeTab === 'inventory' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'inventory' ? '2px solid #B8863B' : 'none',
                }}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'orders' ? '#B8863B' : '#5B6472',
                  fontWeight: activeTab === 'orders' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'orders' ? '2px solid #B8863B' : 'none',
                }}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'profile' ? '#B8863B' : '#5B6472',
                  fontWeight: activeTab === 'profile' ? 700 : 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  borderBottom: activeTab === 'profile' ? '2px solid #B8863B' : 'none',
                }}
              >
                Business Profile
              </button>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#5B6472' }}>
                Logged in as <strong style={{ color: '#0F2A4A' }}>{user?.name}</strong> (Vendor)
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

      <main
        className="main-content"
        style={{
          maxWidth: '1100px',
          margin: '2rem auto',
          padding: '0 1rem',
          width: '100%',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {activeTab === 'dashboard' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
                  Vendor Overview
                </h1>
                <p className="login-subtitle" style={{ textAlign: 'left' }}>
                  Track your products, active listings, pending approvals, and customer orders.
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
                <p style={{ color: '#5B6472' }}>Loading your statistics...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {/* Stat 1: Total Products */}
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
                    <div style={{ background: 'rgba(15, 42, 74, 0.08)', padding: '0.75rem', borderRadius: '8px', color: '#0F2A4A' }}>
                      <Package size={24} />
                    </div>
                  </div>
                </div>

                {/* Stat 2: Active Products */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Active Products
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#2F6B4F' }}>
                        {stats?.active_products ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(47, 107, 79, 0.12)', padding: '0.75rem', borderRadius: '8px', color: '#2F6B4F' }}>
                      <CheckCircle size={24} />
                    </div>
                  </div>
                </div>

                {/* Stat 3: Pending Products */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Pending Products
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#B8863B' }}>
                        {stats?.pending_products ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(184, 134, 59, 0.12)', padding: '0.75rem', borderRadius: '8px', color: '#B8863B' }}>
                      <Clock size={24} />
                    </div>
                  </div>
                </div>

                {/* Stat 4: Vendor Orders */}
                <div className="login-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#5B6472', fontWeight: 600, textTransform: 'uppercase' }}>
                        Vendor Orders
                      </span>
                      <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0', color: '#0F2A4A' }}>
                        {stats?.vendor_orders ?? 0}
                      </h2>
                    </div>
                    <div style={{ background: 'rgba(15, 42, 74, 0.08)', padding: '0.75rem', borderRadius: '8px', color: '#0F2A4A' }}>
                      <ShoppingBag size={24} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'products' ? (
          <VendorProductManagement />
        ) : activeTab === 'inventory' ? (
          <VendorInventory />
        ) : activeTab === 'orders' ? (
          <VendorOrders />
        ) : (
          <VendorProfile />
        )}
      </main>
    </div>
  );
}

export default VendorDashboard;
