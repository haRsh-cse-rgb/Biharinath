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

    const pendingBookings = await Booking.find({ status: 'pending' })
      .sort({ preferredDate: 1 })
      .limit(5)
      .populate('userId', 'fullName email')
      .lean();

    return NextResponse.json({
      stats: {
        products: productsCount,
        orders: ordersCount,
        customers: usersCount,
        bookings: bookingsCount,
      },
      recentOrders,
      pendingBookings,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}
