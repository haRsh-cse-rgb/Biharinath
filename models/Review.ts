import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

let Review: any;

try {
  Review = mongoose.model('Review');
} catch {
  Review = mongoose.model('Review', ReviewSchema);
}

export default Review;
