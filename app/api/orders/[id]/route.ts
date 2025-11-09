import { NextResponse } from 'next/server';
import  connectToDB  from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Get Order: Fetching order with ID:', params.id);

    await connectToDB();

    const order = await Order.findById(params.id)
      .populate('user', 'email') // Populate user with email
      .populate({ path: 'items.productId', model: 'Product' }); // Populate product details in items

    if (!order) {
      console.log('Get Order: Order not found');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Get Order: Order found:', order.orderNumber);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Get Order Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
