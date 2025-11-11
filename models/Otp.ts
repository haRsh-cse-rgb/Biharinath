import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-delete expired OTPs after 10 minutes
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

let Otp: any;

try {
  Otp = mongoose.model('Otp');
} catch {
  Otp = mongoose.model('Otp', OtpSchema);
}

export default Otp;

