import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Force dynamic rendering - cookies() requires dynamic context
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get('auth-token')?.value;

    // If no cookie token, check Authorization header (for localStorage fallback)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // Debug logging in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Auth check: Token present:', !!token, 'Source:', token ? (cookieStore.get('auth-token')?.value ? 'cookie' : 'header') : 'none');
    }

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        role: string;
      };

      await connectDB();
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || '',
          role: user.role,
        },
      });
    } catch (jwtError: any) {
      console.error('Auth check: JWT verification failed:', jwtError.message);
      return NextResponse.json({ user: null });
    }
  } catch (error: any) {
    console.error('Auth check error:', error.message);
    return NextResponse.json({ user: null });
  }
}
