import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingApprovalEmail, sendBookingRejectionEmail } from '@/lib/email';

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    const { status, rejectionReason } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    ).populate('userId', 'fullName email');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Send approval/rejection email
    if (status === 'approved') {
      sendBookingApprovalEmail(booking, booking.email, booking.fullName).catch(err =>
        console.error('Failed to send approval email:', err)
      );
    } else if (status === 'rejected') {
      sendBookingRejectionEmail(booking, booking.email, booking.fullName, rejectionReason).catch(err =>
        console.error('Failed to send rejection email:', err)
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}