import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Gig from '../models/Gig.js';

/**
 * @desc    Create a review after a completed order
 * @route   POST /api/reviews
 * @access  Private (Buyer)
 */
export const createReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.buyerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the buyer can review this order');
  }

  if (order.status !== 'completed') {
    res.status(400);
    throw new Error('You can only review a completed order');
  }

  const existing = await Review.findOne({ orderId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this order');
  }

  const review = await Review.create({
    orderId,
    reviewerId: req.user._id,
    reviewedUserId: order.sellerId,
    gigId: order.gigId,
    rating,
    comment,
  });

  // Update seller's average rating
  const reviews = await Review.find({ reviewedUserId: order.sellerId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await User.findByIdAndUpdate(order.sellerId, {
    averageRating: Math.round(avg * 10) / 10,
    totalReviews: reviews.length,
  });

  // Update gig's average rating
  const gigReviews = await Review.find({ gigId: order.gigId });
  const gigAvg = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length;
  await Gig.findByIdAndUpdate(order.gigId, {
    averageRating: Math.round(gigAvg * 10) / 10,
    totalReviews: gigReviews.length,
  });

  res.status(201).json({ success: true, review });
});

/**
 * @desc    Get reviews for a seller
 * @route   GET /api/reviews/seller/:sellerId
 * @access  Public
 */
export const getReviewsBySeller = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewedUserId: req.params.sellerId })
    .populate('reviewerId', 'name profile.avatarUrl')
    .populate('gigId', 'title')
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});

/**
 * @desc    Get reviews for a gig
 * @route   GET /api/reviews/gig/:gigId
 * @access  Public
 */
export const getReviewsByGig = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ gigId: req.params.gigId })
    .populate('reviewerId', 'name profile.avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});
