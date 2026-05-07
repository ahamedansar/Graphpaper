import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { ShoppingBag, Package, IndianRupee, Clock, CheckCircle, Truck, ArrowRight, TrendingUp, Users, AlertTriangle, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    Promise.all([
      api.get('/orders', config),
      api.get('/products'),
      api.get('/orders/delivery-boys', config),
    ]).then(([ordersRes, productsRes, boysRes]) => {
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setDeliveryBoys(boysRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const totalRevenue = orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const confirmedOrders = orders.filter(o => ['Confirmed', 'Assigned', 'Picked Up', 'On the Way'].includes(o.orderStatus)).length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.countInStock < 20).length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={22} />, color: '#4F46E5', bg: '#EEF2FF', trend: '+12% this month' },
    { label: 'Pending Review', value: pendingOrders, icon: <Clock size={22} />, color: '#d97706', bg: '#FEF9C3', trend: 'Needs attention', urgent: pendingOrders > 0 },
    { label: 'In Transit', value: confirmedOrders, icon: <Truck size={22} />, color: '#0284c7', bg: '#E0F2FE', trend: 'On the way' },
    { label: 'Delivery Boys', value: deliveryBoys.length, icon: <Users size={22} />, color: '#059669', bg: '#D1FAE5', trend: 'Active personnel' },
    { label: 'Total Products', value: products.length, icon: <Package size={22} />, color: '#9333ea', bg: '#F3E8FF', trend: `${lowStockProducts} low stock` },
    { label: 'Revenue (Paid)', value: `₹${totalRevenue >= 1000 ? (totalRevenue / 1000).toFixed(1) + 'K' : totalRevenue.toFixed(0)}`, icon: <TrendingUp size={22} />, color: '#E50010', bg: '#FFF1F2', trend: 'From paid orders' },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  const statusStyle = {
    'Pending':    { bg: '#FEF9C3', color: '#d97706' },
    'Confirmed':  { bg: '#EEF2FF', color: '#4F46E5' },
    'Assigned':   { bg: '#E0F2FE', color: '#0284c7' },
    'Picked Up':  { bg: '#E0F2FE', color: '#0284c7' },
    'On the Way': { bg: '#F3E8FF', color: '#9333ea' },
    'Delivered':  { bg: '#DCFCE7', color: '#16a34a' },
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#4F46E5' }} role="status"></div>
    </div>
  );

  const orderStatusData = [
    { label: 'Pending', count: pendingOrders, color: '#d97706' },
    { label: 'In Transit', count: confirmedOrders, color: '#0284c7' },
    { label: 'Delivered', count: deliveredOrders, color: '#16a34a' },
  ];
  const maxCount = Math.max(...orderStatusData.map(d => d.count), 1);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Welcome Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontWeight: '900', fontSize: '1.75rem', color: '#1E293B', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#64748B', margin: 0, fontSize: '15px' }}>
            Welcome back, <strong style={{ color: '#1E293B' }}>{user?.name?.split(' ')[0]}</strong>! Here's your business overview.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#4F46E5', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
            <ShoppingBag size={16} /> Manage Orders
          </Link>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
            <Package size={16} /> Products
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '20px',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: `1px solid ${stat.urgent ? '#FDE68A' : '#F1F5F9'}`,
            position: 'relative', overflow: 'hidden'
          }}>
            {stat.urgent && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#d97706' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{stat.label}</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontWeight: '900', fontSize: '1.75rem', color: '#1E293B', letterSpacing: '-1px', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: stat.urgent ? '#d97706' : '#94A3B8', fontWeight: '600' }}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Two columns: Chart + Low Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Order Status Bar Chart */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#4F46E5" /> Order Status Overview
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orderStatusData.map(d => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748B' }}>{d.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E293B' }}>{d.count}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', backgroundColor: d.color, borderRadius: '100px',
                    width: `${(d.count / maxCount) * 100}%`, transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#d97706" /> Low Stock Alerts
          </h2>
          {products.filter(p => p.countInStock < 20).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
              <CheckCircle size={32} color="#16a34a" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>All products well stocked!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
              {products.filter(p => p.countInStock < 20).map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#92400E' }}>{p.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#d97706', backgroundColor: '#FEF9C3', padding: '3px 10px', borderRadius: '100px' }}>
                    {p.countInStock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1E293B', margin: 0 }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#4F46E5', fontWeight: '700', fontSize: '13px', padding: '6px 14px', backgroundColor: '#EEF2FF', borderRadius: '8px' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                {['Order ID', 'Client', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const ss = statusStyle[order.orderStatus] || { bg: '#F1F5F9', color: '#475569' };
                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #F8FAFC' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#4F46E5', fontFamily: 'monospace', fontSize: '13px' }}>#{order._id.substring(0, 8)}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '600', color: '#1E293B' }}>{order.user?.name || '—'}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '800', color: '#16a34a' }}>₹{order.totalPrice.toFixed(2)}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '100px', backgroundColor: order.isPaid ? '#DCFCE7' : '#FEF9C3', color: order.isPaid ? '#16a34a' : '#d97706' }}>
                        {order.isPaid ? '✓ Paid' : order.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '100px', backgroundColor: ss.bg, color: ss.color }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8', fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
              <ShoppingBag size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontWeight: '600' }}>No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
