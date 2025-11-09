import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: Request) {
  try {
    console.log('Webhook: Received payment webhook');

    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Webhook: Missing signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Webhook: Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Webhook: Event type:', event.event);

    await connectDB();

    switch (event.event) {
      case 'payment.captured':
        const paymentId = event.payload.payment.entity.id;
        const orderId = event.payload.payment.entity.notes.orderNumber;

        console.log('Webhook: Payment captured for order:', orderId);

        await Order.findOneAndUpdate(
          { orderNumber: orderId },
          {
            paymentStatus: 'completed',
            status: 'processing',
            paymentId: paymentId,
          }
        );

        console.log('Webhook: Order updated successfully');
        break;

      case 'payment.failed':
        const failedOrderId = event.payload.payment.entity.notes.orderNumber;

        console.log('Webhook: Payment failed for order:', failedOrderId);

        await Order.findOneAndUpdate(
          { orderNumber: failedOrderId },
          {
            paymentStatus: 'failed',
            status: 'cancelled',
          }
        );
        break;

      default:
        console.log('Webhook: Unhandled event type:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
