import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Users, Award, Package, Globe, CheckCircle } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Retail Partners', value: '5,000+', icon: <Users size={24} /> },
    { label: 'Products Delivered', value: '1M+', icon: <Truck size={24} /> },
    { label: 'Manufacturing Units', value: '12', icon: <Package size={24} /> },
    { label: 'Countries Reached', value: '5', icon: <Globe size={24} /> },
  ];

  const coreValues = [
    { title: 'Quality First', desc: 'Every thread and fabric is tested for high-durability and premium feel. We don\'t settle for "good enough".' },
    { title: 'Wholesale Excellence', desc: 'Optimized logistics and transparent pricing for retailers of all sizes. Minimum order of 10 units per size.' },
    { title: 'Innovation in Textiles', desc: 'We utilize the latest GSM-controlled weaving technology to ensure consistent quality across bulk orders.' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1a1a1a' }}>
      
      {/* Hero Section */}
      <section style={{ backgroundColor: '#0a0a0a', color: '#fff', padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #E5001015 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', backgroundColor: '#E50010', color: '#fff', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px' }}>
            Our Story
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '24px' }}>
            The Architecture of<br />
            <span style={{ color: '#E50010' }}>Quality Wholesale</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#888', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Founded by Ahamed Ansar from Kasaragod, Kerala — Graphpaper set out to redefine the B2B textile landscape. With our manufacturing rooted in Tirupur, Tamil Nadu, we combine industrial precision with modern design.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: '#E50010', marginBottom: '16px', display: 'inline-block' }}>{stat.icon}</div>
              <div style={{ fontWeight: '900', fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: '#888', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div style={{ backgroundColor: '#F8F8F8', borderRadius: '32px', padding: '48px', position: 'relative' }}>
                <h2 style={{ fontWeight: '900', fontSize: '2.25rem', marginBottom: '24px', letterSpacing: '-1px' }}>Tirupur Manufacturing. Kerala Roots. National Reach.</h2>
                <p style={{ color: '#444', fontSize: '16px', lineHeight: '1.8', marginBottom: '32px' }}>
                  At Graphpaper, we focus on the "Grid" — the foundation of every high-GSM fabric. Our Tirupur, Tamil Nadu manufacturing unit is strictly quality-controlled to ensure that the batch you receive today is exactly like the batch you receive a year from now. Managed by Ahamed Ansar from our head office in Kasaragod, Kerala.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#16a34a" /> <span style={{ fontWeight: '600' }}>ISO 9001:2015 Certified Manufacturing</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#16a34a" /> <span style={{ fontWeight: '600' }}>Strict Lab-Tested GSM Controls</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#16a34a" /> <span style={{ fontWeight: '600' }}>Sustainable Packaging & Logistics</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {coreValues.map((val, i) => (
                  <div key={i} style={{ border: '1px solid #eee', borderRadius: '24px', padding: '32px', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#E50010'}>
                    <h4 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '12px' }}>{val.title}</h4>
                    <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#F8F8F8', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontWeight: '900', fontSize: '2.5rem', marginBottom: '24px', letterSpacing: '-1px' }}>Grow Your Retail Brand With Us.</h2>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>Apply for a wholesale partnership and get access to our exclusive pricing tiers and premium catalogs.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/products" style={{ backgroundColor: '#E50010', color: '#fff', padding: '16px 40px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>Browse Catalog</Link>
            <Link to="/contact" style={{ backgroundColor: '#fff', color: '#000', border: '1.5px solid #eee', padding: '16px 40px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
