import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    variant: mongoose.Schema.Types.Mixed,
  }],
}, { timestamps: true });

let Cart: any;

try {
  Cart = mongoose.model('Cart');
} catch {
  Cart = mongoose.model('Cart', CartSchema);
}

export default Cart;
