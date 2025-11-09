import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI?.split('@')[1]);

    const MONGODB_URI = process.env.MONGODB_URI!;

    if (!MONGODB_URI) {
      return NextResponse.json({
        error: 'MONGODB_URI not found in environment variables'
      }, { status: 500 });
    }

    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    console.log('Current connection state:', states[connectionState as keyof typeof states]);

    if (connectionState === 1) {
      return NextResponse.json({
        success: true,
        message: 'Already connected to MongoDB',
        state: states[connectionState as keyof typeof states],
        database: mongoose.connection.db?.databaseName
      });
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    };

    console.log('Attempting to connect...');
    const start = Date.now();

    await mongoose.connect(MONGODB_URI, opts);

    const duration = Date.now() - start;
    console.log('Connected successfully in', duration, 'ms');

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      connectionTime: `${duration}ms`,
      database: mongoose.connection.db?.databaseName,
      state: 'connected'
    });

  } catch (error: any) {
    console.error('MongoDB connection test failed:', error.message);
    console.error('Full error:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        stack: error.stack?.split('\n').slice(0, 3)
      }
    }, { status: 500 });
  }
}
