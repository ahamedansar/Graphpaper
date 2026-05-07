import React, { useState } from 'react';
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', rating: 5, category: 'General', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Product Quality', 'Delivery', 'Customer Service', 'Pricing', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/feedback', formData);
      setSubmitted(true);
      toast.success('Thank you for your valuable feedback!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#DCFCE7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontWeight: '900', fontSize: '2rem', marginBottom: '16px', letterSpacing: '-1px' }}>Feedback Received!</h2>
          <p style={{ color: '#888', fontSize: '18px', marginBottom: '32px' }}>Your feedback helps us build a better Graphpaper. Our team will review your comments shortly.</p>
          <button onClick={() => setSubmitted(false)} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: '700' }}>Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1a1a1a', padding: '80px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: '100px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px' }}>
            <MessageSquare size={16} /> User Feedback
          </div>
          <h1 style={{ fontWeight: '900', fontSize: '3rem', letterSpacing: '-2px', marginBottom: '16px' }}>Help Us Improve.</h1>
          <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>We value every partnership. Tell us what we're doing right and where we can grow.</p>
        </div>

        {/* Form Container */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              <div className="col-md-6">
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Your Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                </div>
              </div>

              <div className="col-md-6">
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@company.com" style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                </div>
              </div>

              <div className="col-md-12">
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '12px', letterSpacing: '0.5px' }}>Overall Rating</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button key={num} type="button" onClick={() => setFormData({ ...formData, rating: num })} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', transition: '0.2s', transform: formData.rating >= num ? 'scale(1.1)' : 'scale(1)' }}>
                        <Star size={32} fill={formData.rating >= num ? '#E50010' : 'none'} color={formData.rating >= num ? '#E50010' : '#DDD'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Feedback Category</label>
                  <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', cursor: 'pointer' }}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="col-md-12">
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Your Comments</label>
                  <textarea required rows={6} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your experience..." style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', resize: 'none', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'}></textarea>
                </div>
              </div>

            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              style={{ 
                width: '100%', 
                backgroundColor: '#000', 
                color: '#fff', 
                border: 'none', 
                padding: '18px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                fontSize: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Sending...' : 'Send Feedback'} <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Feedback;
