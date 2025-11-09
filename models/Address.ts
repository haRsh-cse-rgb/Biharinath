import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['shipping', 'billing'], required: true },
  fullName: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: { type: String, default: 'India' },
  isDefault: Boolean,
}, { timestamps: true });

let Address: any;

try {
  Address = mongoose.model('Address');
} catch {
  Address = mongoose.model('Address', AddressSchema);
}

export default Address;
