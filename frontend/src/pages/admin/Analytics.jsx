import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  TrendingUp, ShoppingBag, Users, Package, IndianRupee,
  BarChart3, Calendar, ArrowUp, ArrowDown, Star
} from 'lucide-react';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    Promise.all([api.get('/orders', config), api.get('/products')])
      .then(([o, p]) => { setOrders(o.data); setProducts(p.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // ── Revenue by month (last 6 months) ───────────────────
  const getMonthlyRevenue = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleString('en-IN', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        revenue: 0,
        orders: 0,
      });
    }
    orders.filter(o => o.isPaid).forEach(o => {
      const d = new Date(o.paidAt || o.createdAt);
      const m = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
      if (m) { m.revenue += o.totalPrice; m.orders++; }
    });
    return months;
  };

  // ── Top Products by sales ───────────────────────────────
  const getTopProducts = () => {
    const map = {};
    orders.forEach(o => {
      o.orderItems?.forEach(item => {
        const key = item.name;
        if (!map[key]) map[key] = { name: item.name, qty: 0, revenue: 0 };
        map[key].qty += item.qty;
        map[key].revenue += item.qty * item.price;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  };

  // ── Top Customers ───────────────────────────────────────
  const getTopCustomers = () => {
    const map = {};
    orders.forEach(o => {
      if (!o.user) return;
      const key = o.user._id || o.user;
      if (!map[key]) map[key] = { name: o.user.name || 'Unknown', totalSpent: 0, orders: 0 };
      map[key].totalSpent += o.totalPrice;
      map[key].orders++;
    });
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  };

  const monthly = getMonthlyRevenue();
  const topProducts = getTopProducts();
  const topCustomers = getTopCustomers();
  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);

  const totalRevenue = orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);
  const thisMonthRevenue = monthly[monthly.length - 1]?.revenue || 0;
  const lastMonthRevenue = monthly[monthly.length - 2]?.revenue || 0;
  const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : null;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const paidRate = orders.length > 0 ? (orders.filter(o => o.isPaid).length / orders.length * 100).toFixed(0) : 0;

  const card = { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#4F46E5' }} role="status" />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#4F46E5', margin: '0 0 6px' }}>Business Intelligence</p>
        <h1 style={{ fontWeight: '900', fontSize: '2rem', color: '#1E293B', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Analytics</h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '15px' }}>Revenue trends, top products, and customer insights.</p>
      </div>

      {/* KPI Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: <IndianRupee size={20} />, color: '#16a34a', bg: '#DCFCE7', sub: 'From paid orders' },
          { label: 'This Month', value: `₹${thisMonthRevenue.toFixed(0)}`, icon: <Calendar size={20} />, color: '#4F46E5', bg: '#EEF2FF', sub: revenueGrowth !== null ? `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs last month` : 'No data last month' },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toFixed(0)}`, icon: <ShoppingBag size={20} />, color: '#d97706', bg: '#FEF9C3', sub: `${orders.length} total orders` },
          { label: 'Payment Rate', value: `${paidRate}%`, icon: <TrendingUp size={20} />, color: '#E50010', bg: '#FFF1F2', sub: `${orders.filter(o => o.isPaid).length} paid orders` },
        ].map((kpi, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{kpi.label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>{kpi.icon}</div>
            </div>
            <div style={{ fontWeight: '900', fontSize: '1.6rem', color: '#1E293B', letterSpacing: '-1px', marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {revenueGrowth !== null && i === 1 && (
                revenueGrowth >= 0
                  ? <ArrowUp size={11} color="#16a34a" />
                  : <ArrowDown size={11} color="#E50010" />
              )}
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart */}
      <div style={{ ...card, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#4F46E5" /> Monthly Revenue — Last 6 Months
          </h2>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Paid orders only</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
          {monthly.map((m, i) => {
            const heightPct = (m.revenue / maxRevenue) * 100;
            const isLatest = i === monthly.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: isLatest ? '#4F46E5' : '#1E293B', marginBottom: '6px' }}>
                  {m.revenue > 0 ? `₹${(m.revenue / 1000).toFixed(1)}K` : '—'}
                </div>
                <div style={{ width: '100%', backgroundColor: isLatest ? '#4F46E5' : '#E0E7FF', borderRadius: '8px 8px 0 0', height: `${Math.max(heightPct, 4)}%`, transition: 'height 0.8s ease', position: 'relative' }}>
                  {m.orders > 0 && (
                    <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1E293B', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      {m.orders} order{m.orders > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: isLatest ? '#4F46E5' : '#94A3B8', marginTop: '8px' }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: Top Products + Top Customers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Top Products */}
        <div style={card}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} color="#E50010" /> Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', margin: '32px 0' }}>No sales data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topProducts.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: i === 0 ? '#FEF9C3' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', color: i === 0 ? '#d97706' : '#64748B', flexShrink: 0 }}>
                    {i === 0 ? <Star size={14} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{p.qty} units sold</div>
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#16a34a', flexShrink: 0 }}>₹{p.revenue.toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div style={card}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#9333ea" /> Top Customers
          </h2>
          {topCustomers.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', margin: '32px 0' }}>No customer data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topCustomers.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${['#4F46E5','#9333ea','#0284c7','#d97706','#16a34a'][i]}, ${['#7C3AED','#C026D3','#0EA5E9','#F59E0B','#22C55E'][i]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: '#fff', flexShrink: 0 }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#1E293B' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{c.orders} order{c.orders > 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#4F46E5', flexShrink: 0 }}>₹{c.totalSpent.toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ ...card, marginTop: '20px' }}>
        <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} color="#d97706" /> Product Category Breakdown
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {(() => {
            const cats = {};
            orders.forEach(o => o.orderItems?.forEach(item => {
              const cat = item.category || 'Other';
              cats[cat] = (cats[cat] || 0) + item.qty;
            }));
            const total = Object.values(cats).reduce((s, v) => s + v, 0) || 1;
            const colors = ['#4F46E5', '#E50010', '#16a34a', '#d97706', '#9333ea', '#0284c7'];
            return Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([cat, qty], i) => (
              <div key={cat} style={{ textAlign: 'center', padding: '16px 12px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <div style={{ fontWeight: '900', fontSize: '1.4rem', color: colors[i % colors.length], marginBottom: '4px' }}>
                  {((qty / total) * 100).toFixed(0)}%
                </div>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#1E293B', marginBottom: '2px' }}>{cat}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{qty} units</div>
              </div>
            ));
          })()}
          {orders.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: '#94A3B8' }}>No order data available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
