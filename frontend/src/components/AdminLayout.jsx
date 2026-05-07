import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Layers } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../index.css';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#F0F4FF', color: '#1E293B', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navigation Bar */}
      <header className="d-flex justify-content-between align-items-center px-5 py-3" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        
        {/* Left: Branding */}
        <div className="d-flex align-items-center gap-2">
           <div className="rounded-2 p-2" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <Layers size={22} color="#fff" />
           </div>
           <span className="fw-bold" style={{ fontSize: '16px', color: '#1E293B', letterSpacing: '-0.5px' }}>Graphpaper <span style={{ color: '#4F46E5' }}>Admin</span></span>
        </div>

        {/* Center: Navigation Pills */}
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
                : { color: '#64748B', backgroundColor: 'transparent', position: 'relative' }
              }
            >
              {label}
              {/* Pending badge on Orders */}
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

        {/* Right: User Profile & Logout */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
             <img src="https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff" alt="Avatar" className="rounded-circle" width="34" height="34" />
             <div className="d-none d-lg-block">
               <span className="small fw-semibold d-block" style={{ color: '#1E293B' }}>{user?.name || 'Admin'}</span>
               <span className="small" style={{ color: '#4F46E5', fontSize: '11px' }}>Administrator</span>
             </div>
          </div>
          <button onClick={handleLogout} className="btn border-0 p-2 rounded-circle" style={{ color: '#94A3B8', backgroundColor: '#F1F5F9' }}>
             <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Rendered Here */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
