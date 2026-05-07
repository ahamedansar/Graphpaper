const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Toggle wishlist item
const toggleWishlistItem = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.body;
        if (user) {
            const isWished = user.wishlist.includes(productId);
            if (isWished) {
                user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
            } else {
                user.wishlist.push(productId);
            }
            await user.save();
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get wishlist
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (user) {
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpires -otp -otpExpires');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, phone, currentPassword, newPassword } = req.body;

        user.name  = name  || user.name;
        user.phone = phone !== undefined ? phone : user.phone;

        // Change password flow
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to set a new one.' });
            }
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect.' });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ message: 'New password must be at least 8 characters.' });
            }
            user.password = newPassword; // pre-save hook will hash it
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new delivery boy profile (by admin or from delivery portal)
// @route   POST /api/users/delivery-boy
// @access  Private (Admin or DeliveryBoy)
const addDeliveryBoy = async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required' });

        const email = `delivery_${Date.now()}@graphpaper.in`;
        const password = Math.random().toString(36).slice(-8); // Random secure password

        const user = await User.create({
            name,
            phone,
            email,
            password,
            role: 'delivery_boy',
            isVerified: true
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        console.error('Error adding delivery boy:', error);
        res.status(500).json({ message: 'Failed to create delivery boy profile' });
    }
};

module.exports = { toggleWishlistItem, getWishlist, getUserProfile, updateUserProfile, addDeliveryBoy };
