import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connection = async () => {
  try {
    mongoose.connection.on('connected', () =>  console.log('MongoDB connected successfully'))
   

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
      process.exit(1);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    await mongoose.connect(process.env.MONGODB_URI);

  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connection;
