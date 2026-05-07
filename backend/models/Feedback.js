const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, enum: ['Product Quality', 'Delivery', 'Customer Service', 'Pricing', 'General'], default: 'General' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
