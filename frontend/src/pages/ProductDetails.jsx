import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { ArrowLeft, ShoppingCart, Info, Minus, Plus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  // Sizing Grid State mapping Size -> Quantity
  const [sizeQuantities, setSizeQuantities] = useState({
    S: 0, M: 0, L: 0, XL: 0, XXL: 0
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        
        // Initialize state based on product's actual sizes
        const initSizes = {};
        if (data.sizes && data.sizes.length > 0) {
          data.sizes.forEach(sz => initSizes[sz] = 0);
        } else {
          ['S', 'M', 'L', 'XL', 'XXL'].forEach(sz => initSizes[sz] = 0);
        }
        setSizeQuantities(initSizes);
        setLoading(false);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleQtyChange = (size, delta) => {
    setSizeQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, prev[size] + delta)
    }));
  };

  const handleManualInput = (size, value) => {
    const parsed = parseInt(value, 10);
    setSizeQuantities(prev => ({
      ...prev,
      [size]: isNaN(parsed) ? 0 : Math.max(0, parsed)
    }));
  };

  const totalQty = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);

  const handleAddToCart = () => {
    const selectedSizes = Object.entries(sizeQuantities).filter(([, qty]) => qty > 0);
    if (selectedSizes.length === 0) {
      toast.error('Please select at least one size and minimum 10 units.');
      return;
    }
    // Enforce minimum 10 per selected size
    const belowMin = selectedSizes.filter(([, qty]) => qty < 10);
    if (belowMin.length > 0) {
      const sizes = belowMin.map(([s]) => s).join(', ');
      toast.error(`Minimum 10 units required per size. Please increase quantity for: ${sizes}`);
      return;
    }
    addToCart(product, sizeQuantities);
    toast.success(`✅ Added ${totalQty} units to cart!`);
    const resetSizes = { ...sizeQuantities };
    Object.keys(resetSizes).forEach(k => resetSizes[k] = 0);
    setSizeQuantities(resetSizes);
  };

  if (loading || !product) return <Loader message="Loading details..." />;

  return (
    <div className="py-4">
      <Link to="/products" className="btn btn-light mb-4 d-inline-flex align-items-center gap-2 rounded-0 px-4 border shadow-sm text-dark hover-opacity text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="row g-5">
        <div className="col-lg-6">
          <div className="bg-light p-4 rounded-0 d-flex align-items-center justify-content-center h-100" style={{ minHeight: '600px' }}>
             <img 
               src={product.image || '/images/tshirt_product_1774987745271.png'} 
               alt={product.name} 
               className="img-fluid" 
               style={{ maxHeight: '550px', objectFit: 'contain' }}
             />
          </div>
        </div>

        <div className="col-lg-6 d-flex flex-column py-4">
          <div className="mb-2 text-uppercase fw-semibold text-danger" style={{ letterSpacing: '2px', fontSize: '12px' }}>
            {product.genderCategory || 'Unisex'} • {product.category}
          </div>
          <h2 className="fw-bold mb-3 text-uppercase display-5" style={{ letterSpacing: '-1px' }}>{product.name}</h2>
          
          <div className="d-flex align-items-baseline gap-2 mb-4">
            <h3 className="fw-bold mb-0 text-dark">₹{product.price?.toFixed(2)}</h3>
            <span className="text-muted small text-uppercase" style={{ letterSpacing: '1px' }}>/ Wholesale Unit</span>
          </div>
          
          <p className="text-muted mb-5" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            {product.description}
          </p>
          
          {/* Wholesale Sizing Breakdown Grid */}
          <div className="bg-light p-4 mb-5 border">
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-secondary">
              <Info size={16} className="text-dark" />
              <strong className="text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Select Size Breakdown</strong>
            </div>
            
            <div className="row g-3">
              {Object.keys(sizeQuantities).map(size => (
                <div key={size} className="col-6 col-md-4">
                   <div className="d-flex flex-column bg-white border p-3">
                     <span className="fw-bold text-center mb-2">{size}</span>
                     <div className="input-group input-group-sm">
                       <button className="btn btn-outline-secondary rounded-0" type="button" onClick={() => handleQtyChange(size, -1)}>
                         <Minus size={14} />
                       </button>
                       <input 
                         type="number" 
                         className="form-control text-center fw-bold border-secondary bg-light" 
                         value={sizeQuantities[size]} 
                         onChange={(e) => handleManualInput(size, e.target.value)}
                         min="0" 
                       />
                       <button className="btn btn-outline-secondary rounded-0" type="button" onClick={() => handleQtyChange(size, 1)}>
                         <Plus size={14} />
                       </button>
                     </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-top border-secondary d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted text-uppercase small d-block mb-1" style={{ letterSpacing: '1px' }}>Total Units</span>
                <span className="fs-4 fw-bold">{totalQty}</span>
              </div>
              <div className="text-end">
                <span className="text-muted text-uppercase small d-block mb-1" style={{ letterSpacing: '1px' }}>Subtotal</span>
                <span className="fs-4 fw-bold text-success">₹{(product.price * totalQty).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-dark btn-lg w-100 py-3 rounded-0 text-uppercase fw-bold d-inline-flex justify-content-center align-items-center gap-2"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0 || totalQty === 0}
            style={{ letterSpacing: '1px' }}
          >
             <ShoppingCart size={20} />
             {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
