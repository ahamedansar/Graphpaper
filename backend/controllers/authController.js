const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send password reset link via email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Always respond 200 to prevent email enumeration attacks
        if (!user) {
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }

        // Generate plain token, store hashed version in DB
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // Build reset URL (frontend URL)
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetURL = `${frontendURL}/reset-password/${resetToken}`;

        const html = `
            <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">
                <div style="text-align:center;margin-bottom:32px;">
                    <h1 style="font-size:2rem;font-weight:900;letter-spacing:-2px;color:#1a1a1a;margin:0;">
                        Graphpaper<span style="color:#E50010;">.</span>
                    </h1>
                    <p style="color:#888;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-top:4px;">Wholesale Platform</p>
                </div>

                <div style="background:#F8F8F8;border-radius:20px;padding:36px;margin-bottom:24px;">
                    <h2 style="font-weight:900;font-size:1.5rem;color:#1a1a1a;margin:0 0 12px;letter-spacing:-0.5px;">Reset Your Password</h2>
                    <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 28px;">
                        Hi <strong>${user.name}</strong>,<br/>
                        We received a request to reset the password for your Graphpaper account. Click the button below to create a new password.
                    </p>
                    <a href="${resetURL}"
                        style="display:inline-block;background:#E50010;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;letter-spacing:0.3px;">
                        Reset Password →
                    </a>
                    <p style="color:#aaa;font-size:13px;margin:20px 0 0;">This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
                </div>

                <p style="color:#bbb;font-size:12px;text-align:center;margin:0;">
                    Or copy this link: <br/>
                    <span style="color:#4F46E5;word-break:break-all;">${resetURL}</span>
                </p>

                <div style="border-top:1px solid #eee;margin-top:32px;padding-top:20px;text-align:center;">
                    <p style="color:#ccc;font-size:12px;margin:0;">© ${new Date().getFullYear()} Graphpaper Wholesale. All rights reserved.</p>
                </div>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Reset Your Graphpaper Password',
            html,
        });

        res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        // Clear token if email send fails
        if (error.user) {
            error.user.resetPasswordToken = undefined;
            error.user.resetPasswordExpires = undefined;
            await error.user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash the incoming plain token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or has expired. Please request a new one.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully! You can now log in with your new password.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server Error. Please try again.' });
    }
};

// @desc    Send OTP to phone number via Fast2SMS
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: 'Phone number is required' });

        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length !== 10) return res.status(400).json({ message: 'Invalid phone number' });

        const user = await User.findOne({ phone: { $regex: cleanPhone, $options: 'i' } });
        if (!user) return res.status(404).json({ message: 'No account found with this phone number. Please register first.' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        await user.save({ validateBeforeSave: false });

        // Send via Fast2SMS
        const fast2smsKey = process.env.FAST2SMS_API_KEY;
        if (fast2smsKey) {
            const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&flash=0&numbers=${cleanPhone}`;
            await fetch(url).catch(() => {});
        }

        // In dev/test mode, return OTP in response
        const isDev = !fast2smsKey;
        res.json({ 
            message: `OTP sent to +91-${cleanPhone.slice(0,5)}XXXXX`,
            ...(isDev && { otp }) // only expose in dev when no API key
        });
    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ message: 'Failed to send OTP. Try again.' });
    }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        const user = await User.findOne({ phone: { $regex: cleanPhone, $options: 'i' } });

        if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired. Please request a new one.' });

        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            isVerified: user.isVerified,
            token: generateToken(user._id, user.role),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { authUser, registerUser, forgotPassword, resetPassword, sendOTP, verifyOTP };
