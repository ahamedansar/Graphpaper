import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowRight, Package, ShieldCheck, Truck, ShoppingBag, Star, Zap, Percent, ChevronRight } from 'lucide-react';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products').then(({ data }) => setFeatured(data.slice(0, 8))).catch(() => {});
  }, []);

  const categories = [
    { name: 'Men', tag: 'gender=Men', img: '/images/tshirt_product_1774987745271.png', desc: 'Premium wholesale menswear' },
    { name: 'Women', tag: 'gender=Women', img: '/images/tracksuit_product_1774987761220.png', desc: 'Stylish wholesale women\'s collection' },
    { name: 'Kids', tag: 'gender=Kids', img: '/images/tshirt_1.png', desc: 'Durable wholesale kids apparel' },
  ];

  const subCats = [
    { name: 'T-Shirts', gender: 'Men' },
    { name: 'Tracksuits', gender: 'Women' },
    { name: 'Sweatshirts', gender: 'Men' },
    { name: 'Hoodies', gender: 'Men' },
    { name: 'Jackets', gender: 'Women' },
  ];

  const perks = [
    { icon: <Package size={28} />, title: 'Wholesale Pricing', desc: 'Minimum 10 units per size with bulk discounts' },
    { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'Tracked shipping with real-time updates' },
    { icon: <ShieldCheck size={28} />, title: 'Quality Assured', desc: 'Premium GSM fabric, built to last' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* DRESS HOME / HERO ADS SECTION */}
      <section style={{ backgroundColor: '#0a0a0a', padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, #E5001010 0%, transparent 50%), radial-gradient(circle at 10% 80%, #4F46E508 0%, transparent 40%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', position: 'relative', zIndex: 1 }}>
          
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#E50010', color: '#fff', borderRadius: '100px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '2px' }}>
              <Zap size={14} fill="currentColor" /> Active Wholesale Tiers
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', letterSpacing: '-3px', lineHeight: 1.05, marginBottom: '24px' }}>
               Engineered<br />for the <span style={{ color: '#E50010' }}>Retail</span><br />Standard.
            </h1>
            <p style={{ color: '#888', fontSize: '20px', maxWidth: '480px', marginBottom: '40px', lineHeight: '1.6' }}>
               Premium blank t-shirts, tracksuits & winter hoodies tailored for volume resellers. Global quality, local prices.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/products" className="hover-lift" style={{ backgroundColor: '#fff', color: '#000', padding: '18px 48px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', transition: '0.2s', boxShadow: '0 10px 30px rgba(255,255,255,0.1)' }}>Shop Now</Link>
              <Link to="/register" style={{ backgroundColor: 'transparent', color: '#fff', border: '1.5px solid #333', padding: '18px 48px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}>Become a Partner</Link>
            </div>
          </div>

          <div className="slide-in-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="hover-glow" style={{ backgroundColor: '#1a1a1a', borderRadius: '32px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '300px', backgroundImage: 'url("/images/tshirt_product_1774987745271.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', transition: '0.3s transform' }}>
               <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ color: '#fff', fontWeight: '800', fontSize: '1.25rem', marginBottom: '8px' }}>T-Shirt Pro Edition</h3>
                  <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>240GSM Cotton Blanks</p>
                  <p style={{ color: '#E50010', fontSize: '18px', fontWeight: '900', margin: '8px 0 0' }}>Bulk: ₹125/pc</p>
               </div>
            </div>
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
               <div className="hover-glow" style={{ backgroundColor: '#E50010', borderRadius: '32px', padding: '32px', position: 'relative', transition: '0.3s transform' }}>
                  <Percent style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.2 }} size={64} color="#fff" />
                  <h3 style={{ color: '#fff', fontWeight: '800', fontSize: '1.5rem', marginBottom: '8px' }}>Winter<br />Resale.</h3>
                  <Link to="/products?category=Hoodies" style={{ color: '#fff', fontWeight: '700', fontSize: '13px', textDecoration: 'none', borderBottom: '1px solid #fff' }}>Browse Hoodies</Link>
               </div>
               <div className="hover-glow" style={{ backgroundColor: '#111', borderRadius: '32px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s transform' }}>
                  <img className="zoom-in" src="/images/tracksuit_product_1774987761220.png" alt="ad" style={{ maxHeight: '100px', width: 'auto' }} />
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* PERKS */}
      <section style={{ backgroundColor: '#fff', padding: '64px 24px', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px' }}>
          {perks.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E50010', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>{p.icon}</div>
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>{p.title}</h4>
                <p style={{ fontSize: '13px', color: '#888', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BROWSE CATEGORIES */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontWeight: '900', fontSize: '2.5rem', letterSpacing: '-1.5px', marginBottom: '12px' }}>Browse Categories</h2>
            <p style={{ color: '#888', fontSize: '18px', margin: 0 }}>Wholesale catalogs sorted by gender and type.</p>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#000', fontWeight: '800', fontSize: '14px', padding: '12px 24px', border: '1.5px solid #eee', borderRadius: '12px' }}>View All Collections</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {categories.map(cat => (
            <Link key={cat.name} to={`/products?gender=${cat.gender || cat.name}`} className="hover-lift" style={{ textDecoration: 'none', borderRadius: '32px', overflow: 'hidden', height: '400px', position: 'relative', display: 'block', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
              <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s transform cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseEnter={e => e.target.style.transform = 'scale(1.15)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' }}>
                <h3 style={{ color: '#fff', fontWeight: '900', fontSize: '2rem', marginBottom: '8px' }}>{cat.name} Wholesale</h3>
                <p style={{ color: '#ccc', fontSize: '15px' }}>{cat.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                   <span style={{ color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>Browse Now <ArrowRight size={16} /></span>
                   <div className="glass-card" style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '11px', color: '#fff', fontWeight: '800' }}>10+ Collections</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DISCOVER PRODUCTS SECTION */}
      <section style={{ backgroundColor: '#F8F8F8', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontWeight: '900', fontSize: '3rem', letterSpacing: '-2.5px', marginBottom: '16px' }}>Discover New Arrivals</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {subCats.map(sc => (
                <Link key={`${sc.gender}-${sc.name}`} to={`/products?gender=${sc.gender}&category=${sc.name}`} style={{ padding: '10px 24px', borderRadius: '100px', backgroundColor: '#fff', color: '#666', border: '1px solid #eee', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }} onMouseEnter={e => { e.target.style.backgroundColor = '#000'; e.target.style.color = '#fff'; }} onMouseLeave={e => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#666'; }}>
                  {sc.gender} {sc.name}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
            {featured.map(product => (
              <Link key={product._id} to={`/products/${product._id}`} style={{ textDecoration: 'none', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', transition: '0.3s transform, 0.3s box-shadow', border: '1px solid #f0f0f0' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ height: '280px', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '100px', textTransform: 'uppercase' }}>{product.category}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FACC15' }}><Star size={14} fill="currentColor" /><span style={{ color: '#888', fontSize: '12px', fontWeight: '700' }}>4.8</span></div>
                  </div>
                  <h4 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1a1a1a', margin: '0 0 12px', height: '48px', overflow: 'hidden' }}>{product.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: '#aaa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Bulk Rate</span>
                      <span style={{ fontWeight: '900', fontSize: '1.25rem', color: '#E50010' }}>₹{product.price.toFixed(2)}</span>
                    </div>
                    <div style={{ border: '1.5px solid #000', borderRadius: '12px', padding: '8px', color: '#000' }}>
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
             <Link to="/products" style={{ backgroundColor: '#000', color: '#fff', padding: '18px 48px', borderRadius: '12px', fontWeight: '800', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>See More Products <ChevronRight size={20} /></Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
