import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: String,
  avatar: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

let User: any;

try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', UserSchema);
}

export default User;
