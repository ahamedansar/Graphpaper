import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn, Layers, Bike, Eye, EyeOff, Phone, Mail } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleHint = searchParams.get('role'); // 'admin', 'delivery', or null (client)

  const portalInfo = {
    admin:    { label: 'Admin Portal',    color: '#4F46E5', lightBg: '#EEF2FF', icon: <Layers size={16} /> },
    delivery: { label: 'Delivery Portal', color: '#d97706', lightBg: '#fffbeb', icon: <Bike size={16} /> },
  };
  const portal = roleHint ? portalInfo[roleHint] : null;

  const getRedirectPath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'delivery_boy') return '/delivery';
    return '/home';
  };

  useEffect(() => {
    if (user) navigate(getRedirectPath(user.role));
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (method === 'email') {
        const loggedInUser = await login(email, password);
        toast.success('Successfully logged in!');
        navigate(getRedirectPath(loggedInUser?.role || 'user'));
      } else {
        if (!otpSent) {
          // Send OTP
          const res = await api.post('/auth/send-otp', { phone });
          toast.success(res.data.message);
          if (res.data.otp) toast.info(`(Dev Mode) OTP: ${res.data.otp}`, { autoClose: false });
          setOtpSent(true);
        } else {
          // Verify OTP
          const res = await api.post('/auth/verify-otp', { phone, otp });
          localStorage.setItem('userInfo', JSON.stringify(res.data));
          setUser(res.data);
          toast.success('Successfully logged in via OTP!');
          navigate(getRedirectPath(res.data.role || 'user'));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const accentColor = portal?.color || '#E50010';
  const gradientBg  = portal
    ? `linear-gradient(135deg, ${portal.color}, ${portal.color}cc)`
    : 'linear-gradient(135deg, #E50010, #ff4d4d)';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', fontFamily: "'Inter', sans-serif", padding: '24px' }}>

      {/* Subtle background gradient */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #f0f4ff, transparent)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        <div style={{ backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>

          {/* Header */}
          <div style={{ padding: '40px 40px 24px', textAlign: 'center', borderBottom: '1px solid #F8F8F8' }}>
            {portal && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '100px', backgroundColor: portal.lightBg, color: portal.color, fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                {portal.icon} {portal.label}
              </div>
            )}
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: gradientBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <LogIn size={24} color="#fff" />
            </div>
            <h1 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Welcome Back</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Sign in to your {portal ? portal.label.toLowerCase() : 'wholesale account'}.
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '32px 40px 40px' }}>
            {/* Login Method Toggle */}
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
              <button type="button" onClick={() => { setMethod('email'); setOtpSent(false); }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: method === 'email' ? '#fff' : 'transparent', color: method === 'email' ? accentColor : '#888', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: method === 'email' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: '0.2s' }}>
                <Mail size={16} /> Email
              </button>
              <button type="button" onClick={() => { setMethod('phone'); }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: method === 'phone' ? '#fff' : 'transparent', color: method === 'phone' ? accentColor : '#888', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: method === 'phone' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: '0.2s' }}>
                <Phone size={16} /> Phone OTP
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {method === 'email' ? (
                <>
                  {/* Email */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>Email Address</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #F0F0F0', borderRadius: '12px', fontSize: '15px', outline: 'none', backgroundColor: '#F9F9F9', fontFamily: "'Inter', sans-serif", transition: '0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                  </div>
                  {/* Password */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888' }}>Password</label>
                      {!portal && <Link to="/forgot-password" style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textDecoration: 'none' }}>Forgot Password?</Link>}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '13px 44px 13px 16px', border: '1.5px solid #F0F0F0', borderRadius: '12px', fontSize: '15px', outline: 'none', backgroundColor: '#F9F9F9', fontFamily: "'Inter', sans-serif", transition: '0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Phone */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>Phone Number</label>
                    <div style={{ display: 'flex', border: '1.5px solid #F0F0F0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F9F9F9', transition: '0.2s' }} onFocus={e => e.currentTarget.style.borderColor = accentColor} onBlur={e => e.currentTarget.style.borderColor = '#F0F0F0'}>
                      <span style={{ padding: '13px 0 13px 16px', color: '#888', fontWeight: '700', fontSize: '15px' }}>+91</span>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} disabled={otpSent} placeholder="9876543210" maxLength="10" style={{ flex: 1, padding: '13px 16px 13px 8px', border: 'none', fontSize: '15px', outline: 'none', backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif", fontWeight: '700' }} />
                    </div>
                  </div>
                  {/* OTP */}
                  {otpSent && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888' }}>Enter 6-digit OTP</label>
                        <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: accentColor, fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0 }}>Change Number</button>
                      </div>
                      <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength="6" style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #F0F0F0', borderRadius: '12px', fontSize: '18px', outline: 'none', backgroundColor: '#F9F9F9', fontFamily: "monospace", letterSpacing: '4px', fontWeight: '700', textAlign: 'center', transition: '0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                    </div>
                  )}
                </>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px', marginTop: '20px',
                  background: loading ? '#ccc' : gradientBg,
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontWeight: '800', fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: '0.2s'
                }}
              >
                {loading ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Please wait...</>
                ) : (
                  method === 'phone' && !otpSent ? 'Get OTP' : 'Sign In'
                )}
              </button>
            </form>

            {/* Client: Sign Up link */}
            {!portal && (
              <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F5F5F5' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>New to Graphpaper? </span>
                <Link to="/register" style={{ color: '#E50010', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>Apply for an account</Link>
              </div>
            )}

            {/* Admin / Delivery fixed credentials note */}
            {portal && (
              <div style={{ marginTop: '20px', padding: '14px 16px', backgroundColor: portal.lightBg, borderRadius: '12px', textAlign: 'center', fontSize: '13px' }}>
                <span style={{ color: portal.color, fontWeight: '700' }}>🔐 Fixed credentials only.</span><br />
                <span style={{ color: '#888', fontSize: '12px' }}>
                  {roleHint === 'admin' ? 'admin@gmail.com / password123' : 'delivery@gmail.com / password123'}
                </span>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link to="/" style={{ color: '#CBD5E1', fontSize: '12px', textDecoration: 'none' }}>← Back to portal selection</Link>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#CBD5E1' }}>
          © {new Date().getFullYear()} Graphpaper<span style={{ color: '#E50010' }}>.</span> All rights reserved.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
