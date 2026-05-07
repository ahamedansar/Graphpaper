const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('assignedDeliveryBoy', 'name email phone');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // Here we could store Stripe/Razorpay details in paymentResult
        order.paymentResult = {
            id: req.body.id || 'dummy_id',
            status: req.body.status || 'success',
            update_time: req.body.update_time || Date.now(),
            email_address: req.body.email_address || req.user.email,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to confirmed (Admin Accept Order)
// @route   PUT /api/orders/:id/confirm
// @access  Private/Admin
const updateOrderToConfirmed = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        order.orderStatus = 'Confirmed';
        const updatedOrder = await order.save();

        // Notify customer
        if (order.user?.email) {
            sendEmail({
                to: order.user.email,
                subject: '✅ Your Graphpaper Order Has Been Confirmed!',
                html: `
                <div style="font-family:'Inter',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px;">
                    <h1 style="font-weight:900;letter-spacing:-2px;margin:0 0 4px">Graphpaper<span style="color:#E50010">.</span></h1>
                    <p style="color:#888;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px">Wholesale Platform</p>
                    <h2 style="font-weight:900;color:#16a34a;font-size:1.4rem;margin:0 0 12px">Order Confirmed ✅</h2>
                    <p style="color:#555;line-height:1.6">Hi <strong>${order.user.name}</strong>,<br/>Great news! Your order <strong>#${order._id.toString().substring(0,8)}</strong> has been confirmed and is being prepared for shipment.</p>
                    <div style="background:#F8F8F8;border-radius:12px;padding:20px;margin:24px 0">
                        <p style="margin:0;font-size:14px;color:#888">Order Total</p>
                        <p style="margin:4px 0 0;font-size:1.5rem;font-weight:900;color:#E50010">₹${order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <p style="color:#aaa;font-size:12px">We'll notify you when it's out for delivery. — Graphpaper Team</p>
                </div>`,
            }).catch(() => {});
        }

        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('assignedDeliveryBoy', 'name email phone');
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name')
        .populate('assignedDeliveryBoy', 'name email phone');
    res.json(orders);
};

