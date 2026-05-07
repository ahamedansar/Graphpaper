const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
    try {
        const { name, email, phone, rating, category, message } = req.body;
        const feedback = await Feedback.create({ name, email, phone, rating, category, message });
        res.status(201).json({ success: true, message: 'Feedback submitted successfully!', feedback });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get all feedbacks (admin)
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Mark feedback as read
// @route   PUT /api/feedback/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        feedback.isRead = true;
        await feedback.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitFeedback, getAllFeedback, markAsRead };
