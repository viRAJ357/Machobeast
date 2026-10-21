import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://nikhilsinghaarya_db_user:Nikhil%40421@cluster0.ett3hxf.mongodb.net/machobeast?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'machobeast_super_secret_jwt_key_2026',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_TqVKnxrQktKDu9',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '05FZfea3kqsiloGw1Fb0XxAp'
};
