import React, { useEffect, useState } from 'react';
import { Store, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, Power } from 'lucide-react';
import { UserProfile } from '../api/authApi';
import {
  fetchVendors,
  approveVendor,
  rejectVendor,
  updateVendorStatus,
} from '../api/adminApi';

export function VendorManagement() {
  const [vendors, setVendors] = useState<UserProfile[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadVendors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load vendors list.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoadingId(id);
    setError(null);
    try {
      const updated = await approveVendor(id);
      setVendors((prev) => prev.map((v) => (v.id === id ? updated : v)));
      if (selectedVendor?.id === id) setSelectedVendor(updated);
      setSuccessMessage(`Vendor "${updated.name}" approved successfully.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve vendor.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoadingId(id);
    setError(null);
    try {
      const updated = await rejectVendor(id);
      setVendors((prev) => prev.map((v) => (v.id === id ? updated : v)));
      if (selectedVendor?.id === id) setSelectedVendor(updated);
      setSuccessMessage(`Vendor "${updated.name}" rejected.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject vendor.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (vendor: UserProfile) => {
    const nextStatus = vendor.status === 'active' ? 'inactive' : 'active';
    setActionLoadingId(vendor.id);
    setError(null);
    try {
      const updated = await updateVendorStatus(vendor.id, nextStatus);
      setVendors((prev) => prev.map((v) => (v.id === vendor.id ? updated : v)));
      if (selectedVendor?.id === vendor.id) setSelectedVendor(updated);
      setSuccessMessage(`Vendor "${updated.name}" is now ${updated.status}.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update vendor status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            Vendor Management
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            Review, approve, reject, activate or deactivate vendor accounts.
          </p>
        </div>
        <button
          onClick={loadVendors}
          disabled={isLoading}
          className="btn-primary"
          style={{ width: 'auto', background: '#0F2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
          Reload
        </button>
      </div>

      {error && (
        <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div style={{ background: 'rgba(47, 107, 79, 0.1)', color: '#2F6B4F', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #2F6B4F', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading vendors...</p>
        </div>
      ) : vendors.length === 0 ? (
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Store size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
          <p style={{ color: '#5B6472', fontWeight: 600 }}>No vendors found in the database.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedVendor ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
          <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Vendor Name</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>#{vendor.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{vendor.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>{vendor.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`user-badge ${vendor.status === 'active' ? 'vendor' : vendor.status}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          style={{ padding: '0.35rem 0.6rem', border: '1px solid #E3E1D8', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                          title="View Details"
                        >
                          <Eye size={16} color="#0F2A4A" />
                        </button>
                        {vendor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor.id)}
                              disabled={actionLoadingId === vendor.id}
                              style={{ padding: '0.35rem 0.6rem', background: '#2F6B4F', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(vendor.id)}
                              disabled={actionLoadingId === vendor.id}
                              style={{ padding: '0.35rem 0.6rem', background: '#C53030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {vendor.status !== 'pending' && (
                          <button
                            onClick={() => handleToggleStatus(vendor)}
                            disabled={actionLoadingId === vendor.id}
                            style={{
                              padding: '0.35rem 0.6rem',
                              background: vendor.status === 'active' ? '#E53E3E' : '#2F6B4F',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.8rem',
                            }}
                          >
                            <Power size={14} />
                            {vendor.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vendor Details Sidebar / Card */}
          {selectedVendor && (
            <div className="login-card" style={{ padding: '1.5rem', alignSelf: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F2A4A' }}>Vendor Details</h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Vendor Name</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>{selectedVendor.name}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Email Address</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>{selectedVendor.email}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Status</span>
                <div>
                  <span className={`user-badge ${selectedVendor.status === 'active' ? 'vendor' : selectedVendor.status}`}>
                    {selectedVendor.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                {selectedVendor.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedVendor.id)}
                      className="btn-primary"
                      style={{ background: '#2F6B4F' }}
                    >
                      Approve Vendor
                    </button>
                    <button
                      onClick={() => handleReject(selectedVendor.id)}
                      className="btn-primary"
                      style={{ background: '#C53030' }}
                    >
                      Reject Vendor
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(selectedVendor)}
                    className="btn-primary"
                    style={{ background: selectedVendor.status === 'active' ? '#C53030' : '#2F6B4F' }}
                  >
                    {selectedVendor.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VendorManagement;
