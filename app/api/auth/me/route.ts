import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const token = cookieStore.get('auth-token')?.value;

    // Debug logging in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Auth check: Cookies received:', allCookies.map(c => c.name));
      console.log('Auth check: Token present:', !!token);
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
