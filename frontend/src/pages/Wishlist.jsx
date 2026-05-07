import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=wishlist');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Populate returns actual product objects
        const { data } = await api.get('/users/wishlist', config);
        setWishlistItems(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load wishlist');
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user, navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/users/wishlist', { productId }, config); // toggle will remove it
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader message="Loading wishlist..." />;

  return (
    <div className="py-5">
      <div className="d-flex align-items-center gap-3 mb-5 border-bottom pb-4">
        <Heart size={32} className="text-danger" fill="currentColor" />
        <div>
          <h2 className="display-6 fw-bold mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>Your Wishlist</h2>
          <p className="text-muted text-uppercase small mb-0 mt-2" style={{ letterSpacing: '1px' }}>{wishlistItems.length} saved items</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center bg-light p-5 border">
          <Heart size={48} className="text-muted mb-4 opacity-25" />
          <h4 className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Your Wishlist is Empty</h4>
          <p className="lead text-muted mb-4">You haven't saved any wholesale items yet.</p>
          <Link to="/products" className="btn btn-dark btn-lg rounded-0 px-5 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
             Discover Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map(item => (
            <div key={item._id} className="col-sm-6 col-lg-3">
              <div className="card h-100 border-0 rounded-0 position-relative">
                <Link to={`/products/${item._id}`} className="text-decoration-none text-dark d-block">
                  <div className="bg-light position-relative" style={{ height: '350px' }}>
                    <img 
                      src={item.image || '/images/tshirt_product_1774987745271.png'} 
                      alt={item.name} 
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body px-0 pt-3 pb-0">
                    <h6 className="card-title fw-bold text-uppercase mb-1 text-truncate">{item.name}</h6>
                    <p className="card-text text-muted mb-2 small">₹{item.price?.toFixed(2)}</p>
                  </div>
                </Link>
                <div className="d-flex gap-2 mt-3 pb-2">
                    <Link to={`/products/${item._id}`} className="btn btn-outline-dark rounded-0 w-100 text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>View Detail</Link>
                    <button onClick={() => removeFromWishlist(item._id)} className="btn btn-outline-danger rounded-0" title="Remove">
                      <Trash2 size={16} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
