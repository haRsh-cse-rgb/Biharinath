import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { sendOrderConfirmationEmail } from '@/lib/email';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    console.log('Create Order: Starting...');

    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const body = await request.json();
    const { shippingAddress, paymentMethod } = body;

    console.log('Create Order: User ID:', userId);
    console.log('Create Order: Payment Method:', paymentMethod);

    await connectDB();

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = cart.items.map((item: any) => {
      const unitPrice = Number(item.productId?.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const itemTotal = unitPrice * quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId._id,
        productName: item.productId.name,
        productImage: item.productId.images?.[0] || '',
        unitPrice,
        quantity,
        totalPrice: itemTotal,
      };
    });

    // const shippingAmount = subtotal >= 500 ? 0 : 50;
    const shippingAmount = 0; // Testing - shipping disabled
    const taxAmount = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + shippingAmount + taxAmount;

    const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();

    console.log('Create Order: Order Number:', orderNumber);
    console.log('Create Order: Total Amount:', totalAmount);

    const orderData = {
      userId,
      orderNumber,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingAmount,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'pending',
    };

    if (paymentMethod === 'razorpay') {
      console.log('Create Order: Creating Razorpay order...');

      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          userId: userId.toString(),
          orderNumber,
        },
      });

      console.log('Create Order: Razorpay Order ID:', razorpayOrder.id);

      const order = await Order.create({
        ...orderData,
        paymentId: razorpayOrder.id,
      });

      await Cart.findOneAndUpdate({ userId }, { items: [] });

      return NextResponse.json({
        success: true,
        orderId: order._id,
        orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: 'INR',
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      });
    } else {
      console.log('Create Order: COD order...');

      const order = await Order.create(orderData);

      await Cart.findOneAndUpdate({ userId }, { items: [] });

      // Send order confirmation email for COD
      const user = await User.findById(userId);
      if (user) {
        sendOrderConfirmationEmail(order, user.email, user.fullName).catch(err =>
          console.error('Failed to send order confirmation email:', err)
        );
      }

      return NextResponse.json({
        success: true,
        orderId: order._id,
        orderNumber,
        message: 'Order placed successfully',
      });
    }
  } catch (error: any) {
    console.error('Create Order Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
