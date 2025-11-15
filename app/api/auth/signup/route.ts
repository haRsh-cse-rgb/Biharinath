import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/email';

// Force dynamic rendering - cookies() requires dynamic context
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Include token in response for localStorage fallback
    const response = NextResponse.json(
      {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || '',
          role: user.role,
        },
        token: token, // Include token for localStorage fallback
      },
      { status: 201 }
    );

    // Determine cookie settings - check for HTTPS properly
    const isProduction = process.env.NODE_ENV === 'production';
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const origin = request.headers.get('origin');
    const url = new URL(request.url);
    
    // Check if request is over HTTPS
    const isHTTPS = 
      forwardedProto === 'https' || 
      url.protocol === 'https:' ||
      (origin && origin.startsWith('https://'));
    
    // In production, use secure cookies only if HTTPS is confirmed
    // Ensure it's always a boolean, not null or empty string
    const useSecure: boolean = Boolean(isProduction && isHTTPS);
    
    // Set cookie with proper settings
    try {
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: useSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    } catch (error) {
      console.error('Failed to set cookie:', error);
    }

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
