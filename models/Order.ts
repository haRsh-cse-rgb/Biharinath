import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'], default: 'pending' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    productImage: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    variant: mongoose.Schema.Types.Mixed,
  }],
  subtotal: Number,
  taxAmount: { type: Number, default: 0 },
  shippingAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: Number,
  couponCode: String,
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentId: String,
  shippingAddress: mongoose.Schema.Types.Mixed,
  billingAddress: mongoose.Schema.Types.Mixed,
  courierName: String,
  trackingNumber: String,
  notes: String,
}, { timestamps: true });

let Order: any;

try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', OrderSchema);
}

export default Order;
