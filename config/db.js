import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export default async function connectDB(){
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err);
      process.exit(1);
    }
  };
