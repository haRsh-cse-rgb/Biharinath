import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query = userId ? { userId } : {};
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

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Booking error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
