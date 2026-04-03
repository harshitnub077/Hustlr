import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled', 'disputed'],
      default: 'pending',
    },
    escrowStatus: {
      type: String,
      enum: ['held', 'released', 'refunded'],
      default: 'held',
    },
    price: {
      type: Number,
      required: true,
    },
    deliveryTimeDays: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
    },
    requirements: {
      type: String,
      maxlength: 2000,
    },
    deliveryNote: {
      type: String,
    },
    deliveryUrl: {
      type: String,
    },
    // Mock Razorpay payment info
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Automatically set deadline when order starts
orderSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'in_progress' && !this.deadline) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + this.deliveryTimeDays);
    this.deadline = deadline;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
