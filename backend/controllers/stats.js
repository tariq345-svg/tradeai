const mongoose = require('mongoose');
const Trade = require('../models/Trade');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get dashboard statistics
// @route   GET /api/v1/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Get total trades count
  const totalTrades = await Trade.countDocuments({ user: userId });

  // Get winning and losing trades
  const [winningTrades, losingTrades] = await Promise.all([
    Trade.countDocuments({ user: userId, profitLoss: { $gt: 0 } }),
    Trade.countDocuments({ user: userId, profitLoss: { $lt: 0 } })
  ]);

  // Get win rate
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // Get total profit/loss
  const result = await Trade.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$profitLoss' } } }
  ]);
  
  const totalProfitLoss = result.length > 0 ? result[0].total : 0;

  // Get monthly performance (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyPerformance = await Trade.aggregate([
    { 
      $match: { 
        user: new mongoose.Types.ObjectId(userId),
        entryDate: { $gte: sixMonthsAgo }
      } 
    },
    {
      $group: {
        _id: { 
          year: { $year: '$entryDate' },
          month: { $month: '$entryDate' }
        },
        profit: { $sum: '$profitLoss' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: parseFloat(winRate.toFixed(2)),
      totalProfitLoss,
      monthlyPerformance
    }
  });
});
