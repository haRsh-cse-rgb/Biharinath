import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  preferredTimeSlot: { type: String, required: true },
  numberOfGuests: { type: Number, default: 1 },
  notes: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: String,
}, { timestamps: true });

let Booking: any;

try {
  Booking = mongoose.model('Booking');
} catch {
  Booking = mongoose.model('Booking', BookingSchema);
}

export default Booking;
