import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env.js';

// Ensure robust SRV resolution on Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if permissions or platform restricts custom servers
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('[MachoBeast DB] Using existing database connection');
    return mongoose.connection;
  }

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
  };

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, options);
    isConnected = !!conn.connections[0].readyState;

    console.log(`[MachoBeast DB] MongoDB Connected Successfully!`);
    console.log(`[MachoBeast DB] Host: ${conn.connection.host}`);
    console.log(`[MachoBeast DB] Database Name: ${conn.connection.name}`);

    // Connection Events
    mongoose.connection.on('error', (err) => {
      console.error(`[MachoBeast DB Runtime Error] ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MachoBeast DB Warning] MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MachoBeast DB Success] MongoDB reconnected successfully');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    console.error(`[MachoBeast DB Critical] Connection to MongoDB failed: ${error.message}`);
    if (ENV.NODE_ENV === 'production') {
      console.error('[MachoBeast DB Error] Please verify MONGO_URI in environment variables.');
    }
    throw error;
  }
};

// Ping database to verify health and measure latency in ms
export const pingDB = async () => {
  const startTime = Date.now();
  if (mongoose.connection.readyState !== 1) {
    return { status: 'disconnected', latency: null };
  }
  await mongoose.connection.db.admin().ping();
  const latency = Date.now() - startTime;
  return { status: 'connected', latency: `${latency}ms` };
};

// Graceful database disconnection
export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('[MachoBeast DB] MongoDB connection closed gracefully');
  }
};

// Clean exit on process termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
