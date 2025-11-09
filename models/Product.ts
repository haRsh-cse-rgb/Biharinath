import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: Number,
  images: [String],
  stockQuantity: { type: Number, default: 0 },
  sku: { type: String, required: true, unique: true },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  variants: mongoose.Schema.Types.Mixed,
  specifications: mongoose.Schema.Types.Mixed,
  unit: { type: String, default: 'kg' },
  organic: { type: Boolean, default: true },
}, { timestamps: true });

let Product: any;

try {
  Product = mongoose.model('Product');
} catch {
  Product = mongoose.model('Product', ProductSchema);
}

export default Product;
