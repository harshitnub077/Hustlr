import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Gig title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Gig description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'web-development',
        'mobile-development',
        'ui-ux-design',
        'graphic-design',
        'content-writing',
        'video-editing',
        'data-science',
        'digital-marketing',
        'photography',
        'other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [50, 'Minimum price is ₹50'],
    },
    deliveryTimeDays: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: [1, 'Minimum delivery time is 1 day'],
    },
    images: [{ type: String }],
    tags: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Full-text search index
gigSchema.index({ title: 'text', description: 'text', tags: 'text' });
gigSchema.index({ category: 1, price: 1 });

const Gig = mongoose.model('Gig', gigSchema);
export default Gig;
