import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { Users, Mail, Phone, ShoppingBag, Calendar, Search, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const CustomersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    api.get('/orders', config)
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error('Failed to load customer data'))
      .finally(() => setLoading(false));
  }, [user]);

  // Build unique customers from orders
  const customerMap = {};
  orders.forEach(order => {
    if (!order.user) return;
    const uid = order.user._id;
    if (!customerMap[uid]) {
      customerMap[uid] = {
        _id: uid,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        orders: [],
        totalSpent: 0,
      };
    }
    customerMap[uid].orders.push(order);
    if (order.isPaid) customerMap[uid].totalSpent += order.totalPrice;
  });

  const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#4F46E5' }} role="status"></div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontWeight: '900', fontSize: '1.75rem', color: '#1E293B', marginBottom: '6px', letterSpacing: '-0.5px' }}>Customers</h1>
          <p style={{ color: '#64748B', margin: 0, fontSize: '15px' }}>{customers.length} registered wholesale partners</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 20px', backgroundColor: '#EEF2FF', borderRadius: '12px', border: '1px solid #C7D2FE' }}>
          <Users size={18} color="#4F46E5" />
          <span style={{ fontWeight: '800', color: '#4F46E5', fontSize: '1.1rem' }}>{customers.length}</span>
          <span style={{ color: '#94A3B8', fontSize: '13px' }}>Total Partners</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '360px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '11px', paddingBottom: '11px',
            border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px',
            outline: 'none', backgroundColor: '#FAFAFA', fontFamily: "'Inter', sans-serif"
          }}
        />
      </div>

      {/* Customers Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                {['Customer', 'Email', 'Total Orders', 'Total Spent', 'Last Order'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, i) => {
                const lastOrder = customer.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                return (
                  <tr
                    key={customer._id}
                    style={{ borderBottom: '1px solid #F8FAFC' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          backgroundColor: ['#EEF2FF', '#FEF9C3', '#DCFCE7', '#F3E8FF'][i % 4],
                          color: ['#4F46E5', '#d97706', '#16a34a', '#9333ea'][i % 4],
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '14px', flexShrink: 0
                        }}>
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1E293B' }}>{customer.name}</div>
                          {customer.phone && (
                            <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={11} /> +91 {customer.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} color="#94A3B8" /> {customer.email}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: '800', fontSize: '16px', color: '#1E293B' }}>{customer.orders.length}</span>
                      <span style={{ color: '#94A3B8', fontSize: '12px', marginLeft: '4px' }}>orders</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: '800', color: '#16a34a', fontSize: '15px' }}>₹{customer.totalSpent.toFixed(0)}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '13px' }}>
                      {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
              <Users size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontWeight: '600' }}>{searchTerm ? 'No customers match your search' : 'No customer data yet'}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '16px', color: '#94A3B8', fontSize: '13px' }}>
        Showing {filtered.length} of {customers.length} customers
      </div>
    </div>
  );
};

export default CustomersPage;
