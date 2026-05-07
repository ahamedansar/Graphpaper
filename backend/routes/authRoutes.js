const express = require('express');
const router = express.Router();
const { authUser, registerUser, forgotPassword, resetPassword, sendOTP, verifyOTP } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
