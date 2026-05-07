import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, cartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="py-5">
      <div className="d-flex align-items-center gap-3 mb-5">
        <ShoppingCartIcon size={32} className="text-primary" />
        <h2 className="display-6 fw-bold mb-0">Wholesale Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center bg-light p-5 rounded-4 shadow-sm" style={{ border: '2px dashed var(--border-color)' }}>
          <ShoppingBag size={64} className="text-muted mb-4 opacity-50" />
          <h3 className="fw-semibold text-dark">Your cart is empty</h3>
          <p className="lead text-muted mb-4">You have not added any items yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm">
             Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3">
                <span className="fw-semibold text-muted text-uppercase small" style={{ letterSpacing: '1px' }}>
                  {cartCount} Items in Order
                </span>
              </div>
              <ul className="list-group list-group-flush pt-2">
                {cartItems.map((item) => (
                  <li key={item.cartId} className="list-group-item p-4 border-bottom-0 mb-2">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <div className="bg-light rounded p-2 text-center" style={{ height: '80px', width: '80px' }}>
                           <img 
                             src={item.image || '/images/tshirt_product_1774987745271.png'} 
                             alt={item.name} 
                             className="img-fluid rounded" 
                             style={{ objectFit: 'contain', maxHeight: '100%' }}
                           />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <Link to={`/products/${item.product}`} className="text-decoration-none text-dark fw-bold fs-5 d-block mb-1 text-uppercase" style={{ letterSpacing: '1px' }}>
                          {item.name}
                        </Link>
                        <span className="text-muted small d-block mb-1">Size: <strong className="text-dark">{item.size}</strong></span>
                        <span className="text-muted small d-block">Wholesale Price: ₹{item.price.toFixed(2)} / unit</span>
                      </div>
                      <div className="col-md-3 mt-3 mt-md-0 d-flex justify-content-center">
                        <div className="input-group input-group-sm w-75">
                           <button className="btn btn-outline-secondary rounded-0" onClick={() => updateQty(item.cartId, item.qty - 1)}>
                              <Minus size={14} />
                           </button>
                           <input type="number" className="form-control text-center bg-light fw-bold px-1 border-secondary" value={item.qty} readOnly />
                           <button className="btn btn-outline-secondary rounded-0" onClick={() => updateQty(item.cartId, item.qty + 1)}>
                              <Plus size={14} />
                           </button>
                        </div>
                      </div>
                      <div className="col-md-2 text-center fw-bold fs-5 mt-3 mt-md-0 text-success">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>
                      <div className="col-md-1 text-end mt-3 mt-md-0">
                        <button type="button" className="btn btn-transparent p-2 text-danger hover-opacity" onClick={() => removeFromCart(item.cartId)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4">
              <Link to="/products" className="text-decoration-none fw-semibold p-2 d-inline-flex align-items-center flex-row-reverse gap-2 text-muted hover-effect">
                <ArrowRight size={16} /> Continue adding to order
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4 bg-primary text-white p-4 sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-1">
                 <h4 className="fw-bold border-bottom border-light pb-3 mb-4 border-opacity-25 text-uppercase" style={{ letterSpacing: '1px' }}>
                   Order Summary
                 </h4>
                 
                 <div className="d-flex justify-content-between mb-3 fs-5">
                   <span className="opacity-75">Subtotal ({cartCount})</span>
                   <span className="fw-bold">₹{cartTotal}</span>
                 </div>
                 
                 <div className="d-flex justify-content-between mb-4 fs-6 opacity-75">
                   <span>Shipping Estimated</span>
                   <span>Calculated at checkout</span>
                 </div>
                 
                 <hr className="border-light border-opacity-50 my-4" />
                 
                 <div className="d-flex justify-content-between align-items-end mb-4 pb-2">
                   <span className="fw-semibold fs-5 opacity-75">Total</span>
                   <span className="fw-bold display-6">₹{cartTotal}</span>
                 </div>
                 
                 <button 
                   type="button" 
                   className="btn btn-light btn-lg w-100 fw-bold shadow mt-2 d-flex justify-content-center align-items-center gap-2 text-primary" 
                   onClick={handleCheckout}
                   style={{ borderRadius: '12px' }}
                 >
                   Proceed to Checkout <ArrowRight size={20} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple wrapper for ShoppingCart to maintain consistent imports above
const ShoppingCartIcon = ({size, className}) => (
  <div className={className} style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <svg xmlns="http://www.w3.org/2000/svg" width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  </div>
);

export default Cart;
