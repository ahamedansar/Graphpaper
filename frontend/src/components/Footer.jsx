import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const shopLinks = [
        { label: 'Men', path: '/products?gender=Men' },
        { label: 'Women', path: '/products?gender=Women' },
        { label: 'Kids', path: '/products?gender=Kids' },
    ];

    const supportLinks = [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Feedback', path: '/feedback' },
        { label: 'My Orders', path: '/orders' },
    ];

    return (
        <footer style={{ backgroundColor: '#0a0a0a', color: '#fff', paddingTop: '64px', borderTop: '4px solid #E50010' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div className="row g-5">
                    {/* Brand Info */}
                    <div className="col-lg-4">
                        <Link to="/home" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
                            <span style={{ fontWeight: '900', fontSize: '2rem', letterSpacing: '-1.5px', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
                                Graphpaper<span style={{ color: '#E50010' }}>.</span>
                            </span>
                        </Link>
                        <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.8', maxWidth: '320px', marginBottom: '32px' }}>
                            Graphpaper is India's leading B2B wholesale platform for premium apparel. We bridge the gap between quality manufacturing and retail excellence.
                        </p>
                        <div className="d-flex align-items-center gap-3">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#E50010'} onMouseLeave={e => e.target.style.backgroundColor = '#1a1a1a'}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                            <a href="https://wa.me/917012056376" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: '0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#25D366'} onMouseLeave={e => e.target.style.backgroundColor = '#1a1a1a'}>
                                <Send size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="col-lg-2 col-md-4">
                        <h5 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Shop</h5>
                        <ul className="list-unstyled">
                            {shopLinks.map(link => (
                                <li key={link.label} style={{ marginBottom: '12px' }}>
                                    <Link to={link.path} style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: '0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#888'}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="col-lg-2 col-md-4">
                        <h5 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Support</h5>
                        <ul className="list-unstyled">
                            {supportLinks.map(link => (
                                <li key={link.label} style={{ marginBottom: '12px' }}>
                                    <Link to={link.path} style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: '0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#888'}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4 col-md-4">
                        <h5 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Get In Touch</h5>
                        <ul className="list-unstyled">
                            <li className="d-flex align-items-start gap-3" style={{ marginBottom: '20px' }}>
                                <div style={{ color: '#E50010', marginTop: '3px' }}><MapPin size={18} /></div>
                                <span style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                                    Graphpaper Textiles Plot 12, MIDC, Andheri East, Mumbai, Maharashtra 400069
                                </span>
                            </li>
                            <li className="d-flex align-items-center gap-3" style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#E50010' }}><Phone size={18} /></div>
                                <span style={{ color: '#888', fontSize: '14px' }}>+91 70120 56376</span>
                            </li>
                            <li className="d-flex align-items-center gap-3" style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#E50010' }}><Mail size={18} /></div>
                                <span style={{ color: '#888', fontSize: '14px' }}>ahamedansarnasim@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ marginTop: '64px', paddingBottom: '32px', borderTop: '1px solid #1a1a1a', paddingTop: '32px' }} className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-center text-md-start">
                    <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
                        &copy; {currentYear} Graphpaper Wholesale. All rights reserved. 
                    </p>
                    <div className="d-flex align-items-center gap-4">
                        <a href="#" style={{ color: '#555', textDecoration: 'none', fontSize: '13px' }}>Privacy Policy</a>
                        <a href="#" style={{ color: '#555', textDecoration: 'none', fontSize: '13px' }}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
