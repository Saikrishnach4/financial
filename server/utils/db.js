// server/utils/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://saikrishnachippa4:saikrishna@financialapp.c07frso.mongodb.net/financial?retryWrites=true&w=majority&appName=financialapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
