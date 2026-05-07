import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/contact', formData);
            toast.success(data.message || "Message sent! We'll get back to you shortly.");
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        { icon: <Phone size={24} />, title: 'Call Us', detail: '+91 70120 56376', desc: 'Mon-Sat, 9AM to 6PM IST' },
        { icon: <Mail size={24} />, title: 'Email Us', detail: 'ahamedansarnasim@gmail.com', desc: 'Response within 24 hours' },
        { icon: <MapPin size={24} />, title: 'Visit Us', detail: 'Andheri East, Mumbai', desc: 'Plot 12, MIDC, MH 400069' },
    ];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', color: '#1a1a1a' }}>
            
            {/* Header Section */}
            <section style={{ backgroundColor: '#F8F8F8', padding: '100px 24px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#E50010', display: 'block', marginBottom: '16px' }}>Let's Connect</span>
                    <h1 style={{ fontWeight: '900', fontSize: '3rem', letterSpacing: '-2px', marginBottom: '16px' }}>Contact Graphpaper Wholesale.</h1>
                    <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Have a question about our bulk orders or shipping? Our team is here to help you scaling your business.</p>
                </div>
            </section>

            <section style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="row g-5">
                        
                        {/* Contact Form */}
                        <div className="col-lg-7">
                            <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '32px', padding: '48px', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                                <h2 style={{ fontWeight: '900', fontSize: '2rem', marginBottom: '32px', letterSpacing: '-1px' }}>Send us a message</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Full Name</label>
                                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Retail Partner" style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Email Address</label>
                                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Subject</label>
                                                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="How can we help?" style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'} />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div style={{ marginBottom: '32px' }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#888', marginBottom: '8px', letterSpacing: '0.5px' }}>Message Details</label>
                                                <textarea required rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your requirements or questions..." style={{ width: '100%', border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '14px 18px', outline: 'none', backgroundColor: '#F9F9F9', resize: 'none', transition: '0.3s' }} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#F0F0F0'}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                                        {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="col-lg-5">
                            <div style={{ padding: '24px 0' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                                    {contactMethods.map((method, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '20px', backgroundColor: '#FEE2E2', color: '#E50010', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>{method.title}</h4>
                                                <div style={{ fontWeight: '900', fontSize: '20px', marginBottom: '4px', letterSpacing: '-0.5px' }}>{method.detail}</div>
                                                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{method.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '64px', borderTop: '1px solid #eee', paddingTop: '48px' }}>
                                    <h4 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '24px' }}>Follow Us</h4>
                                    <div className="d-flex align-items-center gap-3">
                                        <a href="#" style={{ textDecoration: 'none', color: '#000', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E50010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram <ChevronRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section style={{ height: '500px', width: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: '#eee' }}>
                    {/* Embedded Map (Placeholder Image + Frame) */}
                    <iframe 
                        title="location"
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0" 
                        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Andheri%20East,%20Mumbai,%20Maharashtra+(Graphpaper%20Wholesale)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }}
                    ></iframe>
                </div>
            </section>

        </div>
    );
};

export default Contact;
