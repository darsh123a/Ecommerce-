import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, RefreshCw, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../api/adminApi';
import { fetchVendorProducts, updateVendorProductStock } from '../api/vendorApi';

export function VendorInventory() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [stockInputs, setStockInputs] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVendorProducts();
      setProducts(data);
      const initialInputs: { [key: number]: string } = {};
      data.forEach((p) => {
        initialInputs[p.id] = String(p.stock ?? 0);
      });
      setStockInputs(initialInputs);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vendor inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (productId: number, val: string) => {
    setStockInputs((prev) => ({ ...prev, [productId]: val }));
  };

  const handleSaveStock = async (product: ProductItem) => {
    const rawVal = stockInputs[product.id];
    const newStock = parseInt(rawVal, 10);

    if (isNaN(newStock) || newStock < 0) {
      setError(`Please enter a valid non-negative inventory number for "${product.title}".`);
      return;
    }

    setSavingId(product.id);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateVendorProductStock(product.id, newStock);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      setSuccessMessage(`Inventory for "${product.title}" updated to ${updated.stock} units.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update stock quantity.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            Inventory Management
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            Monitor and adjust available stock quantities for your products.
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
        <div style={{ background: 'rgba(47, 107, 79, 0.1)', color: '#2F6B4F', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #2F6B4F', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading product inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Layers size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
          <p style={{ color: '#5B6472', fontWeight: 600 }}>No products found to manage inventory.</p>
        </div>
      ) : (
        <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textLeft: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Product</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Price</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Available Stock</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const currentStock = product.stock ?? 0;
                const isLowStock = currentStock <= 5;
                return (
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
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          min="0"
                          style={{
                            width: '90px',
                            padding: '0.35rem 0.5rem',
                            border: `1px solid ${isLowStock ? '#C53030' : '#E3E1D8'}`,
                            borderRadius: '4px',
                            fontWeight: 600,
                            color: isLowStock ? '#C53030' : '#0F2A4A',
                          }}
                          value={stockInputs[product.id] ?? ''}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                        />
                        {isLowStock && (
                          <span style={{ fontSize: '0.75rem', color: '#C53030', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                            <AlertTriangle size={14} /> Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleSaveStock(product)}
                        disabled={savingId === product.id}
                        className="btn-primary"
                        style={{
                          width: 'auto',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8rem',
                          background: '#2F6B4F',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Save size={14} />
                        {savingId === product.id ? 'Saving...' : 'Update Stock'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendorInventory;
