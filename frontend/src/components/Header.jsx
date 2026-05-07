import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User as UserIcon, LogOut, Menu, X, ChevronDown, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/products?search=${keyword}`);
    else navigate('/products');
    setKeyword('');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const shopCategories = [
    { gender: 'Men', path: '/products?gender=Men' },
    { gender: 'Women', path: '/products?gender=Women' },
    { gender: 'Kids', path: '/products?gender=Kids' },
  ];

  const subCategories = ['T-Shirts', 'Tracksuits', 'Sweatshirts', 'Hoodies', 'Jackets'];

  return (
    <>
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div className="d-flex align-items-center" style={{ height: '72px', gap: '32px' }}>

            {/* LEFT: Logo */}
            <Link to="/home" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontWeight: '900', fontSize: '1.75rem', letterSpacing: '-2px', color: '#000', fontFamily: "'Inter', sans-serif" }}>
                  Graphpaper<span style={{ color: '#E50010' }}>.</span>
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation */}
            <nav className="d-none d-lg-flex align-items-center" style={{ gap: '8px', flex: 1 }}>
              <Link to="/home" style={{ textDecoration: 'none', color: '#000', fontWeight: '600', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }} onMouseEnter={e => e.target.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Home</Link>
              
              {/* Shop Megamenu Trigger */}
              <div 
                style={{ position: 'relative' }} 
                onMouseEnter={() => setShopMenuOpen(true)} 
                onMouseLeave={() => setShopMenuOpen(false)}
              >
                <div 
                  onClick={() => setShopMenuOpen(!shopMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#000', fontWeight: '600', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', backgroundColor: shopMenuOpen ? '#f8f8f8' : 'transparent' }}
                >
                  Shop <ChevronDown size={14} style={{ transform: shopMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.3s transform' }} />
                </div>
                
                {shopMenuOpen && (
                  <div style={{ 
                    position: 'absolute', 
                    top: 'calc(100% + 5px)', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: '#fff', 
                    border: '1px solid #eee', 
                    borderRadius: '24px', 
                    padding: '40px', 
                    width: '800px', 
                    boxShadow: '0 32px 64px rgba(0,0,0,0.15)', 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '48px', 
                    zIndex: 10000 
                  }}>
                    {shopCategories.map(cat => (
                      <div key={cat.gender}>
                        <Link to={cat.path} onClick={() => setShopMenuOpen(false)} style={{ textDecoration: 'none', color: '#000', fontWeight: '800', fontSize: '16px', display: 'block', marginBottom: '16px', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
                          {cat.gender}
                        </Link>
                        <ul className="list-unstyled">
                          {subCategories.map(sub => (
                            <li key={sub} style={{ marginBottom: '10px' }}>
                              <Link to={`/products?gender=${cat.gender}&category=${sub}`} onClick={() => setShopMenuOpen(false)} style={{ textDecoration: 'none', color: '#666', fontSize: '14px', transition: '0.2s', fontWeight: '500' }} onMouseEnter={e => e.target.style.color = '#E50010'} onMouseLeave={e => e.target.style.color = '#666'}>
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/about" style={{ textDecoration: 'none', color: '#000', fontWeight: '600', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }} onMouseEnter={e => e.target.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>About</Link>
              <Link to="/contact" style={{ textDecoration: 'none', color: '#000', fontWeight: '600', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }} onMouseEnter={e => e.target.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Contact</Link>
              <Link to="/feedback" style={{ textDecoration: 'none', color: '#000', fontWeight: '600', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }} onMouseEnter={e => e.target.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Feedback</Link>
              
              {user && (
                <Link to="/orders" style={{ textDecoration: 'none', color: '#4F46E5', fontWeight: '700', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', backgroundColor: '#EEF2FF', marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={16} /> My Orders
                </Link>
              )}
            </nav>

            {/* RIGHT: Search + Icons */}
            <div className="d-flex align-items-center" style={{ gap: '12px', marginLeft: 'auto' }}>
              
              {/* Search */}
              <form onSubmit={submitHandler} className="d-none d-md-flex position-relative">
                <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search products..." style={{ border: '1.5px solid #F0F0F0', borderRadius: '12px', padding: '8px 36px 8px 16px', fontSize: '13px', width: '240px', outline: 'none', backgroundColor: '#F9F9F9' }} />
                <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: '#999' }}>
                  <Search size={16} />
                </button>
              </form>

              {/* Wishlist */}
              <Link to="/wishlist" style={{ textDecoration: 'none', color: '#000', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link to="/cart" style={{ textDecoration: 'none', color: '#000', padding: '10px', borderRadius: '12px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#E50010', color: '#fff', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(229, 0, 16, 0.3)' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User profile */}
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', border: 'none', borderRadius: '12px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                    <UserIcon size={16} />
                    <span className="d-none d-lg-inline">{user.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '12px', width: '220px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', zIndex: 1002 }}>
                      <div style={{ padding: '8px 12px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: '8px' }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{user.email}</div>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', textDecoration: 'none', color: '#1a1a1a', fontSize: '14px', borderRadius: '12px', fontWeight: '500' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <UserIcon size={16} /> My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', textDecoration: 'none', color: '#1a1a1a', fontSize: '14px', borderRadius: '12px', fontWeight: '500' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f8f8'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Package size={16} /> My Orders
                      </Link>
                      <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', background: 'none', color: '#E50010', fontSize: '14px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff5f5'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none', backgroundColor: '#000', color: '#fff', padding: '10px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px' }}>
                  Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button className="d-lg-none" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#000' }}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div style={{ position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 999, overflowY: 'auto', padding: '24px' }}>
            <div className="d-flex flex-column gap-1">
              <Link to="/home" onClick={() => setMobileOpen(false)} style={{ padding: '16px', fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#000', borderBottom: '1px solid #f0f0f0' }}>Home</Link>
              
              <div style={{ padding: '16px', fontSize: '18px', fontWeight: '700', color: '#000', borderBottom: '1px solid #f0f0f0' }}>Shop</div>
              <div style={{ paddingLeft: '32px' }}>
                {shopCategories.map(cat => (
                  <div key={cat.gender}>
                    <div style={{ fontWeight: '700', fontSize: '15px', padding: '12px 0', color: '#E50010' }}>{cat.gender}</div>
                    {subCategories.map(sub => (
                      <Link key={sub} to={`/products?gender=${cat.gender}&category=${sub}`} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '8px 0', color: '#666', textDecoration: 'none', fontSize: '14px' }}>
                        {sub}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              <Link to="/about" onClick={() => setMobileOpen(false)} style={{ padding: '16px', fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#000', borderBottom: '1px solid #f0f0f0' }}>About</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} style={{ padding: '16px', fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#000', borderBottom: '1px solid #f0f0f0' }}>Contact</Link>
              <Link to="/feedback" onClick={() => setMobileOpen(false)} style={{ padding: '16px', fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#000', borderBottom: '1px solid #f0f0f0' }}>Feedback</Link>
              {user && <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ padding: '16px', fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#1a1a1a', borderBottom: '1px solid #f0f0f0', display: 'block' }}>My Profile</Link>}
              {user && <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ padding: '16px', fontSize: '18px', fontWeight: '700', textDecoration: 'none', color: '#4F46E5', backgroundColor: '#EEF2FF', borderRadius: '12px', marginTop: '16px', display: 'block' }}>My Orders</Link>}
            </div>
          </div>
        )}
      </header>

      {/* Global interactions blocker */}
      {(userMenuOpen || shopMenuOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => { setUserMenuOpen(false); setShopMenuOpen(false); }} />
      )}
    </>
  );
};

export default Header;
