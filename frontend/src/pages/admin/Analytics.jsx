import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Users, Package, IndianRupee,
  BarChart3, Calendar, ArrowUp, ArrowDown, Star, Download
} from 'lucide-react';

const COLORS = ['#4F46E5', '#E50010', '#16a34a', '#d97706', '#9333ea', '#0284c7'];

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

  const getMonthlyRevenue = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ label: d.toLocaleString('en-IN', { month: 'short' }), year: d.getFullYear(), month: d.getMonth(), revenue: 0, orders: 0 });
    }
    orders.filter(o => o.isPaid).forEach(o => {
      const d = new Date(o.paidAt || o.createdAt);
      const m = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
      if (m) { m.revenue += o.totalPrice; m.orders++; }
    });
    return months;
  };

  const getTopProducts = () => {
    const map = {};
    orders.forEach(o => o.orderItems?.forEach(item => {
      if (!map[item.name]) map[item.name] = { name: item.name.length > 18 ? item.name.substring(0,18)+'…' : item.name, qty: 0, revenue: 0 };
      map[item.name].qty += item.qty;
      map[item.name].revenue += item.qty * item.price;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  };

  const getCategoryBreakdown = () => {
    const map = {};
    orders.forEach(o => o.orderItems?.forEach(item => {
      const cat = item.category || 'Other';
      map[cat] = (map[cat] || 0) + item.qty;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

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
  const categoryData = getCategoryBreakdown();
  const topCustomers = getTopCustomers();

  const totalRevenue = orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);
  const thisMonthRevenue = monthly[monthly.length - 1]?.revenue || 0;
  const lastMonthRevenue = monthly[monthly.length - 2]?.revenue || 0;
  const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : null;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const paidRate = orders.length > 0 ? (orders.filter(o => o.isPaid).length / orders.length * 100).toFixed(0) : 0;

  const exportToExcel = () => {
    const orderSheet = orders.map(o => ({
      'Order ID': o._id?.substring(0, 8),
      'Customer': o.user?.name || 'N/A',
      'Total (₹)': o.totalPrice?.toFixed(2),
      'Payment Method': o.paymentMethod,
      'Paid': o.isPaid ? 'Yes' : 'No',
      'Status': o.orderStatus,
      'Date': new Date(o.createdAt).toLocaleDateString('en-IN'),
    }));
    const revenueSheet = monthly.map(m => ({
      'Month': m.label,
      'Revenue (₹)': m.revenue.toFixed(2),
      'Orders': m.orders,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(orderSheet), 'Orders');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(revenueSheet), 'Monthly Revenue');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topCustomers.map(c => ({ Customer: c.name, 'Total Spent (₹)': c.totalSpent.toFixed(2), Orders: c.orders }))), 'Top Customers');
    XLSX.writeFile(wb, `Graphpaper_Report_${new Date().toLocaleDateString('en-IN').replace(/\//g,'-')}.xlsx`);
  };

  const card = { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#4F46E5' }} role="status" />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#4F46E5', margin: '0 0 6px' }}>Business Intelligence</p>
          <h1 style={{ fontWeight: '900', fontSize: '2rem', color: '#1E293B', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Analytics</h1>
          <p style={{ color: '#94A3B8', margin: 0, fontSize: '15px' }}>Revenue trends, top products, and customer insights.</p>
        </div>
        <button onClick={exportToExcel}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          <Download size={16} /> Export Excel Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue/1000).toFixed(1)}K`, icon: <IndianRupee size={20} />, color: '#16a34a', bg: '#DCFCE7', sub: 'From paid orders' },
          { label: 'This Month', value: `₹${thisMonthRevenue.toFixed(0)}`, icon: <Calendar size={20} />, color: '#4F46E5', bg: '#EEF2FF', sub: revenueGrowth !== null ? `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs last month` : 'No comparison data' },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toFixed(0)}`, icon: <ShoppingBag size={20} />, color: '#d97706', bg: '#FEF9C3', sub: `${orders.length} total orders` },
          { label: 'Payment Rate', value: `${paidRate}%`, icon: <TrendingUp size={20} />, color: '#E50010', bg: '#FFF1F2', sub: `${orders.filter(o=>o.isPaid).length} paid orders` },
        ].map((kpi, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{kpi.label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>{kpi.icon}</div>
            </div>
            <div style={{ fontWeight: '900', fontSize: '1.6rem', color: '#1E293B', letterSpacing: '-1px', marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {revenueGrowth !== null && i === 1 && (Number(revenueGrowth) >= 0 ? <ArrowUp size={11} color="#16a34a" /> : <ArrowDown size={11} color="#E50010" />)}
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: '24px' }}>
        <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="#4F46E5" /> Monthly Revenue — Last 6 Months
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'K' : v}`} />
            <Tooltip formatter={(val) => [`₹${val.toFixed(2)}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
            <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        <div style={card}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} color="#E50010" /> Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', margin: '32px 0' }}>No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'K' : v}`} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip formatter={(val) => [`₹${val.toFixed(2)}`, 'Revenue']} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#E50010" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} color="#d97706" /> Category Breakdown
          </h2>
          {categoryData.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', margin: '32px 0' }}>No order data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val, name) => [val + ' units', name]} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={card}>
        <h2 style={{ fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="#9333ea" /> Top Customers
        </h2>
        {topCustomers.length === 0 ? (
          <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', margin: '24px 0' }}>No customer data yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topCustomers.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[(i+2)%COLORS.length]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px', color: '#fff', flexShrink: 0 }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1E293B' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>{c.orders} order{c.orders > 1 ? 's' : ''}</div>
                </div>
                <div style={{ fontWeight: '800', fontSize: '15px', color: '#4F46E5' }}>₹{c.totalSpent.toFixed(0)}</div>
                {i === 0 && <Star size={16} color="#d97706" fill="#d97706" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
