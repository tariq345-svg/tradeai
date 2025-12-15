const express = require('express');
const {
  getTrades,
  getTrade,
  createTrade,
  updateTrade,
  deleteTrade,
  getTradesForCalendar
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

// Calendar route
console.log('Registering /calendar route');
router.route('/calendar')
  .get((req, res, next) => {
    console.log('GET /calendar route hit');
    console.log('Query params:', req.query);
    return getTradesForCalendar(req, res, next);
  });

module.exports = router;
