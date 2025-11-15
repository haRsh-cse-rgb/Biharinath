import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Force dynamic rendering - cookies() requires dynamic context
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    console.log('Login: Starting...');

    const body = await request.json();
    const { email, password } = body;

    console.log('Login: Received data for email:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Login: Connecting to database...');
    await connectDB();
    console.log('Login: Database connected');

    console.log('Login: Finding user...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login: User not found');
      return NextResponse.json(
        { error: 'Wrong email', errorType: 'email' },
        { status: 401 }
      );
    }

    console.log('Login: Validating password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Login: Invalid password');
      return NextResponse.json(
        { error: 'Wrong password', errorType: 'password' },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('Login: JWT_SECRET is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Login: Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Match cookie expiration
    );

    // Create response with token in body for localStorage fallback
    const response = NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '',
        role: user.role,
      },
      token: token, // Include token in response for localStorage fallback
    });

    // Try to set cookie - but don't rely on it alone
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
    
    // Set cookie with proper settings (try both secure and non-secure for compatibility)
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
    
    console.log('Login: Cookie set', {
      secure: useSecure,
      sameSite: 'lax',
      isProduction,
      isHTTPS,
      forwardedProto,
      origin,
    });

    console.log('Login: Success');
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}
