import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Bike } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DeliveryLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', color: '#1a1a1a', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #F0F0F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: '900', fontSize: '15px', letterSpacing: '-0.5px', color: '#1a1a1a', lineHeight: 1 }}>Graphpaper</div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1, marginTop: '2px' }}>Delivery Portal</div>
            </div>
          </div>

          {/* Center: Nav */}
          <nav style={{ display: 'flex', gap: '4px' }}>
            <NavLink to="/delivery" end
              style={({ isActive }) => ({
                textDecoration: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                backgroundColor: isActive ? '#d97706' : 'transparent',
                color: isActive ? '#fff' : '#888',
              })}
            >
              My Deliveries
            </NavLink>
          </nav>

          {/* Right: User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Delivery')}&background=d97706&color=fff`} alt="avatar" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
            <div style={{ display: 'none' }} className="d-lg-block">
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: '#d97706', fontWeight: '600' }}>Delivery Boy</div>
            </div>
            <button onClick={handleLogout} style={{ background: '#F5F5F5', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryLayout;
