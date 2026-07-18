import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: Number(process.env.PORT ?? 5000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/studymate',
  JWT_SECRET: process.env.JWT_SECRET ?? 'development-secret',
};

export default env;
