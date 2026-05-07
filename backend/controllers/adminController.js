const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        
        const orders = await Order.find({});
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // Basic Chart Aggregation: Sales by Month
        const salesByMonth = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.json({
            users: totalUsers,
            orders: totalOrders,
            products: totalProducts,
            revenue: totalRevenue,
            salesByMonth
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error calculating stats' });
    }
};

module.exports = {
    getAdminStats
};
