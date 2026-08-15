import React, { useEffect, useState } from 'react';
import { Package, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, Power } from 'lucide-react';
import {
  ProductItem,
  fetchProducts,
  approveProduct,
  rejectProduct,
  updateProductStatus,
} from '../api/adminApi';

export function ProductManagement() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoadingId(id);
    setError(null);
    try {
      const updated = await approveProduct(id);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedProduct?.id === id) setSelectedProduct(updated);
      setSuccessMessage(`Product "${updated.title}" approved.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve product.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoadingId(id);
    setError(null);
    try {
      const updated = await rejectProduct(id);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedProduct?.id === id) setSelectedProduct(updated);
      setSuccessMessage(`Product "${updated.title}" rejected.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject product.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (product: ProductItem) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    setActionLoadingId(product.id);
    setError(null);
    try {
      const updated = await updateProductStatus(product.id, nextStatus);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      if (selectedProduct?.id === product.id) setSelectedProduct(updated);
      setSuccessMessage(`Product "${updated.title}" status changed to ${updated.status}.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update product status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            Product Management
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            Review pending product submissions, approve/reject listings, and manage product status.
          </p>
        </div>
        <button
          onClick={loadProducts}
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
          <p style={{ color: '#5B6472' }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Package size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
          <p style={{ color: '#5B6472', fontWeight: 600 }}>No products submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedProduct ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
          <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Vendor Owner</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{product.title}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#0F2A4A' }}>
                      {product.vendor?.name || `Vendor #${product.vendor_id}`}
                    </td>
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
                          title="View Product Details"
                        >
                          <Eye size={15} color="#0F2A4A" />
                        </button>
                        {product.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(product.id)}
                              disabled={actionLoadingId === product.id}
                              style={{ padding: '0.35rem 0.6rem', background: '#2F6B4F', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => handleReject(product.id)}
                              disabled={actionLoadingId === product.id}
                              style={{ padding: '0.35rem 0.6rem', background: '#C53030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        {product.status !== 'pending' && (
                          <button
                            onClick={() => handleToggleStatus(product)}
                            disabled={actionLoadingId === product.id}
                            style={{
                              padding: '0.35rem 0.6rem',
                              background: product.status === 'active' ? '#E53E3E' : '#2F6B4F',
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
                            {product.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
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
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Vendor Owner</span>
                <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#0F2A4A' }}>
                  {selectedProduct.vendor?.name} ({selectedProduct.vendor?.email})
                </p>
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
                <span style={{ fontSize: '0.8rem', color: '#5B6472' }}>Status</span>
                <div>
                  <span className={`user-badge ${selectedProduct.status === 'active' ? 'vendor' : selectedProduct.status}`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                {selectedProduct.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedProduct.id)}
                      className="btn-primary"
                      style={{ background: '#2F6B4F' }}
                    >
                      Approve Product
                    </button>
                    <button
                      onClick={() => handleReject(selectedProduct.id)}
                      className="btn-primary"
                      style={{ background: '#C53030' }}
                    >
                      Reject Product
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(selectedProduct)}
                    className="btn-primary"
                    style={{ background: selectedProduct.status === 'active' ? '#C53030' : '#2F6B4F' }}
                  >
                    {selectedProduct.status === 'active' ? 'Deactivate Product' : 'Activate Product'}
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

export default ProductManagement;
