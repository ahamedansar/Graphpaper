import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Truck, CheckCircle, CreditCard, Box, Wallet, Building, Smartphone, FileText, Zap } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  // GPay mock simulation state
  const [showGPayQR, setShowGPayQR] = useState(false);

  if (!user) {
    navigate('/login?redirect=shipping');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    setShowGPayQR(method === 'Google Pay (GPay)');
  };

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      // STEP 1: Create the DB order first (unpaid)
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: 0,
        totalPrice: cartTotal,
      };
      const { data: createdOrder } = await api.post('/orders', orderData, config);

      // STEP 2: If Razorpay — open payment modal
      if (paymentMethod === 'Razorpay (UPI / Card)') {
        const loaded = await loadRazorpay();
        if (!loaded) { toast.error('Failed to load Razorpay. Check your internet connection.'); setLoading(false); return; }

        const { data: rzpOrder } = await api.post('/payment/create-order', { amount: cartTotal }, config);

        const options = {
          key: rzpOrder.keyId,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'Graphpaper Wholesale',
          description: `Order #${createdOrder._id.substring(0, 8)}`,
          order_id: rzpOrder.orderId,
          prefill: { name: user.name, email: user.email },
          theme: { color: '#E50010' },
          handler: async (response) => {
            try {
              await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id,
              }, config);
              clearCart();
              toast.success('Payment successful! Order placed.');
              navigate(`/orders/${createdOrder._id}`);
            } catch {
              toast.error('Payment verification failed. Contact support.');
            }
          },
          modal: { ondismiss: () => { toast.info('Payment cancelled. Order saved — you can pay later.'); navigate(`/orders/${createdOrder._id}`); } }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
        return;
      }

      // STEP 3: Non-Razorpay (COD / Bank Transfer etc.)
      clearCart();
      toast.success('Wholesale order successfully placed!');
      navigate(`/orders/${createdOrder._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="mb-5 border-bottom pb-4">
        <h2 className="display-6 fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Secure Checkout</h2>
        <p className="text-muted text-uppercase small" style={{ letterSpacing: '1px' }}>Finalize your wholesale order</p>
      </div>

      <div className="row g-5">
        
        {/* LEFT COLUMN: Client Details & Payment */}
        <div className="col-lg-7">
          <form id="checkout-form" onSubmit={placeOrder}>
            
            {/* Client Details */}
            <h5 className="mb-4 fw-bold text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
              <Truck size={20} /> Shipping Details
            </h5>
            <div className="bg-light p-4 mb-5 border">
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label small text-muted text-uppercase fw-bold">Street Address</label>
                  <input type="text" className="form-control rounded-0 bg-white" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="e.g. 123 Apparel Factory Blvd" />
                </div>
                <div className="col-md-5">
                  <label className="form-label small text-muted text-uppercase fw-bold">City</label>
                  <input type="text" className="form-control rounded-0 bg-white" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted text-uppercase fw-bold">Zip Code</label>
                  <input type="text" className="form-control rounded-0 bg-white" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted text-uppercase fw-bold">Country</label>
                  <input type="text" className="form-control rounded-0 bg-white" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Payment Module */}
            <h5 className="mb-4 fw-bold text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
              <Wallet size={20} /> Payment Option
            </h5>
            <div className="bg-white border rounded-0 overflow-hidden mb-4">
              
              {/* Payment Methods */}
              <div className="list-group list-group-flush">
                
                {/* Credit Card */}
                <label className={`list-group-item p-4 border-0 border-bottom cursor-pointer ${paymentMethod === 'Credit Card' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-3">
                    <input className="form-check-input mt-0 shadow-none" type="radio" checked={paymentMethod === 'Credit Card'} onChange={() => handlePaymentSelection('Credit Card')} />
                    <CreditCard size={24} className={paymentMethod === 'Credit Card' ? 'text-dark' : 'text-muted'} />
                    <div>
                      <span className="fw-bold d-block text-uppercase" style={{ letterSpacing: '0.5px' }}>Credit / Debit Card</span>
                      <span className="small text-muted">Visa, Mastercard, Amex</span>
                    </div>
                  </div>
                </label>

              {/* Razorpay UPI/Card */}
                <label className={`list-group-item p-4 border-0 border-bottom cursor-pointer ${paymentMethod === 'Razorpay (UPI / Card)' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-3">
                    <input className="form-check-input mt-0 shadow-none" type="radio" checked={paymentMethod === 'Razorpay (UPI / Card)'} onChange={() => handlePaymentSelection('Razorpay (UPI / Card)')} />
                    <Zap size={24} className={paymentMethod === 'Razorpay (UPI / Card)' ? 'text-dark' : 'text-muted'} />
                    <div>
                      <span className="fw-bold d-block text-uppercase" style={{ letterSpacing: '0.5px' }}>Razorpay — UPI / Card / NetBanking</span>
                      <span className="small text-muted">Instant payment via UPI, Debit/Credit Card, or NetBanking</span>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '800', padding: '4px 8px', backgroundColor: '#DCFCE7', color: '#16a34a', borderRadius: '6px' }}>LIVE</span>
                  </div>
                </label>

                {/* Google Pay QR */}
                <label className={`list-group-item p-4 border-0 border-bottom cursor-pointer ${paymentMethod === 'Google Pay (GPay)' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-3">
                    <input className="form-check-input mt-0 shadow-none" type="radio" checked={paymentMethod === 'Google Pay (GPay)'} onChange={() => handlePaymentSelection('Google Pay (GPay)')} />
                    <Smartphone size={24} className={paymentMethod === 'Google Pay (GPay)' ? 'text-dark' : 'text-muted'} />
                    <div>
                      <span className="fw-bold d-block text-uppercase" style={{ letterSpacing: '0.5px' }}>Google Pay (Scan QR)</span>
                      <span className="small text-muted">Scan QR code using UPI or GPay app</span>
                    </div>
                  </div>
                  {showGPayQR && (
                     <div className="mt-4 ms-5 p-4 bg-white border text-center" style={{ maxWidth: '250px' }}>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=graphpaper-wholesale-payment" alt="GPay QR Scanner" className="mb-3 img-fluid" />
                        <p className="small text-muted mb-0 fw-bold">Scan with GPay App</p>
                     </div>
                  )}
                </label>

                {/* Bank Transfer */}
                <label className={`list-group-item p-4 border-0 border-bottom cursor-pointer ${paymentMethod === 'Bank Transfer' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                   <div className="d-flex align-items-center gap-3">
                    <input className="form-check-input mt-0 shadow-none" type="radio" checked={paymentMethod === 'Bank Transfer'} onChange={() => handlePaymentSelection('Bank Transfer')} />
                    <Building size={24} className={paymentMethod === 'Bank Transfer' ? 'text-dark' : 'text-muted'} />
                    <div>
                      <span className="fw-bold d-block text-uppercase" style={{ letterSpacing: '0.5px' }}>Direct Bank Transfer</span>
                      <span className="small text-muted">Wire money directly to our corporate account</span>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery (COD) / Net Terms */}
                <label className={`list-group-item p-4 border-0 cursor-pointer ${paymentMethod === 'Cash on Delivery (COD)' ? 'bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                   <div className="d-flex align-items-center gap-3">
                    <input className="form-check-input mt-0 shadow-none" type="radio" checked={paymentMethod === 'Cash on Delivery (COD)'} onChange={() => handlePaymentSelection('Cash on Delivery (COD)')} />
                    <FileText size={24} className={paymentMethod === 'Cash on Delivery (COD)' ? 'text-dark' : 'text-muted'} />
                    <div>
                      <span className="fw-bold d-block text-uppercase" style={{ letterSpacing: '0.5px' }}>Cash on Delivery / Net 30</span>
                      <span className="small text-muted">Pay securely upon receiving your bulk shipment</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="col-lg-5">
          <div className="bg-light p-4 sticky-top border border-secondary" style={{ top: '100px' }}>
             <h5 className="fw-bold border-bottom border-dark pb-3 mb-4 text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px' }}>
               <Box size={20} /> Final Review
             </h5>
             
             <ul className="list-unstyled mb-4 small">
               {cartItems.map((item, index) => (
                 <li key={index} className="d-flex justify-content-between mb-3 border-bottom pb-2">
                   <div className="d-flex flex-column" style={{ maxWidth: '70%' }}>
                     <span className="fw-bold text-uppercase">{item.name}</span>
                     <span className="text-muted mt-1">Size: {item.size} • Qty: {item.qty}</span>
                   </div>
                   <span className="fw-bold text-dark">₹{(item.qty * item.price).toFixed(2)}</span>
                 </li>
               ))}
             </ul>

             <div className="d-flex justify-content-between mb-3 text-uppercase small fw-bold">
               <span className="text-muted">Subtotal</span>
               <span>₹{Number(cartTotal).toFixed(2)}</span>
             </div>
             
             <div className="d-flex justify-content-between mb-4 text-uppercase small fw-bold">
               <span className="text-muted">Freight Shipping</span>
               <span className="text-success">Free</span>
             </div>
             
             <div className="d-flex justify-content-between align-items-end mt-4 pt-3 border-top border-dark">
               <span className="fw-bold text-uppercase fs-5" style={{ letterSpacing: '1px' }}>Total Amount</span>
               <span className="fw-bold fs-3">₹{Number(cartTotal).toFixed(2)}</span>
             </div>
             
             <button 
               type="submit" 
               form="checkout-form"
               className="btn btn-dark btn-lg w-100 rounded-0 mt-4 py-3 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2" 
               disabled={loading}
               style={{ letterSpacing: '1px' }}
             >
               {loading ? 'Confirming...' : <><CheckCircle size={20} /> Place Order</>}
             </button>
             <p className="text-muted small text-center mt-3">By placing your order, you agree to our Wholesale Terms of Service.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
