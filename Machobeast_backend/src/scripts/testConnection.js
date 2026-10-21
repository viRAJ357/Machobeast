import mongoose from 'mongoose';
import { connectDB, pingDB, disconnectDB } from '../config/db.js';
import { ENV } from '../config/env.js';

const testDatabase = async () => {
  console.log('\n======================================================');
  console.log('   MachoBeast Production Database Connection Tester   ');
  console.log('======================================================\n');
  
  const sanitizedUri = ENV.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`[Config] Target URI: ${sanitizedUri}`);
  console.log(`[Config] Environment: ${ENV.NODE_ENV}`);

  const start = Date.now();

  try {
    console.log('\n[1/3] Connecting to MongoDB...');
    const conn = await connectDB();

    console.log('\n[2/3] Measuring Connection Latency (Ping)...');
    const { status, latency } = await pingDB();
    console.log(`[Ping] Status: ${status} | Latency: ${latency}`);

    console.log('\n[3/3] Inspecting Database Collections & Stats...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`[Stats] Total Collections: ${collections.length}`);
    collections.forEach((c) => console.log(`   - ${c.name}`));

    const totalTime = Date.now() - start;
    console.log('\n------------------------------------------------------');
    console.log(` SUCCESS: MongoDB is ready for production (${totalTime}ms)`);
    console.log('------------------------------------------------------\n');
  } catch (error) {
    console.error('\n------------------------------------------------------');
    console.error(` FAILURE: Could not connect to MongoDB: ${error.message}`);
    console.error('------------------------------------------------------');
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP -> 0.0.0.0/0).');
    console.log('2. Check username and password in your MONGODB_URI in .env.');
    console.log('3. Ensure your local MongoDB service is running if testing locally.\n');
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

testDatabase();
