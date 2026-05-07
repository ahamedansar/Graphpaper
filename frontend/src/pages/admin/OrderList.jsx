import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Check, X, Truck, Eye, ShoppingBag, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState({});

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/orders', config);
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/orders/delivery-boys', config);
      setDeliveryBoys(data);
    } catch (err) {
      console.error('Failed to load delivery boys');
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/orders/${orderId}/confirm`, {}, config);
      toast.success('Order Confirmed!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to confirm order');
    }
  };

  const assignOrder = async (orderId) => {
    const deliveryBoyId = selectedDeliveryBoy[orderId];
    if (!deliveryBoyId) {
      toast.warning('Please select a delivery boy first');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/orders/${orderId}/assign`, { deliveryBoyId }, config);
      toast.success('Order assigned to delivery boy!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to assign order');
    }
  };

  const markAsPaid = async (orderId) => {
    if (!window.confirm('Mark this order as PAID? This confirms payment was received.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/orders/${orderId}/pay`, {}, config);
      toast.success('Order marked as paid!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark as paid');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, [user]);

  if (loading) return (
    <div className="text-center py-5 text-white">
      <div className="spinner-border" style={{ color: '#a3ff00' }} role="status"></div>
      <p className="mt-3 text-muted">Loading orders...</p>
    </div>
  );

  const sortedOrders = [...orders].sort((a, b) =>
    a.orderStatus === 'Delivered' ? 1 : b.orderStatus === 'Delivered' ? -1 : 0
  );

  return (
    <div className="fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 pb-4 border-bottom" style={{ borderColor: '#E2E8F0' }}>
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: '2rem', color: '#1E293B' }}>Purchases</h1>
          <p className="mb-0 small" style={{ color: '#64748B' }}>Accept incoming orders and assign them to delivery boys.</p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0 rounded-pill px-4 py-2" style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}>
          <ShoppingBag size={18} style={{ color: '#4F46E5' }} />
          <span className="fw-bold" style={{ color: '#4F46E5' }}>{sortedOrders.length}</span>
          <span style={{ color: '#94A3B8' }}>Total Orders</span>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {sortedOrders.map((order) => (
          <div key={order._id} className="card border-0 rounded-4 overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(79,70,229,0.07)' }}>
            <div className="card-body p-4">
              
              {/* Row 1: Order Info */}
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-4 mb-4 pb-4 border-bottom" style={{ borderColor: '#E2E8F0' }}>
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <div className="rounded-3 p-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: '#EEF2FF', width: '56px', height: '56px' }}>
                    <ShoppingBag size={22} style={{ color: '#4F46E5' }} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 fs-5" style={{ color: '#1E293B' }}>{order.user ? order.user.name : 'Deleted Account'}</h6>
                    <div className="small d-flex flex-wrap gap-2" style={{ color: '#94A3B8' }}>
                      <span>#{order._id.substring(0, 8)}</span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="fw-bold" style={{ color: '#16a34a' }}>₹{order.totalPrice.toFixed(2)}</span>
                      <span>•</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge + Mark as Paid */}
                <div className="d-flex align-items-center gap-3">
                  {order.isPaid ? (
                    <span className="badge rounded-pill px-3 py-2 text-success" style={{ backgroundColor: '#22c55e22' }}><Check size={14} /> Paid</span>
                  ) : (
                    <>
                      <span className="badge rounded-pill px-3 py-2 text-warning" style={{ backgroundColor: '#f59e0b22' }}><X size={14} /> Unpaid</span>
                      <button onClick={() => markAsPaid(order._id)} className="btn rounded-pill px-3 py-1 fw-bold border-0" style={{ backgroundColor: '#DCFCE7', color: '#16a34a', fontSize: '12px' }}>
                        ✓ Mark as Paid
                      </button>
                    </>
                  )}
                  <Link to={`/orders/${order._id}`} className="btn rounded-circle p-2 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#252A33', width: '40px', height: '40px' }}>
                    <Eye size={18} className="text-white" />
                  </Link>
                </div>
              </div>

              {/* Row 2: Action Area */}
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                <span className="small fw-bold text-uppercase" style={{ color: '#94A3B8', letterSpacing: '0.5px', minWidth: '80px' }}>Status:</span>
                
                {/* PENDING — Show Accept button */}
                {order.orderStatus === 'Pending' && (
                  <button onClick={() => confirmOrder(order._id)} className="btn rounded-pill px-4 py-2 fw-bold text-white border-0" style={{ backgroundColor: '#4F46E5', fontSize: '13px' }}>
                    Accept Order
                  </button>
                )}

                {/* CONFIRMED — Show Assign to Delivery Boy */}
                {order.orderStatus === 'Confirmed' && (
                  <div className="d-flex align-items-center gap-2 flex-grow-1">
                    <select
                      className="form-select border-0 rounded-pill fw-semibold small"
                      style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', maxWidth: '260px' }}
                      value={selectedDeliveryBoy[order._id] || ''}
                      onChange={(e) => setSelectedDeliveryBoy(prev => ({ ...prev, [order._id]: e.target.value }))}
                    >
                      <option value="">Select Delivery Boy...</option>
                      {deliveryBoys.map(db => (
                        <option key={db._id} value={db._id}>{db.name} ({db.phone || db.email})</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => assignOrder(order._id)} 
                      className="btn rounded-pill px-4 py-2 fw-bold text-white border-0 d-flex align-items-center gap-2 flex-shrink-0"
                      style={{ backgroundColor: '#7C3AED', fontSize: '13px' }}
                    >
                      <UserCheck size={16} /> Assign
                    </button>
                  </div>
                )}

                {/* ASSIGNED/IN TRANSIT */}
                {['Assigned', 'Picked Up', 'On the Way'].includes(order.orderStatus) && (
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '13px' }}>
                    <Truck size={14} className="me-1" /> {order.orderStatus}
                  </span>
                )}

                {/* DELIVERED */}
                {order.orderStatus === 'Delivered' && (
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#F0FDF4', color: '#16a34a', fontSize: '13px' }}>
                    <Check size={14} className="me-1" /> Delivered
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-5">
            <ShoppingBag size={48} className="text-muted mb-3 opacity-25" />
            <h5 className="text-muted">No orders found</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
