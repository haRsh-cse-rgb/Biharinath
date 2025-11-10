import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  }],
}, { timestamps: true });

let Wishlist: any;

try {
  Wishlist = mongoose.model('Wishlist');
} catch {
  Wishlist = mongoose.model('Wishlist', WishlistSchema);
}

export default Wishlist;

