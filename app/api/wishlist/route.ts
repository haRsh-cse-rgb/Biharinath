import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

export async function GET(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
    return NextResponse.json(wishlist || { items: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// Toggle wishlist item
export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { userId, productId } = body as { userId: string; productId: string };
    if (!userId || !productId) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [{ productId }] });
    } else {
      const index = wishlist.items.findIndex((it: any) => it.productId.toString() === productId);
      if (index > -1) {
        wishlist.items.splice(index, 1);
      } else {
        wishlist.items.push({ productId });
      }
      await wishlist.save();
    }

    const populated = await Wishlist.findOne({ userId }).populate('items.productId');
    return NextResponse.json(populated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}

