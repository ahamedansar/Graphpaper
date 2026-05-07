import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Layers, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../index.css';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('adminDarkMode') === 'true');

  useEffect(() => {
    if (!user?.token) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    api.get('/orders', config)
      .then(({ data }) => {
        const pending = data.filter(o => o.orderStatus === 'Pending').length;
        setPendingCount(pending);
      })
      .catch(() => {});
  }, [user]);

  const toggleDark = () => {
    setDarkMode(prev => {
      localStorage.setItem('adminDarkMode', !prev);
      return !prev;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const bg     = darkMode ? '#0F172A' : '#F0F4FF';
  const header = darkMode ? '#1E293B' : '#FFFFFF';
  const border = darkMode ? '#334155' : '#E2E8F0';
  const text   = darkMode ? '#F1F5F9' : '#1E293B';
  const sub    = darkMode ? '#94A3B8' : '#64748B';
  const mainBg = darkMode ? '#0F172A' : '#F0F4FF';

  return (
    <div style={{ backgroundColor: mainBg, color: text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'background-color 0.3s, color 0.3s' }}>

      <header className="d-flex justify-content-between align-items-center px-5 py-3"
        style={{ backgroundColor: header, borderBottom: `1px solid ${border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', transition: 'background-color 0.3s' }}>

        <div className="d-flex align-items-center gap-2">
          <div className="rounded-2 p-2" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            <Layers size={22} color="#fff" />
          </div>
          <span className="fw-bold" style={{ fontSize: '16px', color: text, letterSpacing: '-0.5px' }}>
            Graphpaper <span style={{ color: '#4F46E5' }}>Admin</span>
          </span>
        </div>

        <nav className="d-none d-md-flex align-items-center gap-1" style={{ fontSize: '14px', fontWeight: '500' }}>
          {[['dashboard','Dashboard'],['products','Products'],['orders','Purchases'],['feedbacks','Feedbacks'],['customers','Customers'],['analytics','Analytics']].map(([path, label]) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              className={({isActive}) => isActive
                ? 'text-decoration-none px-4 py-2 rounded-pill fw-semibold'
                : 'text-decoration-none px-4 py-2 rounded-pill fw-medium'
              }
              style={({isActive}) => isActive
                ? { backgroundColor: '#4F46E5', color: '#fff', position: 'relative' }
                : { color: sub, backgroundColor: 'transparent', position: 'relative' }
              }
            >
              {label}
              {path === 'orders' && pendingCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '8px',
                  backgroundColor: '#E50010', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: '900', lineHeight: 1
                }}>{pendingCount > 9 ? '9+' : pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="d-flex align-items-center gap-3">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDark}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', border: `1px solid ${border}`, borderRadius: '10px', padding: '7px 14px', backgroundColor: darkMode ? '#334155' : '#F1F5F9', color: darkMode ? '#F1F5F9' : '#64748B', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? 'Light' : 'Dark'}
          </button>

          <div className="d-flex align-items-center gap-2">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=4F46E5&color=fff`} alt="Avatar" className="rounded-circle" width="34" height="34" />
            <div className="d-none d-lg-block">
              <span className="small fw-semibold d-block" style={{ color: text }}>{user?.name || 'Admin'}</span>
              <span className="small" style={{ color: '#4F46E5', fontSize: '11px' }}>Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn border-0 p-2 rounded-circle" style={{ color: '#94A3B8', backgroundColor: darkMode ? '#334155' : '#F1F5F9' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        {/* Pass darkMode as context via prop if child pages need it */}
        <div style={{ '--dm-card': darkMode ? '#1E293B' : '#fff', '--dm-border': darkMode ? '#334155' : '#F1F5F9', '--dm-text': text, '--dm-sub': sub }}>
          <Outlet context={{ darkMode }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
