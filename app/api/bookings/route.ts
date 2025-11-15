import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { sendBookingConfirmationEmail } from '@/lib/email';

// Force dynamic rendering - cookies() requires dynamic context
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    let query: any = {};
    
    // If userId is provided, filter by userId
    if (userId) {
      query.userId = userId;
    } 
    // If email is provided, filter by email
    else if (email) {
      query.email = email;
    }
    // If no params, try to get from auth token
    else {
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

        if (token) {
          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const user = await User.findById(decoded.userId);
          if (user) {
            // If user is admin, return all bookings
            if (user.role === 'admin') {
              query = {}; // No filter, return all bookings
            } else {
              // Filter by both userId and email to catch all bookings for this user
              query.$or = [
                { userId: decoded.userId },
                { email: user.email }
              ];
            }
          }
        } else {
          // No token, return empty array
          return NextResponse.json([]);
        }
      } catch (err) {
        // If no auth, return empty array
        return NextResponse.json([]);
      }
    }

    const bookings = await Booking.find(query).populate('userId').sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('Booking: Starting...');
    await connectDB();
    console.log('Booking: Database connected');

    const body = await request.json();
    console.log('Booking: Received data:', body);

    const bookingNumber = 'VISIT' + Date.now();
    console.log('Booking: Creating booking with number:', bookingNumber);

    const booking = await Booking.create({ ...body, bookingNumber });
    console.log('Booking: Created successfully:', booking._id);

    // Send booking confirmation email
    sendBookingConfirmationEmail(booking, body.email, body.fullName).catch(err =>
      console.error('Failed to send booking confirmation email:', err)
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Booking error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
