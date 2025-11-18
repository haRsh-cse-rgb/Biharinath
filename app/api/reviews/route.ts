import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { sendReviewConfirmationEmail } from '@/lib/email';

// Force dynamic rendering - cookies() requires dynamic context
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const rating = searchParams.get('rating');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Determine requesting user (for showing their pending review)
    const cookieStore = cookies();
    let token = cookieStore.get('auth-token')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    let userIdFilter: string | null = null;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userIdFilter = decoded.userId;
      } catch (err) {
        console.warn('Review GET: Invalid token provided');
      }
    }

    const query: any = { productId };

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (userIdFilter) {
      query.$or = [
        { isApproved: true },
        { userId: userIdFilter }
      ];
    } else {
      query.isApproved = true;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const cookieStore = cookies();
    let token = cookieStore.get('auth-token')?.value;

    // If no cookie token, check Authorization header (for localStorage fallback)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const body = await request.json();
    const { productId, rating, title, comment, images } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Product ID, rating, and comment are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      title: title || '',
      comment,
      images: images || [],
      isApproved: false,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'fullName email');

    // Send review confirmation email
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (user && product) {
      sendReviewConfirmationEmail(
        populatedReview,
        user.email,
        user.fullName,
        product.name
      ).catch(err =>
        console.error('Failed to send review confirmation email:', err)
      );
    }

    return NextResponse.json({
      review: populatedReview,
      message: 'Review submitted and awaiting approval',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: error.message || 'Failed to create review' }, { status: 500 });
  }
}

