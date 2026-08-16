import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, CheckCircle, XCircle, AlertCircle, RefreshCw, Power } from 'lucide-react';
import {
  type Category,
  type CategoryRequestItem,
  fetchCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  fetchCategoryRequests,
  approveCategoryRequest,
  rejectCategoryRequest,
} from '../api/adminApi';

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryRequests, setCategoryRequests] = useState<CategoryRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'requests'>('all');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, reqs] = await Promise.all([fetchCategories(), fetchCategoryRequests()]);
      setCategories(cats);
      setCategoryRequests(reqs);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load category data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, formData);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? updated : c)));
        setSuccessMessage(`Category "${updated.name}" updated successfully.`);
      } else {
        const created = await createCategory(formData);
        setCategories((prev) => [created, ...prev]);
        setSuccessMessage(`Category "${created.name}" created successfully.`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    setError(null);
    try {
      const updated = await toggleCategoryStatus(cat.id);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? updated : c)));
      setSuccessMessage(`Category "${updated.name}" status changed to ${updated.status}.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleApproveRequest = async (reqId: number) => {
    setError(null);
    try {
      const updatedReq = await approveCategoryRequest(reqId);
      setCategoryRequests((prev) => prev.map((r) => (r.id === reqId ? updatedReq : r)));
      setSuccessMessage('Category request approved!');
      loadData(); // reload to reflect new category created
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve category request.');
    }
  };

  const handleRejectRequest = async (reqId: number) => {
    setError(null);
    try {
      const updatedReq = await rejectCategoryRequest(reqId);
      setCategoryRequests((prev) => prev.map((r) => (r.id === reqId ? updatedReq : r)));
      setSuccessMessage('Category request rejected.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject category request.');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            Category Management
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            Create, edit, toggle active status, and process vendor category requests.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleOpenCreateModal}
            className="btn-primary"
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Category
          </button>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="btn-primary"
            style={{ width: 'auto', background: '#0F2A4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spinner' : ''} />
            Reload
          </button>
        </div>
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

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E3E1D8', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveSubTab('all')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            fontWeight: activeSubTab === 'all' ? 700 : 500,
            borderBottom: activeSubTab === 'all' ? '2px solid #0F2A4A' : 'none',
            color: activeSubTab === 'all' ? '#0F2A4A' : '#5B6472',
            cursor: 'pointer',
          }}
        >
          All Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveSubTab('requests')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            fontWeight: activeSubTab === 'requests' ? 700 : 500,
            borderBottom: activeSubTab === 'requests' ? '2px solid #0F2A4A' : 'none',
            color: activeSubTab === 'requests' ? '#0F2A4A' : '#5B6472',
            cursor: 'pointer',
          }}
        >
          Vendor Category Requests ({categoryRequests.filter((r) => r.status === 'pending').length} Pending)
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading categories...</p>
        </div>
      ) : activeSubTab === 'all' ? (
        categories.length === 0 ? (
          <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Layers size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
            <p style={{ color: '#5B6472', fontWeight: 600 }}>No categories created yet.</p>
          </div>
        ) : (
          <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Slug</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{cat.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>{cat.slug}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>{cat.description || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`user-badge ${cat.status === 'active' ? 'vendor' : 'inactive'}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          style={{ padding: '0.35rem 0.6rem', border: '1px solid #E3E1D8', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                          title="Edit Category"
                        >
                          <Edit2 size={15} color="#0F2A4A" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          style={{
                            padding: '0.35rem 0.6rem',
                            background: cat.status === 'active' ? '#E53E3E' : '#2F6B4F',
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
                          {cat.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* Vendor Category Requests */
        categoryRequests.length === 0 ? (
          <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Layers size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
            <p style={{ color: '#5B6472', fontWeight: 600 }}>No vendor category requests submitted.</p>
          </div>
        ) : (
          <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Requested Name</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Vendor</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Reason</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoryRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{req.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{req.vendor?.name || `Vendor #${req.vendor_id}`}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>{req.reason || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`user-badge ${req.status === 'approved' ? 'vendor' : req.status}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            style={{ padding: '0.35rem 0.6rem', background: '#2F6B4F', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <CheckCircle size={15} /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            style={{ padding: '0.35rem 0.6rem', background: '#C53030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Modal for Create/Edit Category */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="login-card" style={{ width: '450px', margin: 0, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#0F2A4A' }}>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="cat-name">Category Name</label>
                <input
                  id="cat-name"
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="cat-desc">Description</label>
                <textarea
                  id="cat-desc"
                  className="form-input"
                  style={{ height: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional category description..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', background: '#F6F6F3', border: '1px solid #E3E1D8', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: 'auto' }}
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;
