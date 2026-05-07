const express = require('express');
const router = express.Router();
const { toggleWishlistItem, getWishlist, getUserProfile, updateUserProfile, addDeliveryBoy } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/wishlist').get(protect, getWishlist).post(protect, toggleWishlistItem);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/delivery-boy').post(protect, addDeliveryBoy);

module.exports = router;
