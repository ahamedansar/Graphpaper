import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { Plus, ArrowUpRight, Search, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Products');

  const filters = ['All Products', 'T-Shirts', 'Tracksuits', 'Sweatshirts', 'Shoes', 'Accessories'];

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createSampleProduct = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/products', {}, config);
      toast.success('Sample product added!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/products/${id}`, config);
      toast.success('Product deleted.');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loader message="Loading catalog..." />;

  const displayedProducts = activeFilter === 'All Products' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <div className="fade-in">
      {/* Top Header Row */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h1 className="fw-bold mb-3 mb-md-0" style={{ fontSize: '2rem', color: '#1E293B' }}>Products</h1>
        
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <Search size={16} className="position-absolute text-muted" style={{ top: '50%', left: '14px', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="form-control border-0 px-5 py-2 rounded-pill shadow-none" 
              style={{ backgroundColor: '#E8EEFF', color: '#1E293B', width: '240px' }}
              value={activeFilter === 'All Products' ? '' : ''}
            />
          </div>
          <Link 
            to="/admin/products/new"
            className="btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-semibold border-0 text-white"
            style={{ backgroundColor: '#4F46E5', textDecoration: 'none' }}
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Categories Filter Row */}
      <div className="d-flex gap-3 mb-5 overflow-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
        {filters.map((filter, index) => (
          <button
            key={index}
            onClick={() => setActiveFilter(filter)}
            className={`btn rounded-pill px-4 py-1 fw-semibold border-0`}
            style={activeFilter === filter
              ? { backgroundColor: '#4F46E5', color: '#fff' }
              : { backgroundColor: '#E2E8F0', color: '#64748B' }
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid of Products */}
      <div className="row g-4">
        {displayedProducts.map((product) => (
          <div className="col-12 col-sm-6 col-lg-3" key={product._id}>
            <div 
              className="card border-0 rounded-4 h-100 position-relative overflow-hidden" 
              style={{ background: '#FFFFFF', minHeight: '300px', boxShadow: '0 2px 16px rgba(79,70,229,0.07)', transition: 'box-shadow 0.2s' }}
            >
              {/* Product Image Area */}
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: '#F0F4FF' }}>
                <img 
                  src={product.image || '/images/tshirt_product_1774987745271.png'} 
                  alt={product.name} 
                  className="img-fluid" 
                  style={{ maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Bottom Card Content */}
              <div className="card-body d-flex justify-content-between align-items-end p-3">
                <div>
                  <h6 className="fw-bold mb-1 text-truncate" style={{ color: '#1E293B', maxWidth: '140px' }}>{product.name}</h6>
                  <span style={{ color: '#4F46E5', fontWeight: '600' }}>₹{product.price.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link to={`/admin/products/${product._id}/edit`} className="btn rounded-circle p-2 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#EEF2FF', width: '36px', height: '36px' }}>
                    <ArrowUpRight size={18} style={{ color: '#4F46E5' }} />
                  </Link>
                  <button onClick={() => deleteProduct(product._id, product.name)} className="btn rounded-circle p-2 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#FEE2E2', width: '36px', height: '36px' }}>
                    <Trash2 size={16} style={{ color: '#E50010' }} />
                  </button>
                </div>
              </div>
              
              {product.countInStock < 20 && (
                 <div className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded bg-danger text-white small fw-bold" style={{ fontSize: '10px' }}>Low Stock</div>
              )}
            </div>
          </div>
        ))}

        {displayedProducts.length === 0 && (
          <div className="col-12 py-5 text-center text-muted">
             No products found in this category.
          </div>
        )}
      </div>
      
      {/* Footer entries count */}
      <div className="d-flex justify-content-between align-items-center mt-5 pt-3">
        <span style={{ color: '#94A3B8', fontSize: '13px' }}>Showing 1 to {displayedProducts.length} of {products.length} entries</span>
        <div className="d-flex gap-2">
           <button className="btn btn-sm rounded-pill px-4 fw-semibold" style={{ backgroundColor: '#E8EEFF', color: '#4F46E5' }}>Previous</button>
           <button className="btn btn-sm rounded-pill px-4 fw-semibold" style={{ backgroundColor: '#4F46E5', color: '#fff' }}>Next</button>
        </div>
      </div>

    </div>
  );
};

export default ProductList;
