import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Package, MapPin, Banknote, User, CheckCircle, Truck, AlertCircle, Edit2, Check } from 'lucide-react';

const statusFlow = ['Assigned', 'Picked Up', 'On the Way', 'Delivered'];
const getNextStatus = (current) => {
  const idx = statusFlow.indexOf(current);
  return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
};
const statusColors = {
  'Assigned':   { bg: '#FEF9C3', color: '#d97706', border: '#fde68a' },
  'Picked Up':  { bg: '#E0F2FE', color: '#0284c7', border: '#bae6fd' },
  'On the Way': { bg: '#F3E8FF', color: '#9333ea', border: '#e9d5ff' },
  'Delivered':  { bg: '#DCFCE7', color: '#16a34a', border: '#bbf7d0' },
};

const DeliveryDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [available, setAvailable] = useState([]);
  const [mine, setMine]       = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const [newDbName, setNewDbName] = useState('');
  const [newDbPhone, setNewDbPhone] = useState('');
  const [showAddDb, setShowAddDb] = useState(false);
  const [addingDb, setAddingDb] = useState(false);

  // Selected delivery boy per order
  const [selectedDb, setSelectedDb] = useState({});

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchDeliveries = async () => {
    try {
      const [delRes, boysRes] = await Promise.all([
        api.get('/orders/delivery', config),
        api.get('/orders/delivery-boys', config)
      ]);
      setAvailable(delRes.data.available || []);
      setMine(delRes.data.mine || []);
      setDeliveryBoys(boysRes.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const handleAddDeliveryBoy = async (e) => {
    e.preventDefault();
    if (!newDbName || !newDbPhone) return toast.error('Name and phone required');
    setAddingDb(true);
    try {
      await api.post('/users/delivery-boy', { name: newDbName, phone: newDbPhone }, config);
      toast.success('Delivery Boy added successfully!');
      setNewDbName('');
      setNewDbPhone('');
      setShowAddDb(false);
      fetchDeliveries();
    } catch {
      toast.error('Failed to add delivery boy');
    } finally {
      setAddingDb(false);
    }
  };



  // Self-assign: delivery boy picks an available order
  const takeOrder = async (orderId) => {
    const dbId = selectedDb[orderId];
    if (!dbId) return toast.warning('Please select a delivery boy first!');
    
    setUpdating(`take_${orderId}`);
    try {
      await api.put(`/orders/${orderId}/self-assign`, { deliveryBoyId: dbId }, config);
      toast.success('✅ Order taken! Admin has been notified.');
      fetchDeliveries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to take order');
    } finally {
      setUpdating(null);
    }
  };

  // Update delivery status
  const updateStatus = async (orderId, nextStatus) => {
    setUpdating(`status_${orderId}`);
    try {
      await api.put(`/orders/${orderId}/delivery-status`, { status: nextStatus }, config);
      toast.success(`Marked as: ${nextStatus}`);
      fetchDeliveries();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  // Confirm COD cash
  const confirmCash = async (orderId) => {
    setUpdating(`cash_${orderId}`);
    try {
      await api.put(`/orders/${orderId}/cash-collected`, {}, config);
      toast.success('Cash payment confirmed!');
      fetchDeliveries();
    } catch { toast.error('Failed to confirm cash'); }
    finally { setUpdating(null); }
  };

  const activeOrders    = mine.filter(o => o.orderStatus !== 'Delivered');
  const completedOrders = mine.filter(o => o.orderStatus === 'Delivered');
  const totalEarnings   = mine.reduce((s, o) => s + (o.deliveryEarnings || 0), 0);
  const totalKm         = mine.reduce((s, o) => s + (o.deliveryDistance || 0), 0);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#d97706' }}></div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Dispatch Center Header & Metrics ─────────────────────────── */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px 28px', marginBottom: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#FEF9C3', border: '2px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} color="#d97706" />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#d97706' }}>Graphpaper</p>
              <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem', color: '#1a1a1a' }}>Dispatch Center</h2>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Active', value: activeOrders.length, color: '#d97706', bg: '#FEF9C3' },
              { label: 'Done', value: completedOrders.length, color: '#16a34a', bg: '#DCFCE7' },
              { label: `${totalKm} km`, value: '', color: '#4F46E5', bg: '#EEF2FF', sub: 'Total Km' },
              { label: `₹${totalEarnings}`, value: '', color: '#16a34a', bg: '#F0FFF4', sub: 'Earnings' },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: s.bg, borderRadius: '12px', padding: '10px 16px', textAlign: 'center', minWidth: '72px' }}>
                <div style={{ fontWeight: '900', fontSize: '1.25rem', color: s.color, lineHeight: 1 }}>{s.value || s.label}</div>
                <div style={{ fontSize: '10px', color: s.color, fontWeight: '700', marginTop: '3px', textTransform: 'uppercase' }}>{s.sub || s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Manage Delivery Boys ────────────────────── */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px 28px', marginBottom: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddDb ? '16px' : '0' }}>
          <h2 style={{ margin: 0, fontWeight: '800', fontSize: '15px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#d97706" /> Delivery Personnel
          </h2>
          <button onClick={() => setShowAddDb(!showAddDb)} style={{ backgroundColor: showAddDb ? '#F1F5F9' : '#d97706', color: showAddDb ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            {showAddDb ? 'Cancel' : '+ Add New'}
          </button>
        </div>
        {showAddDb && (
          <form onSubmit={handleAddDeliveryBoy} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: '#FAFAFA', padding: '16px', borderRadius: '12px' }}>
            <input type="text" placeholder="Name" required value={newDbName} onChange={e => setNewDbName(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            <input type="tel" placeholder="Phone Number" required value={newDbPhone} onChange={e => setNewDbPhone(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            <button type="submit" disabled={addingDb} style={{ backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '700', cursor: addingDb ? 'not-allowed' : 'pointer' }}>
              {addingDb ? 'Adding...' : 'Save'}
            </button>
          </form>
        )}
      </div>

      {/* ── Available Orders Pool ────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#d97706', margin: 0 }}>
            🚀 Available to Pick ({available.length})
          </h2>
          {available.length > 0 && (
            <span style={{ backgroundColor: '#FEF9C3', color: '#d97706', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', border: '1px solid #FDE68A' }}>
              First come first served!
            </span>
          )}
        </div>

        {available.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #E2E8F0' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
            <p style={{ color: '#aaa', fontSize: '14px', fontWeight: '600', margin: 0 }}>No orders available right now. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {available.map(order => (
              <div key={order._id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1.5px solid #FDE68A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>
                      Order <span style={{ color: '#4F46E5', fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <User size={14} color="#888" style={{ marginTop: '1px', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>{order.user?.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <MapPin size={14} color="#E50010" style={{ marginTop: '1px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '700' }}>{order.shippingAddress?.address}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</div>
                          <a href={`https://maps.google.com/?q=${encodeURIComponent([order.shippingAddress?.address, order.shippingAddress?.city].join(', '))}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '11px', color: '#E50010', fontWeight: '700', textDecoration: 'none' }}>
                            🗺️ Open Maps
                          </a>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Banknote size={14} color="#16a34a" />
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#16a34a' }}>₹{order.totalPrice.toFixed(2)}</span>
                        <span style={{ fontSize: '11px', color: '#888' }}>{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      {order.orderItems?.map((item, i) => (
                        <span key={i} style={{ fontSize: '12px', color: '#555', backgroundColor: '#F8F8F8', padding: '3px 10px', borderRadius: '100px', marginRight: '6px', display: 'inline-block', marginTop: '4px' }}>
                          {item.qty}× {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <select
                      value={selectedDb[order._id] || ''}
                      onChange={e => setSelectedDb(prev => ({ ...prev, [order._id]: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #FDE68A', outline: 'none', fontSize: '14px', fontWeight: '700', backgroundColor: '#FFFBEB', color: '#92400E' }}
                    >
                      <option value="">Select Personnel...</option>
                      {deliveryBoys.map(db => (
                        <option key={db._id} value={db._id}>{db.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => takeOrder(order._id)}
                      disabled={updating === `take_${order._id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(217,119,6,0.35)', transition: '0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b45309'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d97706'}
                    >
                      <Truck size={16} />
                      {updating === `take_${order._id}` ? 'Taking...' : 'Take This Delivery'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── My Active Orders ─────────────────────────── */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#4F46E5', marginBottom: '16px' }}>
            My Active Deliveries ({activeOrders.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrders.map(order => {
              const nextStatus = getNextStatus(order.orderStatus);
              const ss = statusColors[order.orderStatus] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
              const isCOD = order.paymentMethod === 'COD';
              const cashPending = isCOD && order.orderStatus === 'Delivered' && !order.isPaid;

              return (
                <div key={order._id} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1.5px solid ${ss.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a' }}>
                      Order <span style={{ color: '#4F46E5', fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 14px', borderRadius: '100px', backgroundColor: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', padding: '16px', backgroundColor: '#FAFAFA', borderRadius: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Client</div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{order.user?.name}</div>
                      {order.user?.phone && <a href={`tel:${order.user.phone}`} style={{ fontSize: '13px', color: '#4F46E5', fontWeight: '700', textDecoration: 'none' }}>📞 {order.user.phone}</a>}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Deliver To</div>
                      <div style={{ fontWeight: '700', fontSize: '13px' }}>{order.shippingAddress?.address}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{order.shippingAddress?.city}</div>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent([order.shippingAddress?.address, order.shippingAddress?.city].join(', '))}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '11px', color: '#E50010', fontWeight: '700', textDecoration: 'none' }}>🗺️ Open Maps</a>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Amount</div>
                      <div style={{ fontWeight: '800', fontSize: '16px', color: '#16a34a' }}>₹{order.totalPrice.toFixed(2)}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{order.isPaid ? '✓ Paid' : `Collect via ${order.paymentMethod}`}</div>
                      {order.deliveryDistance > 0 && (
                        <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '3px 8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>🚴 {order.deliveryDistance}km → ₹{order.deliveryEarnings}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {cashPending && (
                    <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} color="#d97706" />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#92400E' }}>COD ₹{order.totalPrice.toFixed(2)} pending — collect cash and confirm.</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {nextStatus && (
                      <button onClick={() => updateStatus(order._id, nextStatus)} disabled={updating === `status_${order._id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                        {updating === `status_${order._id}` ? 'Updating...' : nextStatus === 'Delivered' ? <><CheckCircle size={15} /> Mark Delivered</> : <><Truck size={15} /> {nextStatus}</>}
                      </button>
                    )}
                    {cashPending && (
                      <button onClick={() => confirmCash(order._id)} disabled={updating === `cash_${order._id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                        <Banknote size={15} /> {updating === `cash_${order._id}` ? 'Confirming...' : 'Confirm Cash Received'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Completed Orders ─────────────────────────── */}
      {completedOrders.length > 0 && (
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#16a34a', marginBottom: '12px' }}>
            ✅ Completed ({completedOrders.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {completedOrders.map(order => (
              <div key={order._id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '14px 20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', opacity: 0.85 }}>
                <div>
                  <span style={{ fontWeight: '700', color: '#1a1a1a' }}>#{order._id.substring(0, 8)}</span>
                  <span style={{ color: '#888', fontSize: '13px', marginLeft: '10px' }}>{order.user?.name} · {order.shippingAddress?.city}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {order.deliveryEarnings > 0 && <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', backgroundColor: '#F0FFF4', color: '#16a34a' }}>₹{order.deliveryEarnings} earned</span>}
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', backgroundColor: '#DCFCE7', color: '#16a34a' }}>✓ Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mine.length === 0 && available.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚴‍♂️</div>
          <h3 style={{ color: '#1a1a1a', fontWeight: '800', marginBottom: '8px' }}>All clear!</h3>
          <p style={{ color: '#aaa', fontSize: '15px' }}>No orders available right now. Stay ready!</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
