import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, CheckCircle, ShoppingBag } from 'lucide-react';

const getStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const sColor = ['', '#E50010', '#d97706', '#0284c7', '#16a34a'];
const sLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    // Load profile
    api.get('/users/profile', config).then(({ data }) => {
      setName(data.name || '');
      setPhone(data.phone || '');
    }).catch(() => {});

    // Load recent orders
    api.get('/orders/myorders', config).then(({ data }) => {
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
    }).catch(() => {}).finally(() => setOrdersLoading(false));
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { name, phone };
      if (newPwd) {
        if (!currentPwd) { toast.error('Enter your current password to change it.'); setLoading(false); return; }
        payload.currentPassword = currentPwd;
        payload.newPassword = newPwd;
      }
      await api.put('/users/profile', payload, config);
      toast.success('Profile updated successfully!');
      setCurrentPwd(''); setNewPwd('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(newPwd);

  const statusStyle = {
    'Pending':    { bg: '#FEF9C3', color: '#d97706' },
    'Confirmed':  { bg: '#EEF2FF', color: '#4F46E5' },
    'Assigned':   { bg: '#E0F2FE', color: '#0284c7' },
    'Picked Up':  { bg: '#E0F2FE', color: '#0284c7' },
    'On the Way': { bg: '#F3E8FF', color: '#9333ea' },
    'Delivered':  { bg: '#DCFCE7', color: '#16a34a' },
    'Cancelled':  { bg: '#FEE2E2', color: '#dc2626' },
  };

  const card = { backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0', marginBottom: '20px' };
  const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #F0F0F0', borderRadius: '12px', fontSize: '15px', outline: 'none', backgroundColor: '#F9F9F9', fontFamily: "'Inter', sans-serif" };
  const label = { display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '7px' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#E50010', margin: '0 0 6px' }}>Account</p>
        <h1 style={{ fontWeight: '900', fontSize: '2rem', letterSpacing: '-1px', color: '#1a1a1a', margin: '0 0 4px' }}>My Profile</h1>
        <p style={{ color: '#888', margin: 0, fontSize: '15px' }}>Manage your personal info and account settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Left Column */}
        <div>
          {/* Avatar Card */}
          <div style={{ ...card, textAlign: 'center', padding: '36px 24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #E50010, #ff4d4d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', fontWeight: '900', color: '#fff' }}>
              {name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h2 style={{ fontWeight: '900', fontSize: '1.25rem', color: '#1a1a1a', margin: '0 0 4px' }}>{name}</h2>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px' }}>{user?.email}</p>
            <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '100px', backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Retailer
            </span>
          </div>

          {/* Recent Orders */}
          <div style={card}>
            <h3 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} color="#E50010" /> Recent Orders
            </h3>
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>Loading...</div>
            ) : orders.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>No orders yet.</p>
            ) : (
              orders.map(order => {
                const ss = statusStyle[order.orderStatus] || { bg: '#F1F5F9', color: '#475569' };
                return (
                  <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F8F8F8' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a', fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#16a34a', fontSize: '14px' }}>₹{order.totalPrice?.toFixed(0)}</div>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', backgroundColor: ss.bg, color: ss.color }}>{order.orderStatus}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column — Edit Form */}
        <div>
          <form onSubmit={handleSaveProfile}>

            {/* Personal Info */}
            <div style={card}>
              <h3 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#4F46E5" /> Personal Information
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={label}>Full Name / Business Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, paddingLeft: '38px' }}
                    onFocus={e => e.target.style.borderColor = '#E50010'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                </div>
              </div>

              <div style={{ marginBottom: '4px' }}>
                <label style={label}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input value={user?.email || ''} disabled style={{ ...inputStyle, paddingLeft: '38px', opacity: 0.5, cursor: 'not-allowed' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#aaa', margin: '5px 0 0' }}>Email cannot be changed.</p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={label}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" style={{ ...inputStyle, paddingLeft: '38px' }}
                    onFocus={e => e.target.style.borderColor = '#E50010'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div style={card}>
              <h3 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#9333ea" /> Change Password
              </h3>
              <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 16px' }}>Leave blank if you don't want to change your password.</p>

              <div style={{ marginBottom: '14px' }}>
                <label style={label}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type={showCurrent ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••"
                    style={{ ...inputStyle, paddingLeft: '38px', paddingRight: '40px' }}
                    onFocus={e => e.target.style.borderColor = '#9333ea'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={label}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingLeft: '38px', paddingRight: '40px' }}
                    onFocus={e => e.target.style.borderColor = '#9333ea'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                  <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {newPwd.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= strength ? sColor[strength] : '#F0F0F0', transition: '0.3s' }} />)}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: sColor[strength] }}>{sLabel[strength]}</span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', background: loading ? '#ccc' : 'linear-gradient(135deg, #E50010, #ff4d4d)',
              color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s'
            }}>
              {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
