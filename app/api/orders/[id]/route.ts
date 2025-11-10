import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Order from '@/models/Order';

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

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

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
