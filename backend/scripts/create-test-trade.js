require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Trade = require('../models/Trade');
const User = require('../models/User');

const createTestTrade = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tradeai', {
      serverSelectionTimeoutMS: 5000,
    });

    // Get the first user (admin)
    const user = await User.findOne();
    
    if (!user) {
      console.error('No users found. Please create a user first.');
      process.exit(1);
    }

    // Create a test trade
    const trade = await Trade.create({
      user: user._id,
      symbol: 'BTCUSDT',
      tradeType: 'LONG',
      entryPrice: 50000,
      quantity: 0.1,
      stopLoss: 48000,
      takeProfit: 55000,
      notes: 'Test trade',
      status: 'open'
    });

    console.log('Test trade created:');
    console.log(trade);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test trade:', error.message);
    process.exit(1);
  }
};

createTestTrade();
