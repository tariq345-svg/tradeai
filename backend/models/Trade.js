const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: [true, 'Please add a symbol'],
    uppercase: true,
    trim: true
  },
  tradeType: {
    type: String,
    required: [true, 'Please specify trade type'],
    enum: ['LONG', 'SHORT']
  },
  entryPrice: {
    type: Number,
    required: [true, 'Please add an entry price'],
    min: [0, 'Price must be a positive number']
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  exitPrice: {
    type: Number,
    min: [0, 'Price must be a positive number']
  },
  exitDate: {
    type: Date
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [0, 'Quantity must be a positive number']
  },
  stopLoss: {
    type: Number,
    min: [0, 'Stop loss must be a positive number']
  },
  takeProfit: {
    type: Number,
    min: [0, 'Take profit must be a positive number']
  },
  notes: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  riskReward: {
    type: Number
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate profit/loss before saving
TradeSchema.pre('save', function(next) {
  if (this.isModified('exitPrice') && this.exitPrice && this.entryPrice) {
    const multiplier = this.tradeType === 'LONG' ? 1 : -1;
    this.profitLoss = (this.exitPrice - this.entryPrice) * this.quantity * multiplier;
    
    // Calculate risk/reward if stop loss is set
    if (this.stopLoss) {
      const risk = Math.abs(this.entryPrice - this.stopLoss) * this.quantity;
      const reward = Math.abs(this.exitPrice - this.entryPrice) * this.quantity;
      this.riskReward = reward / risk;
    }
  }
  next();
});

module.exports = mongoose.model('Trade', TradeSchema);
