require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Connection string from .env:', process.env.MONGODB_URI);

// Use a fallback connection string if .env is not loaded
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tradeai';
console.log('Using connection string:', connectionString);

// Updated connection options for MongoDB 6.0+
const connectWithRetry = async () => {
  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();
