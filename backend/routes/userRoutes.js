const express = require('express');
const router = express.Router();
const { toggleWishlistItem, getWishlist, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/wishlist').get(protect, getWishlist).post(protect, toggleWishlistItem);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
