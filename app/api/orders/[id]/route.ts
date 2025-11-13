import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { sendOrderCancellationEmail, sendOrderShippedEmail, sendOrderOutForDeliveryEmail, sendOrderDeliveredEmail } from '@/lib/email';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const order = await Order.findById(params.id)
      .populate('userId', 'fullName email phone')
      .populate({ path: 'items.productId', model: 'Product' });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const body = await request.json();
    const { status, paymentStatus } = body as { status?: string; paymentStatus?: string };

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isBeingCancelled = status === 'cancelled' && order.status !== 'cancelled';
    const isBeingShipped = status === 'shipped' && order.status !== 'shipped';
    const isBeingOutForDelivery = status === 'out_for_delivery' && order.status !== 'out_for_delivery';
    const isBeingDelivered = status === 'delivered' && order.status !== 'delivered';

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // Get user info for email sending
    const user = await User.findById(order.userId);
    
    if (user) {
      const populatedOrder = await Order.findById(params.id)
        .populate('userId', 'fullName email phone')
        .populate({ path: 'items.productId', model: 'Product' });

      // Send cancellation email if order is being cancelled
      if (isBeingCancelled) {
        sendOrderCancellationEmail(populatedOrder, user.email, user.fullName).catch(err =>
          console.error('Failed to send cancellation email:', err)
        );
      }

      // Send shipped email if order status changes to shipped
      if (isBeingShipped) {
        sendOrderShippedEmail(populatedOrder, user.email, user.fullName).catch(err =>
          console.error('Failed to send shipped email:', err)
        );
      }

      // Send out for delivery email if order status changes to out_for_delivery
      if (isBeingOutForDelivery) {
        sendOrderOutForDeliveryEmail(populatedOrder, user.email, user.fullName).catch(err =>
          console.error('Failed to send out for delivery email:', err)
        );
      }

      // Send delivered email if order status changes to delivered
      if (isBeingDelivered) {
        sendOrderDeliveredEmail(populatedOrder, user.email, user.fullName).catch(err =>
          console.error('Failed to send delivered email:', err)
        );
      }
    }

    const updated = await Order.findById(params.id)
      .populate('userId', 'fullName email phone')
      .populate({ path: 'items.productId', model: 'Product' });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
