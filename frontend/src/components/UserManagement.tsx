import React, { useEffect, useState } from 'react';
import { Users, AlertCircle, RefreshCw, Eye, Power } from 'lucide-react';
import type { UserProfile } from '../api/authApi';
import { fetchUsers, updateUserStatus } from '../api/adminApi';

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    setActionLoadingId(user.id);
    setError(null);
    try {
      const updated = await updateUserStatus(user.id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      if (selectedUser?.id === user.id) setSelectedUser(updated);
      setSuccessMessage(`User "${updated.name}" account status updated to ${updated.status}.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            User Management
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            View system users across all roles and toggle account activation status.
          </p>
        </div>
        <button
          onClick={loadUsers}
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

      {/* Role filter bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'customer', 'vendor', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #E3E1D8',
              background: roleFilter === role ? '#0F2A4A' : 'white',
              color: roleFilter === role ? 'white' : '#5B6472',
              fontWeight: roleFilter === role ? 600 : 400,
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '0.85rem',
            }}
          >
            {role === 'all' ? 'All Roles' : `${role}s`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Users size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
          <p style={{ color: '#5B6472', fontWeight: 600 }}>No users found for this role filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
          <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`user-badge ${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`user-badge ${u.status === 'active' ? 'vendor' : 'inactive'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          style={{ padding: '0.35rem 0.6rem', border: '1px solid #E3E1D8', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                          title="View User Details"
                        >
                          <Eye size={15} color="#0F2A4A" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionLoadingId === u.id}
                          style={{
                            padding: '0.35rem 0.6rem',
                            background: u.status === 'active' ? '#E53E3E' : '#2F6B4F',
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
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Details Sidebar */}
          {selectedUser && (
            <div className="login-card" style={{ padding: '1.5rem', alignSelf: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F2A4A' }}>User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>User ID</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>#{selectedUser.id}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Name</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>{selectedUser.name}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Email Address</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>{selectedUser.email}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Assigned Role</span>
                <div>
                  <span className={`user-badge ${selectedUser.role}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Account Status</span>
                <div>
                  <span className={`user-badge ${selectedUser.status === 'active' ? 'vendor' : 'inactive'}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleToggleStatus(selectedUser)}
                  className="btn-primary"
                  style={{ background: selectedUser.status === 'active' ? '#C53030' : '#2F6B4F' }}
                >
                  {selectedUser.status === 'active' ? 'Deactivate User Account' : 'Activate User Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserManagement;
