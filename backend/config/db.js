const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use direct connection string if .env fails to load
    const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tradeai';
    console.log('Connecting to MongoDB with:', connectionString);
    
    // Updated connection options for MongoDB 6.0+
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;