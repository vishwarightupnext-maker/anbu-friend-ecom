import mongoose from 'mongoose';
import colors from 'colors';

export let isDbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/varahi', {
      serverSelectionTimeoutMS: 3000
    });
    isDbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    isDbConnected = false;
    console.warn(`MongoDB Connection Notice: ${error.message}`.yellow);
    console.log('Backend will operate with high-speed in-memory store for instant demonstration & testing.'.cyan.bold);
  }
};

export default connectDB;
