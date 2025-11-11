import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const body = await request.json();
    const { fullName, phone } = body;

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

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
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

