import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissionUrl: { type: String },
  submittedAt: { type: Date, default: Date.now },
  note: { type: String },
});

const challengeSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    reward: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'web-development',
        'mobile-development',
        'ui-ux-design',
        'graphic-design',
        'content-writing',
        'data-science',
        'other',
      ],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'judging', 'completed'],
      default: 'open',
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
