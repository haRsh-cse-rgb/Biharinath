import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DecodedToken {
  userId: string;
  role: string;
}

function getAuthToken(request: Request) {
  const cookieStore = cookies();
  let token = cookieStore.get('auth-token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  return token;
}

async function requireAdmin(request: Request) {
  const token = getAuthToken(request);

  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decoded.role !== 'admin') {
      return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }
    return { decoded };
  } catch (error) {
    console.error('Admin reviews auth error:', error);
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const query: any = {};
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email')
      .populate('productId', 'name slug price images');

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Admin reviews fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  try {
    await connectDB();
    const body = await request.json();
    const { reviewId, action } = body;

    if (!reviewId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (action === 'approve') {
      const updated = await Review.findByIdAndUpdate(
        reviewId,
        { isApproved: true },
        { new: true }
      )
        .populate('userId', 'fullName email')
        .populate('productId', 'name slug');

      if (!updated) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Review approved', review: updated });
    } else {
      // reject -> delete review
      const deleted = await Review.findByIdAndDelete(reviewId);
      if (!deleted) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Review rejected and deleted' });
    }
  } catch (error: any) {
    console.error('Admin review update error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Admin review delete error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

