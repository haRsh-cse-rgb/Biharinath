import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { sendReviewConfirmationEmail } from '@/lib/email';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const review = await Review.findById(params.id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: 'You can only update your own reviews' }, { status: 403 });
    }

    const body = await request.json();
    const { rating, title, comment, images } = body;

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
      }
      review.rating = rating;
    }

    if (title !== undefined) review.title = title || '';
    if (comment !== undefined) {
      if (!comment || !comment.trim()) {
        return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
      }
      review.comment = comment;
    }
    if (images !== undefined) review.images = images || [];

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'fullName email');

    // Send updated review confirmation email
    const user = await User.findById(userId);
    const product = await Product.findById(review.productId);
    if (user && product) {
      sendReviewConfirmationEmail(
        populatedReview,
        user.email,
        user.fullName,
        product.name
      ).catch(err =>
        console.error('Failed to send review update email:', err)
      );
    }

    return NextResponse.json(populatedReview);
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: error.message || 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const review = await Review.findById(params.id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: 'You can only delete your own reviews' }, { status: 403 });
    }

    await Review.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}

