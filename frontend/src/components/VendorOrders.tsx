import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw, AlertCircle, CheckCircle2, Eye, X } from 'lucide-react';
import {
  fetchVendorOrders,
  fetchVendorOrderDetails,
  updateVendorOrderStatus,
  type OrderRecord,
} from '../api/vendorApi';

const FULFILLMENT_STATUSES = ['pending', 'processing', 'shipped', 'delivered'] as const;

type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

export function VendorOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<{ [key: number]: string }>({});
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVendorOrders();
      setOrders(data);
      const drafts: { [key: number]: string } = {};
      data.forEach((order) => {
        drafts[order.id] = FULFILLMENT_STATUSES.includes(order.status as FulfillmentStatus)
          ? order.status
          : 'pending';
      });
      setStatusDrafts(drafts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vendor orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusDraftChange = (orderId: number, status: string) => {
    setStatusDrafts((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleUpdateStatus = async (order: OrderRecord) => {
    const nextStatus = statusDrafts[order.id];
    if (!FULFILLMENT_STATUSES.includes(nextStatus as FulfillmentStatus)) {
      setError('Vendors can only set fulfillment statuses: pending, processing, shipped, delivered.');
      return;
    }

    setUpdatingId(order.id);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateVendorOrderStatus(order.id, nextStatus);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      if (selectedOrder?.id === order.id) {
        setSelectedOrder(updated);
      }
      setSuccessMessage(`Order ${updated.order_number} updated to ${updated.status}.`);
    } catch (err: any) {
      const validation = err.response?.data?.errors?.status?.[0];
      setError(validation || err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = async (order: OrderRecord) => {
    setSelectedOrder(order);
    setIsLoadingDetails(true);
    setError(null);
    try {
      const details = await fetchVendorOrderDetails(order.id);
      setSelectedOrder(details);
      setOrders((prev) => prev.map((o) => (o.id === details.id ? details : o)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order details.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>
            Order Management
          </h2>
          <p className="login-subtitle" style={{ textAlign: 'left' }}>
            View orders containing your products and update fulfillment status.
          </p>
        </div>
        <button
          onClick={loadOrders}
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
        <div
          style={{
            background: 'rgba(47, 107, 79, 0.1)',
            color: '#2F6B4F',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            border: '1px solid #2F6B4F',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#5B6472' }}>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <ShoppingBag size={40} style={{ color: '#5B6472', marginBottom: '0.75rem' }} />
          <p style={{ color: '#5B6472', fontWeight: 600 }}>No orders found for your products.</p>
        </div>
      ) : (
        <div className="login-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#F6F6F3', borderBottom: '1px solid #E3E1D8' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Order</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Customer</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Items</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Total</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#5B6472' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#5B6472' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCancelled = order.status === 'cancelled';
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{order.order_number}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>
                      {order.customer?.name || 'Customer'}
                      <div style={{ fontSize: '0.8rem' }}>{order.customer?.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#5B6472' }}>
                      {order.items?.length ?? 0} item(s)
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {isCancelled ? (
                        <span className="user-badge pending">cancelled</span>
                      ) : (
                        <select
                          value={statusDrafts[order.id] ?? order.status}
                          onChange={(e) => handleStatusDraftChange(order.id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.6rem',
                            border: '1px solid #E3E1D8',
                            background: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          {FULFILLMENT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => openDetails(order)}
                          style={{
                            padding: '0.35rem 0.6rem',
                            border: '1px solid #E3E1D8',
                            background: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Eye size={14} /> Details
                        </button>
                        {!isCancelled && (
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            disabled={updatingId === order.id || statusDrafts[order.id] === order.status}
                            className="btn-primary"
                            style={{
                              width: 'auto',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              background: '#2F6B4F',
                            }}
                          >
                            {updatingId === order.id ? 'Saving...' : 'Update'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 42, 74, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={closeDetails}
        >
          <div
            className="login-card"
            style={{ width: '100%', maxWidth: '560px', margin: 0, padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#0F2A4A' }}>Order {selectedOrder.order_number}</h3>
              <button
                onClick={closeDetails}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            {isLoadingDetails ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div className="spinner" style={{ width: '28px', height: '28px', margin: '0 auto 0.75rem' }} />
                <p style={{ color: '#5B6472' }}>Loading order details...</p>
              </div>
            ) : (
              <>
            <div style={{ fontSize: '0.9rem', color: '#5B6472', marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.35rem' }}>
                <strong style={{ color: '#0F2A4A' }}>Customer:</strong>{' '}
                {selectedOrder.customer?.name} ({selectedOrder.customer?.email})
              </p>
              <p style={{ marginBottom: '0.35rem' }}>
                <strong style={{ color: '#0F2A4A' }}>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong style={{ color: '#0F2A4A' }}>Total:</strong> $
                {Number(selectedOrder.total_amount).toFixed(2)}
              </p>
            </div>

            <h4 style={{ margin: '0 0 0.75rem', color: '#0F2A4A' }}>Your items</h4>
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E3E1D8' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#5B6472' }}>Product</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#5B6472' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#5B6472' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #E3E1D8' }}>
                      <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>
                        {item.product?.title || `Product #${item.product_id}`}
                      </td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{item.quantity}</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                        ${Number(item.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#5B6472' }}>No items for this vendor on the order.</p>
            )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorOrders;
