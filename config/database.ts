import mongoose from 'mongoose';
import env from '@/config/environment';

export const connectDatabase = async (): Promise<void> => {
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  await mongoose.connect(env.MONGO_URI);
};
