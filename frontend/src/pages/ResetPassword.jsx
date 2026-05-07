import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link is invalid or expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', paddingLeft: '42px', paddingRight: '42px',
    paddingTop: '14px', paddingBottom: '14px',
    border: '1.5px solid #F0F0F0', borderRadius: '12px',
    fontSize: '15px', outline: 'none', backgroundColor: '#F9F9F9',
    fontFamily: "'Inter', sans-serif", transition: '0.2s'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#FAFAFA', fontFamily: "'Inter', sans-serif", padding: '24px'
    }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #f0f4ff, transparent)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>

        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#888', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
          <ArrowLeft size={15} /> Back to Login
        </Link>

        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>

          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={36} color="#16a34a" />
              </div>
              <h2 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '12px' }}>Password Reset!</h2>
              <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px' }}>
                Your password has been updated successfully. Redirecting you to login...
              </p>
              <Link to="/login" style={{ display: 'inline-block', backgroundColor: '#16a34a', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '14px' }}>
                Go to Login →
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Lock size={26} color="#fff" />
                </div>
                <h1 style={{ fontWeight: '900', fontSize: '1.6rem', color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Create New Password</h1>
                <p style={{ color: '#888', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#4F46E5'}
                      onBlur={e => e.target.style.borderColor = '#F0F0F0'}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  {password.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= strength ? strengthColor[strength] : '#F0F0F0', transition: '0.3s' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: strengthColor[strength] }}>
                        {strengthLabel[strength]} {strength === 4 && '✓'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#aaa', marginLeft: '8px' }}>
                        {strength < 3 ? 'Add uppercase, numbers & symbols' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      style={{ ...inputStyle, borderColor: confirmPassword ? (passwordsMatch ? '#16a34a' : '#E50010') : '#F0F0F0' }}
                      onFocus={e => e.target.style.borderColor = confirmPassword ? (passwordsMatch ? '#16a34a' : '#E50010') : '#4F46E5'}
                      onBlur={e => e.target.style.borderColor = confirmPassword ? (passwordsMatch ? '#16a34a' : '#E50010') : '#F0F0F0'}
                    />
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

                <button
                  type="submit"
                  disabled={loading || !passwordsMatch || strength < 2}
                  style={{
                    width: '100%', padding: '15px',
                    background: (loading || !passwordsMatch || strength < 2) ? '#E0E0E0' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: (loading || !passwordsMatch || strength < 2) ? '#aaa' : '#fff',
                    border: 'none', borderRadius: '12px',
                    fontWeight: '800', fontSize: '15px',
                    cursor: (loading || !passwordsMatch || strength < 2) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: '0.2s'
                  }}
                >
                  {loading ? (
                    <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Resetting...</>
                  ) : (
                    <><CheckCircle size={16} /> Reset Password</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResetPassword;
