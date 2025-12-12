const Trade = require('../models/Trade');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const moment = require('moment');

// @desc    Get all trades for calendar
// @route   GET /api/v1/trades/calendar
// @access  Private
exports.getTradesForCalendar = asyncHandler(async (req, res, next) => {
  const { month } = req.query;
  
  // Set start and end dates for the month
  const startDate = moment(month).startOf('month').toDate();
  const endDate = moment(month).endOf('month').toDate();

  const trades = await Trade.find({
    user: req.user.id,
    entryDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort('entryDate');

  // Format data for calendar heatmap
  const calendarData = trades.reduce((acc, trade) => {
    const date = moment(trade.entryDate).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = {
        count: 0,
        profit: 0,
        trades: []
      };
    }
    acc[date].count += 1;
    acc[date].profit += trade.profitLoss || 0;
    acc[date].trades.push(trade._id);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: calendarData
  });
});

// @desc    Get all trades
// @route   GET /api/v1/trades
// @access  Private
exports.getTrades = asyncHandler(async (req, res, next) => {
  const trades = await Trade.find({ user: req.user.id }).sort('-entryDate');
  
  res.status(200).json({
    success: true,
    count: trades.length,
    data: trades
  });
});

// @desc    Get single trade
// @route   GET /api/v1/trades/:id
// @access  Private
exports.getTrade = asyncHandler(async (req, res, next) => {
  const trade = await Trade.findOne({ _id: req.params.id, user: req.user.id });

  if (!trade) {
    return next(
      new ErrorResponse(`Trade not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: trade
  });
});

// @desc    Create new trade
// @route   POST /api/v1/trades
// @access  Private
exports.createTrade = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const trade = await Trade.create(req.body);

  res.status(201).json({
    success: true,
    data: trade
  });
});

// @desc    Update trade
// @route   PUT /api/v1/trades/:id
// @access  Private
exports.updateTrade = asyncHandler(async (req, res, next) => {
  let trade = await Trade.findById(req.params.id);

  if (!trade) {
    return next(
      new ErrorResponse(`Trade not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is trade owner
  if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this trade`, 401)
    );
  }

  trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: trade
  });
});

// @desc    Delete trade
// @route   DELETE /api/v1/trades/:id
// @access  Private
exports.deleteTrade = asyncHandler(async (req, res, next) => {
  const trade = await Trade.findById(req.params.id);

  if (!trade) {
    return next(
      new ErrorResponse(`Trade not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is trade owner
  if (trade.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this trade`, 401)
    );
  }

  await trade.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
