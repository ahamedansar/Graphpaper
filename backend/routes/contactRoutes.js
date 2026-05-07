const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markContactRead } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, admin, getContacts);
router.put('/:id/read', protect, admin, markContactRead);

module.exports = router;