// @desc    Assign order to a delivery boy (Admin)
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
const assignOrderToDeliveryBoy = async (req, res) => {
    const { deliveryBoyId, deliveryDistance } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        const km = parseFloat(deliveryDistance) || 0;
        const earnings = parseFloat((km * 6).toFixed(2)); // ₹6/km = ₹30 per 5km

        order.assignedDeliveryBoy = deliveryBoyId;
        order.orderStatus = 'Assigned';
        order.deliveryDistance = km;
        order.deliveryEarnings = earnings;
        order.deliveryUpdates.push({ status: 'Assigned', note: `Assigned. Distance: ${km}km. Earnings: ₹${earnings}` });
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update delivery status (Delivery Boy)
// @route   PUT /api/orders/:id/delivery-status
// @access  Private/DeliveryBoy
const updateDeliveryStatus = async (req, res) => {
    const { status, note } = req.body;
    const validStatuses = ['Picked Up', 'On the Way', 'Delivered'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        order.orderStatus = status;
        order.deliveryUpdates.push({ status, note: note || '' });
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        const updatedOrder = await order.save();

        // Email customer on key delivery milestones
        const emailMap = {
            'On the Way': { subject: '🚚 Your Graphpaper Order is On the Way!', color: '#9333ea', emoji: '🚚', message: 'Your order is on the way! Expect delivery soon.' },
            'Delivered':  { subject: '🎉 Order Delivered — Thank you!', color: '#16a34a', emoji: '🎉', message: 'Your order has been delivered successfully. Thank you for choosing Graphpaper Wholesale!' },
        };

        if (emailMap[status] && order.user?.email) {
            const em = emailMap[status];
            sendEmail({
                to: order.user.email,
                subject: em.subject,
                html: `
                <div style="font-family:'Inter',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px;">
                    <h1 style="font-weight:900;letter-spacing:-2px;margin:0 0 4px">Graphpaper<span style="color:#E50010">.</span></h1>
                    <p style="color:#888;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px">Wholesale Platform</p>
                    <h2 style="font-weight:900;color:${em.color};font-size:1.4rem;margin:0 0 12px">${em.emoji} ${status}</h2>
                    <p style="color:#555;line-height:1.6">Hi <strong>${order.user?.name}</strong>,<br/>${em.message}</p>
                    <div style="background:#F8F8F8;border-radius:12px;padding:20px;margin:24px 0">
                        <p style="margin:0;font-size:13px;color:#888">Order <strong>#${order._id.toString().substring(0,8)}</strong></p>
                        <p style="margin:4px 0 0;font-size:1.5rem;font-weight:900;color:#E50010">₹${order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <p style="color:#aaa;font-size:12px">— Graphpaper Wholesale Team</p>
                </div>`,
            }).catch(() => {});
        }

        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Delivery boy self-assigns a confirmed order (takes it from pool)
// @route   PUT /api/orders/:id/self-assign
// @access  Private/DeliveryBoy
const selfAssignOrder = async (req, res) => {
    const User = require('../models/User');
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus !== 'Confirmed') return res.status(400).json({ message: 'Order is not available for pickup' });
    if (order.assignedDeliveryBoy) return res.status(400).json({ message: 'Order already taken by another delivery boy' });

    // Use selected deliveryBoyId from body, or fallback to the logged-in user
    const { deliveryBoyId } = req.body;
    let assigningBoy = req.user;
    if (deliveryBoyId) {
        assigningBoy = await User.findById(deliveryBoyId) || req.user;
    }

    order.assignedDeliveryBoy = assigningBoy._id;
    order.orderStatus = 'Assigned';
    order.deliveryUpdates.push({ status: 'Assigned', note: `Taken by delivery boy: ${assigningBoy.name}` });
    await order.save();

    // Notify admin by email
    try {
        const admin = await User.findOne({ role: 'admin' });
        if (admin?.email) {
            sendEmail({
                to: admin.email,
                subject: `🚚 Order #${order._id.toString().substring(0,8)} picked up by ${assigningBoy.name}`,
                html: `<div style="font-family:'Inter',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px">
                    <h1 style="font-weight:900;letter-spacing:-2px;margin:0 0 4px">Graphpaper<span style="color:#E50010">.</span></h1>
                    <h2 style="color:#4F46E5;margin:24px 0 12px">🚴 Delivery Boy Has Taken An Order</h2>
                    <p style="color:#555;line-height:1.7">
                        <strong>${assigningBoy.name}</strong> has accepted Order <strong>#${order._id.toString().substring(0,8)}</strong>
                        for customer <strong>${order.user?.name}</strong>.
                    </p>
                    <div style="background:#EEF2FF;border-radius:12px;padding:20px;margin:20px 0">
                        <p style="margin:0;font-size:14px;color:#555">Order Amount: <strong style="color:#E50010">₹${order.totalPrice?.toFixed(2)}</strong></p>
                        <p style="margin:8px 0 0;font-size:14px;color:#555">Payment: ${order.paymentMethod}</p>
                        <p style="margin:8px 0 0;font-size:14px;color:#555">Deliver To: ${order.shippingAddress?.address}, ${order.shippingAddress?.city}</p>
                    </div>
                    <p style="color:#aaa;font-size:12px">— Graphpaper Delivery System</p>
                </div>`,
            }).catch(() => {});
        }
    } catch (e) {}

    res.json(order);
};

// @desc    Get orders for delivery dashboard (available pool + my orders)
// @route   GET /api/orders/delivery
// @access  Private/DeliveryBoy
const getMyDeliveries = async (req, res) => {
    // Available: Confirmed orders not yet assigned to anyone
    const available = await Order.find({ orderStatus: 'Confirmed', assignedDeliveryBoy: null })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

    // Mine: orders assigned to this delivery boy
    const mine = await Order.find({ assignedDeliveryBoy: req.user._id })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

    res.json({ available, mine });
};

// @desc    Get all delivery boys (Admin - for assign dropdown)
// @route   GET /api/orders/delivery-boys
// @access  Private/Admin
const getDeliveryBoys = async (req, res) => {
    const User = require('../models/User');
    const deliveryBoys = await User.find({ role: 'delivery_boy' }).select('name email phone');
    res.json(deliveryBoys);
};

// @desc    Delivery boy confirms COD cash received
// @route   PUT /api/orders/:id/cash-collected
// @access  Private/DeliveryBoy
const confirmCashCollected = async (req, res) => {
    const User = require('../models/User');
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('assignedDeliveryBoy', 'name');
    if (order) {
        if (order.paymentMethod !== 'COD') {
            return res.status(400).json({ message: 'This is not a COD order' });
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = { status: 'Cash Collected by Delivery Boy', update_time: new Date().toISOString() };
        order.deliveryUpdates.push({ status: 'Cash Collected', note: 'Cash payment confirmed by delivery boy' });
        const updatedOrder = await order.save();

        // Notify admin by email
        try {
            const admin = await User.findOne({ role: 'admin' });
            if (admin?.email) {
                sendEmail({
                    to: admin.email,
                    subject: `💰 Cash Collected: Order #${order._id.toString().substring(0,8)}`,
                    html: `<div style="font-family:'Inter',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px">
                        <h1 style="font-weight:900;letter-spacing:-2px;margin:0 0 4px">Graphpaper<span style="color:#E50010">.</span></h1>
                        <h2 style="color:#16a34a;margin:24px 0 12px">💵 Cash Payment Received</h2>
                        <p style="color:#555;line-height:1.7">
                            Delivery personnel <strong>${order.assignedDeliveryBoy?.name || 'Delivery Boy'}</strong> has successfully collected the cash for Order <strong>#${order._id.toString().substring(0,8)}</strong> from customer <strong>${order.user?.name}</strong>.
                        </p>
                        <div style="background:#DCFCE7;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #BBF7D0">
                            <p style="margin:0;font-size:14px;color:#166534">Amount Collected: <strong style="font-size:18px">₹${order.totalPrice?.toFixed(2)}</strong></p>
                            <p style="margin:8px 0 0;font-size:14px;color:#166534">Time: ${new Date().toLocaleString()}</p>
                        </div>
                        <p style="color:#aaa;font-size:12px">— Graphpaper Delivery System</p>
                    </div>`,
                }).catch(() => {});
            }
        } catch (e) {}

        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Cancel an order (User - only if Pending/Confirmed)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
        return res.status(400).json({ message: `Order cannot be cancelled once it is "${order.orderStatus}".` });
    }

    // Only the order owner or admin can cancel
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    order.orderStatus = 'Cancelled';
    order.deliveryUpdates.push({ status: 'Cancelled', note: 'Order cancelled by customer' });
    const updatedOrder = await order.save();
    res.json(updatedOrder);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderToConfirmed,
    assignOrderToDeliveryBoy,
    selfAssignOrder,
    updateDeliveryStatus,
    confirmCashCollected,
    getMyDeliveries,
    getDeliveryBoys,
    getMyOrders,
    getOrders,
    cancelOrder,
};
