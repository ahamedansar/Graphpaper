import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { CheckCircle, Circle, Package, Truck, MapPin, Clock, Banknote, ArrowLeft, User, Printer, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'Pending',   label: 'Order Placed',  icon: Package,      desc: 'Your order has been received' },
  { key: 'Confirmed', label: 'Confirmed',      icon: CheckCircle,  desc: 'Admin confirmed your order' },
  { key: 'Assigned',  label: 'Assigned',       icon: User,         desc: 'Delivery partner assigned' },
  { key: 'Picked Up', label: 'Picked Up',      icon: Package,      desc: 'Order picked up from warehouse' },
  { key: 'On the Way',label: 'On the Way',     icon: Truck,        desc: 'Package is on the way to you' },
  { key: 'Delivered', label: 'Delivered',      icon: CheckCircle,  desc: 'Order delivered successfully!' },
];

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    api.get(`/orders/${id}`, config)
      .then(({ data }) => setOrder(data))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: '#E50010' }}></div>
        <p style={{ marginTop: '16px', color: '#888' }}>Fetching your order…</p>
      </div>
    </div>
  );

  if (!order) return null;

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This cannot be undone.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.put(`/orders/${order._id}/cancel`, {}, config);
      setOrder(data);
      toast.success('Order has been cancelled.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);
  const isDelivered = order.orderStatus === 'Delivered';

  const handlePrintInvoice = () => {
    const itemRows = order.orderItems?.map(item => `
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:10px 0">${item.name}${item.size ? ` (${item.size})` : ''}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">₹${item.price?.toFixed(2)}</td>
        <td style="text-align:right;font-weight:700">₹${(item.qty * item.price)?.toFixed(2)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><title>Invoice #${order._id.substring(0,8)}</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,Arial,sans-serif;color:#1a1a1a;padding:40px}
    @media print{body{padding:20px}button{display:none!important}}
    </style></head><body>
    <div style="max-width:700px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;border-bottom:3px solid #E50010;padding-bottom:24px">
        <div><h1 style="font-size:2rem;font-weight:900;letter-spacing:-2px">Graphpaper<span style="color:#E50010">.</span></h1><p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700">Wholesale Platform</p></div>
        <div style="text-align:right"><p style="font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px">Tax Invoice</p><h2 style="font-size:1.5rem;font-weight:900;color:#4F46E5">#${order._id.substring(0,8).toUpperCase()}</h2><p style="color:#888;font-size:13px">${new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
        <div><p style="font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Bill To</p>
        <p style="font-weight:700">${order.user?.name || 'Customer'}</p><p style="color:#666;font-size:14px">${order.user?.email || ''}</p></div>
        <div><p style="font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Ship To</p>
        <p style="color:#666;font-size:14px">${order.shippingAddress?.address}<br/>${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}<br/>${order.shippingAddress?.country}</p></div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead><tr style="border-bottom:2px solid #1a1a1a">
          <th style="text-align:left;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px">Product</th>
          <th style="text-align:center;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px">Qty</th>
          <th style="text-align:right;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px">Rate</th>
          <th style="text-align:right;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px">Amount</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="display:flex;justify-content:flex-end">
        <div style="min-width:240px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px"><span style="color:#888">Subtotal</span><span>₹${order.totalPrice?.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:14px"><span style="color:#888">Shipping</span><span style="color:#16a34a">Free</span></div>
          <div style="display:flex;justify-content:space-between;border-top:2px solid #1a1a1a;padding-top:12px"><span style="font-weight:900;font-size:16px">Total</span><span style="font-weight:900;font-size:20px;color:#E50010">₹${order.totalPrice?.toFixed(2)}</span></div>
        </div>
      </div>
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
        <p style="font-size:12px;color:#aaa">Payment: <strong>${order.paymentMethod}</strong> — ${order.isPaid ? '✓ Paid' : 'Pending'}</p>
        <p style="font-size:11px;color:#bbb">Thank you for your business!</p>
      </div>
      <div style="text-align:center;margin-top:20px">
        <button onclick="window.print()" style="background:#1a1a1a;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px">Print / Save as PDF</button>
      </div>
    </div></body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>

      {/* Back */}
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#888', fontSize: '14px', fontWeight: '600', marginBottom: '32px' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700', margin: '0 0 6px' }}>Track Your Order</p>
            <h1 style={{ fontWeight: '900', fontSize: '2rem', letterSpacing: '-1px', color: '#1a1a1a', margin: '0 0 6px' }}>
              Order <span style={{ color: '#4F46E5', fontFamily: 'monospace' }}>#{order._id?.substring(0, 8)}</span>
            </h1>
            <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: '700', backgroundColor: isDelivered ? '#DCFCE7' : '#EEF2FF', color: isDelivered ? '#16a34a' : '#4F46E5' }}>
              {order.orderStatus}
            </span>
            <span style={{ padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: '700', backgroundColor: order.isPaid ? '#DCFCE7' : '#FEF9C3', color: order.isPaid ? '#16a34a' : '#d97706' }}>
              {order.isPaid ? '✓ Paid' : 'Payment Pending'}
            </span>
            <button
              onClick={handlePrintInvoice}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '100px', border: '1.5px solid #1a1a1a', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', transition: '0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1a1a1a'; }}
            >
              <Printer size={14} /> Download Invoice
            </button>
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '100px', border: '1.5px solid #E50010', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#E50010', transition: '0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E50010'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#E50010'; }}
              >
                <XCircle size={14} /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F5F5' }}>
        <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={18} color="#4F46E5" /> Delivery Progress
        </h2>
        
        {/* Desktop Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Progress Track */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', height: '4px', backgroundColor: '#F1F5F9', zIndex: 0 }}>
            <div style={{ height: '100%', backgroundColor: isDelivered ? '#16a34a' : '#4F46E5', width: `${(currentIdx / (STEPS.length - 1)) * 100}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: done ? (isDelivered ? '#16a34a' : '#4F46E5') : '#F1F5F9',
                    border: active ? `3px solid ${isDelivered ? '#16a34a' : '#4F46E5'}` : 'none',
                    boxShadow: active ? `0 0 0 4px ${isDelivered ? '#DCFCE7' : '#EEF2FF'}` : 'none',
                    transition: 'all 0.3s ease',
                    marginBottom: '12px',
                  }}>
                    <Icon size={18} color={done ? '#fff' : '#CBD5E1'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: done ? '#1a1a1a' : '#CBD5E1', marginBottom: '2px', whiteSpace: 'nowrap' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', maxWidth: '80px', textAlign: 'center', lineHeight: 1.3 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery update log */}
        {order.deliveryUpdates?.length > 0 && (
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F1F5F9' }}>
            <h3 style={{ fontWeight: '700', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Update Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...order.deliveryUpdates].reverse().map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5', flexShrink: 0, marginTop: '6px' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a' }}>{u.status}</div>
                    {u.note && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{u.note}</div>}
                    <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>{new Date(u.timestamp).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>

        {/* Order Items */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F5F5', gridColumn: '1 / -1' }}>
          <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#E50010" /> Order Items
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {order.orderItems?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i < order.orderItems.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#F5F5F5', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image || '/images/tshirt_product_1774987745271.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                    {item.size && <span>Size: <strong style={{ color: '#1a1a1a' }}>{item.size}</strong> · </span>}
                    Qty: <strong style={{ color: '#1a1a1a' }}>{item.qty} pcs</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: '#1a1a1a', fontSize: '16px' }}>₹{(item.qty * item.price).toFixed(2)}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>₹{item.price.toFixed(2)} /pc</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '2px solid #F1F5F9', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>Total Amount</span>
            <span style={{ fontWeight: '900', fontSize: '22px', color: '#16a34a' }}>₹{order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F5F5' }}>
          <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#E50010" /> Delivery Address
          </h2>
          <div style={{ backgroundColor: '#FAFAFA', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>{order.shippingAddress?.address}</div>
            <div style={{ color: '#888', fontSize: '14px' }}>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</div>
            <div style={{ color: '#888', fontSize: '14px' }}>{order.shippingAddress?.country}</div>
          </div>
        </div>

        {/* Payment */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F5F5' }}>
          <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Banknote size={18} color="#16a34a" /> Payment Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#888' }}>Method</span>
              <span style={{ fontWeight: '700', color: '#1a1a1a' }}>{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#888' }}>Status</span>
              <span style={{ fontWeight: '700', color: order.isPaid ? '#16a34a' : '#d97706' }}>
                {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString('en-IN')}` : 'Pending'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontWeight: '700', color: '#1a1a1a' }}>Total</span>
              <span style={{ fontWeight: '900', color: '#16a34a' }}>₹{order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
