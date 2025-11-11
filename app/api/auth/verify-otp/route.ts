import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Otp from '@/models/Otp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const otpRecord = await Otp.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}

