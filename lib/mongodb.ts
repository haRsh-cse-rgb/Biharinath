import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('Creating new MongoDB connection to:', MONGODB_URI.split('@')[1]);
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    console.log('Awaiting MongoDB connection...');
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
  } catch (e: any) {
    console.error('MongoDB connection failed:', e.message);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
