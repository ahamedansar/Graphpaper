import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Search, Heart, SlidersHorizontal, X, ChevronDown, ShoppingBag, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Smart image fallback — cycles by category so same-category products look different
const CATEGORY_IMAGES = {
  'T-Shirts':    ['/images/product_tshirt.png'],
  'Tracksuits':  ['/images/product_tracksuit.png'],
  'Sweatshirts': ['/images/product_sweatshirt.png'],
  'Hoodies':     ['/images/product_hoodie.png'],
  'Jackets':     ['/images/product_jacket.png'],
};
const FALLBACK_IMAGES = ['/images/product_tshirt.png', '/images/product_tracksuit.png', '/images/product_hoodie.png'];
const getProductImage = (product) => {
  if (product.image && !product.image.includes('/images/tshirt_') && !product.image.includes('/images/tracksuit_')) return product.image;
  return (CATEGORY_IMAGES[product.category] || FALLBACK_IMAGES)[0];
};

const GENDERS = ['All', 'Men', 'Women', 'Kids'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeGender, setActiveGender] = useState(searchParams.get('gender') || 'All');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setActiveGender(searchParams.get('gender') || 'All');
    setActiveCategory(searchParams.get('category') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await api.get('/users/wishlist', config);
          setWishlist(data.map(item => item._id || item));
        } catch (err) {}
      };
      fetchWishlist();
    }
  }, [user]);

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    if (!user) { toast.info('Please sign in to save items to your wishlist.'); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.post('/users/wishlist', { productId }, config);
      setWishlist(data);
      toast.success('Wishlist updated!');
    } catch (err) { toast.error('Failed to update wishlist'); }
  };

  const allCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = activeGender === 'All' ? true : p.genderCategory === activeGender;
    const matchesCategory = activeCategory ? (p.category === activeCategory) : true;
    return matchesSearch && matchesGender && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm(''); setActiveGender('All'); setActiveCategory('');
  };

  const hasFilters = searchTerm || activeGender !== 'All' || activeCategory;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#FAFAFA', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #F0F0F0', padding: '32px 24px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: '#E50010', margin: '0 0 8px' }}>Wholesale Catalog</p>
              <h1 style={{ fontWeight: '900', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-1.5px', color: '#1a1a1a', margin: 0 }}>
                {activeGender !== 'All' ? `${activeGender}'s Collection` : activeCategory || 'All Products'}
              </h1>
              <p style={{ color: '#888', marginTop: '6px', fontSize: '15px' }}>
                {loading ? 'Loading...' : `${filteredProducts.length} products available`}
              </p>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
                    border: '1.5px solid #F0F0F0', borderRadius: '12px', fontSize: '14px',
                    width: '240px', outline: 'none', backgroundColor: '#F9F9F9', fontFamily: "'Inter', sans-serif"
                  }}
                />
              </div>
              {hasFilters && (
                <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', border: '1.5px solid #eee', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#E50010' }}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Gender Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {GENDERS.map(g => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                style={{
                  padding: '8px 20px', borderRadius: '100px',
                  border: activeGender === g ? '2px solid #1a1a1a' : '1.5px solid #eee',
                  backgroundColor: activeGender === g ? '#1a1a1a' : '#fff',
                  color: activeGender === g ? '#fff' : '#555',
                  fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                  transition: '0.2s', marginBottom: '4px'
                }}
              >{g}</button>
            ))}
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 8px' }} />
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                style={{
                  padding: '8px 20px', borderRadius: '100px',
                  border: activeCategory === cat ? '2px solid #E50010' : '1.5px solid #eee',
                  backgroundColor: activeCategory === cat ? '#FFF0F0' : '#fff',
                  color: activeCategory === cat ? '#E50010' : '#666',
                  fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                  transition: '0.2s', marginBottom: '4px'
                }}
              >{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #f0f0f0' }}>
                <div style={{ height: '280px', backgroundColor: '#F5F5F5', animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '16px', backgroundColor: '#F5F5F5', borderRadius: '8px', marginBottom: '10px', width: '70%' }} />
                  <div style={{ height: '14px', backgroundColor: '#F5F5F5', borderRadius: '8px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <ShoppingBag size={56} color="#ddd" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontWeight: '800', color: '#888', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: '#aaa', marginBottom: '24px' }}>Try adjusting your search or filter criteria.</p>
            <button onClick={clearFilters} style={{ backgroundColor: '#E50010', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {filteredProducts.map((product, index) => {
              const isWished = wishlist.includes(product._id);
              const imgSrc = getProductImage(product);
              return (
                <div
                  key={product._id}
                  style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #f0f0f0', position: 'relative', transition: '0.3s transform, 0.3s box-shadow' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    {/* Image */}
                    <div style={{ height: '280px', backgroundColor: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={imgSrc}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s transform' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                      {/* Category chip */}
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {product.genderCategory} · {product.category}
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: '18px 18px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', margin: 0, lineHeight: 1.3, flex: 1, paddingRight: '8px' }}>{product.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                          <Star size={13} fill="#FACC15" color="#FACC15" />
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#888' }}>4.8</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: '#aaa', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Bulk Rate</span>
                          <span style={{ fontWeight: '900', fontSize: '18px', color: '#E50010' }}>₹{product.price?.toFixed(2)}</span>
                          <span style={{ fontSize: '11px', color: '#aaa', marginLeft: '4px' }}>/pc</span>
                        </div>
                        <div style={{ backgroundColor: '#F0F0F0', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '700', color: '#444' }}>
                          Min 10 pcs
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={e => toggleWishlist(e, product._id)}
                    style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: isWished ? '#FFF0F0' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: isWished ? '1.5px solid #E50010' : '1.5px solid rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <Heart size={16} fill={isWished ? '#E50010' : 'none'} color={isWished ? '#E50010' : '#555'} />
                  </button>

                  {/* Low stock warning */}
                  {product.countInStock < 20 && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#E50010', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '100px' }}>
                      Low Stock
                    </div>
                  )}
                  {!product.countInStock < 20 && product.createdAt && (new Date() - new Date(product.createdAt)) < 30 * 24 * 60 * 60 * 1000 && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#4F46E5', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '100px' }}>
                      ✨ New Arrival
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
