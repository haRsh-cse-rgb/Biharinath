import { NextResponse } from 'next/server';
import  connectToDB from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function GET(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { userId, productId, quantity } = body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
      await cart.save();
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { userId, productId, quantity } = body as { userId: string; productId: string; quantity: number };

    if (!userId || !productId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    cart.items[itemIndex].quantity = Math.max(1, quantity);
    await cart.save();
    const populated = await Cart.findOne({ userId }).populate('items.productId');
    return NextResponse.json(populated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 });
  }
}