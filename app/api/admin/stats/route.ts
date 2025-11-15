import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import Booking from '@/models/Booking';

export async function GET() {
  try {
    await dbConnect();

    const [productsCount, ordersCount, usersCount, bookingsCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments(),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email')
      .lean();

    // Fetch pending bookings
    const pendingBookings = await Booking.find({ status: 'pending' })
      .sort({ preferredDate: 1 })
      .limit(5)
      .populate('userId', 'fullName email')
      .lean();
    
    console.log('Admin Stats: Found pending bookings:', pendingBookings.length);
    
    // Convert to plain objects and ensure user data is available
    const bookingsData = pendingBookings.map((booking: any) => {
      return {
        ...booking,
        // Ensure we have fullName and email from either populated user or booking itself
        fullName: booking.userId?.fullName || booking.fullName,
        email: booking.userId?.email || booking.email,
        // Keep the user object for compatibility
        user: booking.userId ? {
          fullName: booking.userId.fullName,
          email: booking.userId.email,
        } : undefined,
      };
    });

    return NextResponse.json({
      stats: {
        products: productsCount,
        orders: ordersCount,
        customers: usersCount,
        bookings: bookingsCount,
      },
      recentOrders,
      pendingBookings: bookingsData,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}
