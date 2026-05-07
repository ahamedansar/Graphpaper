const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, markAsRead } = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitFeedback);
router.get('/', protect, admin, getAllFeedback);
router.put('/:id/read', protect, admin, markAsRead);

module.exports = router;
