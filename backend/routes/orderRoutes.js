const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/orderController');
const { protect, admin, deliveryBoy } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/delivery').get(protect, deliveryBoy, getMyDeliveries);
router.route('/delivery-boys').get(protect, admin, getDeliveryBoys);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, admin, updateOrderToPaid);  // Admin marks as paid
router.route('/:id/cancel').put(protect, cancelOrder);              // User/Admin cancel
router.route('/:id/confirm').put(protect, admin, updateOrderToConfirmed);
router.route('/:id/assign').put(protect, admin, assignOrderToDeliveryBoy);
router.route('/:id/self-assign').put(protect, deliveryBoy, selfAssignOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/delivery-status').put(protect, deliveryBoy, updateDeliveryStatus);
router.route('/:id/cash-collected').put(protect, deliveryBoy, confirmCashCollected);

module.exports = router;
