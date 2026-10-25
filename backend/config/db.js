import mongoose from 'mongoose';
import { ensureAdminUser } from '../controllers/authController.js';

let isConnected = false;

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;

  if (!connUri) {
    console.log('[MongoDB Notice]: MONGODB_URI not specified. Using default local uri: mongodb://127.0.0.1:27017/portfolio_db');
  }

  const targetUri = connUri || 'mongodb://127.0.0.1:27017/portfolio_db';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    await ensureAdminUser();
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️  [MongoDB Warning]: Could not connect to MongoDB (${error.message}).`);
    console.log(`💡 [Tip]: When deploying to Render, provide your MongoDB Atlas cluster URI in the MONGODB_URI environment variable.`);
  }
};

export const getDBStatus = () => isConnected;
