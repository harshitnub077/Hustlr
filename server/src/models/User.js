import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'company', 'admin'],
      default: 'student',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApprovedByAdmin: {
      type: Boolean,
      default: false,
    },
    // Student-specific fields
    collegeDetails: {
      collegeName: { type: String },
      eduEmail: { type: String },
      idCardUrl: { type: String },
    },
    // Company-specific fields
    companyDetails: {
      companyName: { type: String },
      website: { type: String },
      subscriptionActive: { type: Boolean, default: false },
    },
    // Shared profile
    profile: {
      bio: { type: String, maxlength: 500 },
      skills: [{ type: String }],
      avatarUrl: { type: String, default: '' },
      premiumBadge: { type: Boolean, default: false },
      location: { type: String },
      linkedIn: { type: String },
      github: { type: String },
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
