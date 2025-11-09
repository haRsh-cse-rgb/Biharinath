import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

let Category: any;

try {
  Category = mongoose.model('Category');
} catch {
  Category = mongoose.model('Category', CategorySchema);
}

export default Category;
