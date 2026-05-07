import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, Eye, EyeOff, Mail, User, Lock } from 'lucide-react';

const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#E50010', '#d97706', '#0284c7', '#16a34a'];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const strength = getStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: '100%', paddingLeft: '42px', paddingRight: '16px',
    paddingTop: '13px', paddingBottom: '13px',
    border: '1.5px solid #F0F0F0', borderRadius: '12px',
    fontSize: '15px', outline: 'none', backgroundColor: '#F9F9F9',
    fontFamily: "'Inter', sans-serif", transition: '0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', fontFamily: "'Inter', sans-serif", padding: '24px' }}>

      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #fff0f0, transparent)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>

        <div style={{ backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>

          {/* Header */}
          <div style={{ padding: '40px 40px 24px', textAlign: 'center', borderBottom: '1px solid #F8F8F8' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #E50010, #ff4d4d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UserPlus size={24} color="#fff" />
            </div>
            <h1 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Become a Retailer</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Apply for wholesale access to Graphpaper's catalog.</p>
          </div>

          {/* Form */}
          <div style={{ padding: '32px 40px 40px' }}>
            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>Full Name / Business Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe or Business Name" style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = '#E50010'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = '#E50010'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                    style={{ ...fieldStyle, paddingRight: '42px' }}
                    onFocus={e => e.target.style.borderColor = '#E50010'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength Meter */}
                {password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= strength ? strengthColor[strength] : '#F0F0F0', transition: '0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                    {strength < 3 && <span style={{ fontSize: '11px', color: '#aaa', marginLeft: '8px' }}>Add uppercase, numbers & symbols</span>}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px', marginTop: '16px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input type={showConfirm ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat your password"
                    style={{ ...fieldStyle, paddingRight: '42px', borderColor: confirmPassword ? (passwordsMatch ? '#16a34a' : '#E50010') : '#F0F0F0' }}
                    onFocus={e => e.target.style.borderColor = confirmPassword ? (passwordsMatch ? '#16a34a' : '#E50010') : '#E50010'}
                    onBlur={e => e.target.style.borderColor = confirmPassword ? (passwordsMatch ? '#16a34a' : '#E50010') : '#F0F0F0'} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && (
                  <p style={{ fontSize: '12px', marginTop: '6px', color: passwordsMatch ? '#16a34a' : '#E50010', fontWeight: '700' }}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #E50010, #ff4d4d)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: '0.2s'
                }}
              >
                {loading ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating Account...</>
                ) : <><UserPlus size={17} /> Create Account</>}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F5F5F5' }}>
              <span style={{ color: '#888', fontSize: '13px' }}>Already registered? </span>
              <Link to="/login" style={{ color: '#E50010', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>Sign In</Link>
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

export default Register;
