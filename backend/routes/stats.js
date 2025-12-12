const express = require('express');
const { getStats } = require('../controllers/stats');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected by the 'protect' middleware
router.use(protect);

router.route('/').get(getStats);

module.exports = router;
