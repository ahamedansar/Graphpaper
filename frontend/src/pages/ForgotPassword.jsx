import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#FAFAFA', fontFamily: "'Inter', sans-serif", padding: '24px'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #f0f4ff, transparent)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>

        {/* Back link */}
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#888', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
          <ArrowLeft size={15} /> Back to Login
        </Link>

        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>

          {sent ? (
            /* Success State */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={36} color="#16a34a" />
              </div>
              <h2 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '12px', letterSpacing: '-0.5px' }}>Check your inbox!</h2>
              <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '8px' }}>
                We've sent a password reset link to
              </p>
              <p style={{ color: '#1a1a1a', fontWeight: '800', fontSize: '15px', marginBottom: '28px' }}>{email}</p>
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6', marginBottom: '32px' }}>
                The link expires in <strong>1 hour</strong>. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                style={{ width: '100%', padding: '14px', backgroundColor: '#F5F5F5', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', color: '#555', cursor: 'pointer' }}
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Logo */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #E50010, #ff4d4d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Mail size={26} color="#fff" />
                </div>
                <h1 style={{ fontWeight: '900', fontSize: '1.6rem', color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Forgot Password?</h1>
                <p style={{ color: '#888', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      style={{
                        width: '100%', paddingLeft: '42px', paddingRight: '16px',
                        paddingTop: '14px', paddingBottom: '14px',
                        border: '1.5px solid #F0F0F0', borderRadius: '12px',
                        fontSize: '15px', outline: 'none', backgroundColor: '#F9F9F9',
                        fontFamily: "'Inter', sans-serif", transition: '0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = '#1a1a1a'}
                      onBlur={e => e.target.style.borderColor = '#F0F0F0'}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '15px',
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #E50010, #ff4d4d)',
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: '0.2s'
                  }}
                >
                  {loading ? (
                    <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Reset Link</>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <span style={{ color: '#aaa', fontSize: '13px' }}>Remember your password? </span>
                <Link to="/login" style={{ color: '#E50010', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>Sign In</Link>
              </div>
            </>
          )}
        </div>

        {/* Graphpaper branding */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#CBD5E1' }}>
          © {new Date().getFullYear()} Graphpaper<span style={{ color: '#E50010' }}>.</span> All rights reserved.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ForgotPassword;
