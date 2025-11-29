import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Define User model (guard to avoid OverwriteModelError when hot-reloading)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['brand', 'model'], required: true },
  contact: String,
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_say'], default: undefined },
  brandDesc: String,
  modelPortfolio: String,
  modelPhotos: [{ url: String, caption: String, dateAdded: { type: Date, default: Date.now } }],
  modelCertificate: String,
  skills: [String],
  experience: String,
  availability: { type: String, enum: ['full-time', 'part-time', 'freelance'], default: 'full-time' },
  location: String,
  pricePerDay: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password if modified
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and not already hashed
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const bookingSchema = new mongoose.Schema({
  modelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandName: { type: String, required: true },
  brandEmail: { type: String, required: true },
  contact: String,
  startDate: { type: Date, required: true },
  days: { type: Number, required: true, min: 1, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  archived: { type: Boolean, default: false },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash admin password if modified
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Check if password is already hashed
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema, 'students');
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema, 'bookings');
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema, 'admins');

export default { User, Booking, Admin };
