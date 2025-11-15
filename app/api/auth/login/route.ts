import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    // Create response first
    const response = NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '',
        role: user.role,
      },
    });

    // Determine cookie settings for production
    // In production (Vercel, etc.), always use secure cookies with lax sameSite
    const isProduction = process.env.NODE_ENV === 'production';
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const url = new URL(request.url);
    const isHTTPS = forwardedProto === 'https' || url.protocol === 'https:';
    
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
    
    if (isProduction) {
      console.log('Login: Production cookie set', {
        secure: true,
        sameSite: 'lax',
        forwardedProto,
        protocol: url.protocol,
      });
    }

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
