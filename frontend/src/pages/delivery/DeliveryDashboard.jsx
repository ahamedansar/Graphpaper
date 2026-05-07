import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Package, MapPin, Phone, CheckCircle, Truck, ArrowRight, Banknote, User, Clock, AlertCircle } from 'lucide-react';

const statusFlow = ['Assigned', 'Picked Up', 'On the Way', 'Delivered'];

const getNextStatus = (current) => {
  const idx = statusFlow.indexOf(current);
  return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
};

const statusColors = {
  'Assigned': { bg: '#FEF9C3', color: '#d97706', border: '#fde68a' },
  'Picked Up': { bg: '#E0F2FE', color: '#0284c7', border: '#bae6fd' },
  'On the Way': { bg: '#F3E8FF', color: '#9333ea', border: '#e9d5ff' },
  'Delivered': { bg: '#DCFCE7', color: '#16a34a', border: '#bbf7d0' },
  'Cash Collected': { bg: '#DCFCE7', color: '#16a34a', border: '#bbf7d0' },
};

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchDeliveries = async () => {
    try {
      const { data } = await api.get('/orders/delivery', config);
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const updateStatus = async (orderId, nextStatus) => {
    setUpdating(`status_${orderId}`);
    try {
      await api.put(`/orders/${orderId}/delivery-status`, { status: nextStatus }, config);
      toast.success(`Marked as: ${nextStatus}`);
      fetchDeliveries();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const confirmCash = async (orderId) => {
    setUpdating(`cash_${orderId}`);
    try {
      await api.put(`/orders/${orderId}/cash-collected`, {}, config);
      toast.success('Cash payment confirmed!');
      fetchDeliveries();
    } catch { toast.error('Failed to confirm cash'); }
    finally { setUpdating(null); }
  };

  const activeOrders = orders.filter(o => o.orderStatus !== 'Delivered');
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered');

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#d97706' }}></div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#d97706', margin: '0 0 6px' }}>Delivery Portal</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontWeight: '900', fontSize: '1.75rem', color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>My Deliveries</h1>
            <p style={{ color: '#888', margin: 0, fontSize: '15px' }}>Update status for each assigned order below.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Active', value: activeOrders.length, color: '#d97706', bg: '#FEF9C3', border: '#FDE68A' },
              { label: 'Completed', value: completedOrders.length, color: '#16a34a', bg: '#DCFCE7', border: '#BBF7D0' }
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: '14px', padding: '14px 22px', textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontWeight: '900', fontSize: '1.75rem', color: s.color, lineHeight: 1, letterSpacing: '-1px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: s.color, fontWeight: '700', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '16px' }}>
            Active Orders ({activeOrders.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrders.map(order => {
              const nextStatus = getNextStatus(order.orderStatus);
              const ss = statusColors[order.orderStatus] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
              const isCOD = order.paymentMethod === 'COD';
              const cashPending = isCOD && order.orderStatus === 'Delivered' && !order.isPaid;

              return (
                <div key={order._id} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
                  {/* Top Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: ss.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ss.color }}>
                        <Package size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a' }}>
                          Order <span style={{ color: '#4F46E5', fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Status Badge */}
                      <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 14px', borderRadius: '100px', backgroundColor: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        {order.orderStatus}
                      </span>
                      {/* COD Badge */}
                      {isCOD && (
                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 14px', borderRadius: '100px', backgroundColor: '#FEF9C3', color: '#d97706', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Banknote size={12} /> COD
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '20px', backgroundColor: '#FAFAFA', borderRadius: '12px', marginBottom: '20px' }}>
                    {/* Client */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ marginTop: '2px', color: '#4F46E5', flexShrink: 0 }}><User size={16} /></div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Client</div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>{order.user?.name || 'N/A'}</div>
                        {order.user?.phone ? (
                          <a href={`tel:${order.user.phone}`} style={{ fontSize: '13px', color: '#4F46E5', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            📞 {order.user.phone}
                          </a>
                        ) : (
                          <div style={{ fontSize: '13px', color: '#888' }}>{order.user?.email || '—'}</div>
                        )}
                      </div>
                    </div>
                    {/* Address */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ marginTop: '2px', color: '#E50010', flexShrink: 0 }}><MapPin size={16} /></div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Deliver To</div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>{order.shippingAddress?.address}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</div>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent([order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.postalCode].filter(Boolean).join(', '))}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#E50010', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                        >
                          🗺️ Open in Maps
                        </a>
                      </div>
                    </div>
                    {/* Items */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ marginTop: '2px', color: '#9333ea', flexShrink: 0 }}><Package size={16} /></div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Items</div>
                        {order.orderItems?.map((item, i) => (
                          <div key={i} style={{ fontWeight: '600', fontSize: '13px', color: '#1a1a1a' }}>{item.qty}× {item.name} {item.size && `(${item.size})`}</div>
                        ))}
                      </div>
                    </div>
                    {/* Total */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ marginTop: '2px', color: '#16a34a', flexShrink: 0 }}><Banknote size={16} /></div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Amount</div>
                        <div style={{ fontWeight: '800', fontSize: '18px', color: '#16a34a' }}>₹{order.totalPrice.toFixed(2)}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{order.isPaid ? '✓ Paid' : `Collect via ${order.paymentMethod}`}</div>
                      </div>
                    </div>
                  </div>

                  {/* COD Cash Pending Alert */}
                  {cashPending && (
                    <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertCircle size={18} color="#d97706" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#92400E' }}>
                        COD payment of ₹{order.totalPrice.toFixed(2)} pending — please collect cash and confirm below.
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {nextStatus && (
                      <button
                        onClick={() => updateStatus(order._id, nextStatus)}
                        disabled={updating === `status_${order._id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                      >
                        {updating === `status_${order._id}` ? <><div className="spinner-border spinner-border-sm" style={{ width: '16px', height: '16px' }}></div> Updating...</> : nextStatus === 'Delivered' ? <><CheckCircle size={16} /> Mark Delivered</> : <><Truck size={16} /> {nextStatus}</>}
                      </button>
                    )}
                    {/* COD Confirm Cash */}
                    {cashPending && (
                      <button
                        onClick={() => confirmCash(order._id)}
                        disabled={updating === `cash_${order._id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                      >
                        {updating === `cash_${order._id}` ? 'Confirming...' : <><Banknote size={16} /> Confirm Cash Received</>}
                      </button>
                    )}
                  </div>

                  {/* Delivery Timeline */}
                  {order.deliveryUpdates?.length > 0 && (
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '12px' }}>Update History</div>
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {order.deliveryUpdates.map((u, i) => {
                          const us = statusColors[u.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                          return (
                            <div key={i} style={{ flexShrink: 0, backgroundColor: us.bg, border: `1px solid ${us.border}`, borderRadius: '10px', padding: '8px 14px', textAlign: 'center', minWidth: '100px' }}>
                              <div style={{ fontWeight: '700', fontSize: '12px', color: us.color }}>{u.status}</div>
                              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{new Date(u.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedOrders.length > 0 && (
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '16px' }}>
            Completed ({completedOrders.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedOrders.map(order => (
              <div key={order._id} style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', opacity: 0.8 }}>
                <div>
                  <span style={{ fontWeight: '700', color: '#1a1a1a' }}>Order #{order._id.substring(0, 8)}</span>
                  <span style={{ color: '#888', fontSize: '13px', marginLeft: '12px' }}>{order.user?.name} · {order.shippingAddress?.city}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {order.isPaid && <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '100px', backgroundColor: '#DCFCE7', color: '#16a34a' }}>✓ Cash Confirmed</span>}
                  <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '100px', backgroundColor: '#DCFCE7', color: '#16a34a' }}>✓ Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚴‍♂️</div>
          <h3 style={{ color: '#1a1a1a', fontWeight: '800', marginBottom: '8px' }}>No deliveries assigned yet</h3>
          <p style={{ color: '#aaa', fontSize: '15px', maxWidth: '320px', margin: '0 auto' }}>Once admin assigns orders to you, they'll appear here. Stay ready!</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
