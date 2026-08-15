import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, AlertCircle, Save, Check } from 'lucide-react';
import { UserProfile } from '../api/authApi';
import { fetchVendorProfile, updateVendorProfile } from '../api/vendorApi';
import { useAuth } from '../context/AuthContext';

export function VendorProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVendorProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateVendorProfile({ name, email });
      setProfile(updated);
      setName(updated.name);
      setEmail(updated.email);
      updateUser(updated);
      setSuccessMessage('Business profile updated successfully.');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstErrKey = Object.keys(err.response.data.errors)[0];
        setError(err.response.data.errors[firstErrKey][0]);
      } else {
        setError(err.response?.data?.message || 'Failed to update profile.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
          Vendor Business Profile
        </h2>
        <p className="login-subtitle" style={{ textAlign: 'left' }}>
          Manage your business display name and contact email address.
        </p>
      </div>

      {error && (
        <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div style={{ background: 'rgba(47, 107, 79, 0.1)', color: '#2F6B4F', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #2F6B4F', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading vendor profile...</p>
        </div>
      ) : (
        <div className="login-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} color="#0F2A4A" /> Business / Contact Name
              </label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={16} color="#0F2A4A" /> Contact Email Address
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={16} color="#5B6472" /> Role (Read-only)
              </label>
              <input
                type="text"
                className="form-input"
                value={profile?.role || 'vendor'}
                disabled
                style={{ background: '#F6F6F3', color: '#5B6472', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary"
                style={{ width: 'auto', padding: '0.65rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {isSaving ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default VendorProfile;
