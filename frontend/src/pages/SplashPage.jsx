import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Layers, Bike, ArrowRight } from 'lucide-react';

const roles = [
  {
    id: 'client',
    icon: <ShoppingBag size={32} />,
    title: 'Client',
    subtitle: 'Browse & order wholesale products. Login or create an account.',
    path: '/login',
    bg: 'linear-gradient(135deg, #E50010 0%, #FF4D4D 100%)',
    accent: '#E50010',
    lightBg: '#fff5f5',
  },
  {
    id: 'admin',
    icon: <Layers size={32} />,
    title: 'Admin',
    subtitle: 'Manage products, orders & deliveries. One fixed login.',
    path: '/login?role=admin',
    bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    accent: '#4F46E5',
    lightBg: '#eef2ff',
  },
  {
    id: 'delivery',
    icon: <Bike size={32} />,
    title: 'Delivery Boy',
    subtitle: 'Track & update assigned deliveries. One fixed login.',
    path: '/login?role=delivery',
    bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    accent: '#d97706',
    lightBg: '#fffbeb',
  },
];

const SplashPage = () => {
  const navigate = useNavigate();
  const [logoVisible, setLogoVisible] = useState(false);
  const [rolesVisible, setRolesVisible] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true), 100);
    const t2 = setTimeout(() => setRolesVisible(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* Top subtle pattern */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #f0f4ff 0%, transparent 70%)' }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '960px', width: '100%' }}>

        {/* Logo Animation */}
        <div
          style={{
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            opacity: logoVisible ? 1 : 0,
            transform: logoVisible ? 'translateY(0)' : 'translateY(-20px)',
            marginBottom: '3.5rem',
          }}
        >
          {/* Decorative line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '1.5rem' }}>
            <div style={{ height: '1px', width: '60px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '600' }}>Wholesale Portal</span>
            <div style={{ height: '1px', width: '60px', background: '#E2E8F0' }} />
          </div>

          {/* Brand Name */}
          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: '900',
              letterSpacing: '-4px',
              lineHeight: 1,
              color: '#E50010',
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Graphpaper
          </h1>

          <p style={{ color: '#94A3B8', marginTop: '1rem', fontSize: '15px', fontWeight: '400' }}>
            Who are you signing in as today?
          </p>
        </div>

        {/* Role Selection Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            opacity: rolesVisible ? 1 : 0,
            transform: rolesVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          {roles.map((role) => {
            const isHovered = hoveredRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => navigate(role.path)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `2px solid ${isHovered ? role.accent : '#E2E8F0'}`,
                  borderRadius: '20px',
                  padding: '2rem 1.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 20px 40px ${role.accent}22` : '0 2px 8px rgba(0,0,0,0.06)',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background tint on hover */}
                <div style={{ position: 'absolute', inset: 0, background: isHovered ? role.lightBg : 'transparent', transition: 'background 0.25s', borderRadius: '18px', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: isHovered ? role.bg : '#F1F5F9',
                      color: isHovered ? '#fff' : role.accent,
                      marginBottom: '1.25rem',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {role.icon}
                  </div>

                  <h3 style={{ fontWeight: '800', fontSize: '1.3rem', color: '#1E293B', margin: '0 0 0.4rem' }}>
                    {role.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
                    {role.subtitle}
                  </p>

                  {/* Arrow CTA */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: isHovered ? role.accent : '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'color 0.2s',
                    }}
                  >
                    Continue <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: '3rem',
            fontSize: '12px',
            color: '#CBD5E1',
            transition: 'opacity 0.8s ease',
            opacity: rolesVisible ? 1 : 0,
          }}
        >
          © {new Date().getFullYear()} Graphpaper. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
