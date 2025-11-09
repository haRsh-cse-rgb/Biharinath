import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minPurchaseAmount: Number,
  maxDiscountAmount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

let Coupon: any;

try {
  Coupon = mongoose.model('Coupon');
} catch {
  Coupon = mongoose.model('Coupon', CouponSchema);
}

export default Coupon;
