import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit2, AlertCircle, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';
import { ProductItem, Category } from '../api/adminApi';
import {
  fetchVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  fetchVendorCategories,
} from '../api/vendorApi';

export function VendorProductManagement() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formCategoryId, setFormCategoryId] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        fetchVendorProducts(),
        fetchVendorCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vendor products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormCategoryId('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProductId(product.id);
    setFormTitle(product.title);
    setFormDescription(product.description || '');
    setFormPrice(String(product.price));
    setFormCategoryId(product.category_id ? String(product.category_id) : '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please provide a valid price amount.');
      setIsSubmitting(false);
      return;
    }

    try {
      const categoryIdVal = formCategoryId ? parseInt(formCategoryId, 10) : null;
      if (editingProductId) {
        const updated = await updateVendorProduct(editingProductId, {
          title: formTitle,
          description: formDescription,
          price: priceNum,
          category_id: categoryIdVal,
        });
        setProducts((prev) => prev.map((p) => (p.id === editingProductId ? updated : p)));
        setSuccessMessage(`Product "${updated.title}" updated and re-submitted for admin approval.`);
      } else {
        const created = await createVendorProduct({
          title: formTitle,
          description: formDescription,
          price: priceNum,
          category_id: categoryIdVal,
        });
        setProducts((prev) => [created, ...prev]);
        setSuccessMessage(`Product "${created.title}" created and submitted for admin approval.`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstKey = Object.keys(err.response.data.errors)[0];
        setError(err.response.data.errors[firstKey][0]);
      } else {
        setError(err.response?.data?.message || 'Failed to save product.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            My Products
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            Add new products to your catalog and monitor their admin approval status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            style={{ width: 'auto', background: '#2F6B4F', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Add Product
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
        <div style={{ background: 'rgba(47, 107, 79, 0.1)', color: '#2F6B4F', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #2F6B4F', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading your product catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Package size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
          <p style={{ color: '#5B6472', fontWeight: 600 }}>You haven't listed any products yet.</p>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            style={{ width: 'auto', margin: '1rem auto 0', background: '#2F6B4F' }}
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedProduct ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
          <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Approval Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{product.title}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`user-badge ${product.status === 'active' ? 'vendor' : product.status}`}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          style={{ padding: '0.35rem 0.6rem', border: '1px solid #E3E1D8', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                          title="View Details"
                        >
                          <Eye size={15} color="#0F2A4A" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          style={{ padding: '0.35rem 0.6rem', border: '1px solid #E3E1D8', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                          title="Edit Product"
                        >
                          <Edit2 size={15} color="#B8863B" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product Details Sidebar */}
          {selectedProduct && (
            <div className="login-card" style={{ padding: '1.5rem', alignSelf: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F2A4A' }}>Product Details</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Title</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>{selectedProduct.title}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Category</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600 }}>
                  {selectedProduct.category?.name || 'Uncategorized'}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Price</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 700, fontSize: '1.2rem', color: '#B8863B' }}>
                  ${Number(selectedProduct.price).toFixed(2)}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Description</span>
                <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#5B6472' }}>
                  {selectedProduct.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Admin Approval Status</span>
                <div>
                  <span className={`user-badge ${selectedProduct.status === 'active' ? 'vendor' : selectedProduct.status}`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => openEditModal(selectedProduct)}
                  className="btn-primary"
                  style={{ background: '#0F2A4A' }}
                >
                  Edit Product Information
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="login-card" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <h3 style={{ marginTop: 0, color: '#0F2A4A' }}>
              {editingProductId ? 'Edit Product Listing' : 'Add New Product Listing'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#5B6472', marginBottom: '1.25rem' }}>
              New or updated products are automatically submitted to the Admin for approval.
            </p>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Product Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Wireless Ergonomic Keyboard"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                >
                  <option value="">-- Select Active Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="29.99"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter product details, specs, and features..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', border: '1px solid #E3E1D8', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: 'auto', background: '#2F6B4F' }}
                >
                  {isSubmitting ? 'Submitting...' : editingProductId ? 'Save & Re-submit' : 'Submit Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorProductManagement;
