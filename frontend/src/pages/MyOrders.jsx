import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Package, ArrowRight, Clock, CheckCircle, Truck } from 'lucide-react';

const statusStyle = {
  'Pending': { bg: '#FEF9C3', color: '#d97706' },
  'Confirmed': { bg: '#EEF2FF', color: '#4F46E5' },
  'Assigned': { bg: '#E0F2FE', color: '#0284c7' },
  'Picked Up': { bg: '#E0F2FE', color: '#0284c7' },
  'On the Way': { bg: '#F3E8FF', color: '#9333ea' },
  'Delivered': { bg: '#DCFCE7', color: '#16a34a' },
};

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };
    api.get('/orders/myorders', config)
      .then(({ data }) => setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', fontFamily: "'Inter', sans-serif" }}>
      <div className="spinner-border" style={{ color: '#E50010' }}></div>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontWeight: '900', fontSize: '2rem', letterSpacing: '-1px', color: '#1a1a1a', marginBottom: '8px' }}>My Orders</h1>
      <p style={{ color: '#888', marginBottom: '36px', fontSize: '15px' }}>Track all your wholesale orders</p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Package size={48} color="#ddd" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#888', fontWeight: '700' }}>No orders yet</h3>
          <p style={{ color: '#aaa', marginBottom: '24px' }}>Browse our catalog and place your first wholesale order.</p>
          <Link to="/products" style={{ backgroundColor: '#E50010', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '700' }}>Browse Products</Link>
        </div>
      ) : (
        <div>
          {/* Active Orders Section */}
          {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#4F46E5" /> Active Orders
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').map(order => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Past Orders Section */}
          {orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled').length > 0 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="#16a34a" /> Past Orders
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled').map(order => (
                  <OrderCard key={order._id} order={order} isPast={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order, isPast }) => {
  const ss = statusStyle[order.orderStatus] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F5F5F5', opacity: isPast ? 0.8 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a', marginBottom: '6px' }}>
            Order <span style={{ fontFamily: 'monospace', color: '#4F46E5' }}>#{order._id.substring(0, 8)}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}
            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: '13px', color: '#888' }}>
            {order.orderItems?.slice(0, 2).map((item, i) => (
              <span key={i}>{item.qty}× {item.name}{i < Math.min(order.orderItems.length, 2) - 1 ? ', ' : ''}</span>
            ))}
            {order.orderItems?.length > 2 && ` +${order.orderItems.length - 2} more`}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <span style={{ fontWeight: '800', fontSize: '18px', color: isPast ? '#1a1a1a' : '#16a34a' }}>₹{order.totalPrice.toFixed(2)}</span>
          <span style={{ fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '100px', backgroundColor: ss.bg, color: ss.color }}>{order.orderStatus}</span>
        </div>
      </div>
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#888', padding: '4px 10px', borderRadius: '100px', border: '1px solid #eee' }}>{order.paymentMethod}</span>
          {order.isPaid ? (
            <span style={{ fontSize: '12px', color: '#16a34a', padding: '4px 10px', borderRadius: '100px', backgroundColor: '#DCFCE7' }}>✓ Paid</span>
          ) : (
            <span style={{ fontSize: '12px', color: '#d97706', padding: '4px 10px', borderRadius: '100px', backgroundColor: '#FEF9C3' }}>Unpaid</span>
          )}
        </div>
        <Link to={`/orders/${order._id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: isPast ? '#1a1a1a' : '#E50010', fontWeight: '700', fontSize: '13px', border: '1px solid', borderColor: isPast ? '#eee' : 'transparent', padding: isPast ? '6px 14px' : '0', borderRadius: isPast ? '100px' : '0' }}>
          {isPast ? 'View Order Details' : 'Track Order'} {isPast ? null : <ArrowRight size={14} />}
        </Link>
      </div>
    </div>
  );
};

export default MyOrders;
