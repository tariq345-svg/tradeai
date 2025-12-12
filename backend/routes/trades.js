const express = require('express');
const {
  getTrades,
  getTrade,
  createTrade,
  updateTrade,
  deleteTrade
} = require('../controllers/trades');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected by the 'protect' middleware
router.use(protect);

router.route('/')
  .get(getTrades)
  .post(createTrade);

router.route('/:id')
  .get(getTrade)
  .put(updateTrade)
  .delete(deleteTrade);

module.exports = router;
