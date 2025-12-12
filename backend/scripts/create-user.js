require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Get command line arguments
const [email, password, username] = process.argv.slice(2);

if (!email || !password || !username) {
  console.error('Please provide email, password, and username');
  console.log('Usage: node scripts/create-user.js <email> <password> <username>');
  process.exit(1);
}

const createUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tradeai', {
      serverSelectionTimeoutMS: 5000,
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('User already exists with this email');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword, // Store hashed password
      username,
      role: 'admin'
    });

    console.log('User created successfully:');
    console.log(`Email: ${user.email}`);
    console.log(`Username: ${user.username}`);
    console.log(`Role: ${user.role}`);
    console.log('ID:', user._id);
    console.log('Password (plaintext for reference only, not stored):', password);

    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
};

createUser();
