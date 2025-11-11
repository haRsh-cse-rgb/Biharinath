import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

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
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
