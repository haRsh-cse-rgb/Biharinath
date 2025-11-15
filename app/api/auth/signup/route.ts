import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    console.log('Signup: Starting...');

    const body = await request.json();
    const { email, password, fullName } = body;

    console.log('Signup: Received data for email:', email);

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Signup: Connecting to database...');
    await connectDB();
    console.log('Signup: Database connected');

    console.log('Signup: Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup: User already exists');
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    console.log('Signup: Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Signup: Creating user...');
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      role: 'customer',
    });
    console.log('Signup: User created with ID:', user._id);

    if (!process.env.JWT_SECRET) {
      console.error('Signup: JWT_SECRET is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Signup: Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Match cookie expiration
    );

    const response = NextResponse.json(
      {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || '',
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Determine cookie settings for production
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set cookie with appropriate settings
    // In production: secure=true (HTTPS required), sameSite='lax'
    // In development: secure=false, sameSite='lax'
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: isProduction, // Always secure in production (assumes HTTPS)
      sameSite: 'lax', // Works for same-site requests
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/', // Available for all paths
    });

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user.email, user.fullName).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    console.log('Signup: Success');
    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
