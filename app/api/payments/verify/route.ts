import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: Request) {
  try {
    console.log('Verify Payment: Starting...');

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    console.log('Verify Payment: Order ID:', razorpay_order_id);
    console.log('Verify Payment: Payment ID:', razorpay_payment_id);

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    console.log('Verify Payment: Signature Match:', razorpay_signature === expectedSign);

    if (razorpay_signature === expectedSign) {
      await connectDB();

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'completed',
          status: 'processing',
          paymentId: razorpay_payment_id,
        },
        { new: true }
      );

      console.log('Verify Payment: Order updated:', order.orderNumber);

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: order._id,
        orderNumber: order.orderNumber,
      });
    } else {
      console.error('Verify Payment: Invalid signature');

      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
        status: 'cancelled',
      });

      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
