import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';

/**
 * @desc    Create an order (simulate escrow payment)
 * @route   POST /api/orders
 * @access  Private (Company / Verified Student)
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { gigId, requirements } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig || !gig.isActive) {
    res.status(404);
    throw new Error('Gig not found or no longer available');
  }

  if (gig.sellerId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot order your own gig');
  }

  // Mock escrow: payment is "held" immediately
  const order = await Order.create({
    buyerId: req.user._id,
    sellerId: gig.sellerId,
    gigId: gig._id,
    price: gig.price,
    deliveryTimeDays: gig.deliveryTimeDays,
    requirements,
    escrowStatus: 'held',
    paymentStatus: 'paid', // mock — assume instant payment
    paymentId: `mock_${Date.now()}`,
  });

  // Increment gig order count
  await Gig.findByIdAndUpdate(gigId, { $inc: { totalOrders: 1 } });

  res.status(201).json({ success: true, order });
});

/**
 * @desc    Get all orders for current user (buyer or seller)
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { role } = req.query; // 'buyer' or 'seller'
  const filter =
    role === 'seller' ? { sellerId: req.user._id } : { buyerId: req.user._id };

  const orders = await Order.find(filter)
    .populate('gigId', 'title images category')
    .populate('buyerId', 'name profile.avatarUrl')
    .populate('sellerId', 'name profile.avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
});

/**
 * @desc    Get a single order
 * @route   GET /api/orders/:id
 * @access  Private (Buyer or Seller of that order)
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('gigId', 'title description images')
    .populate('buyerId', 'name profile.avatarUrl email')
    .populate('sellerId', 'name profile.avatarUrl email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isParticipant =
    order.buyerId._id.toString() === req.user._id.toString() ||
    order.sellerId._id.toString() === req.user._id.toString();

  if (!isParticipant && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

/**
 * @desc    Seller accepts the order → status: in_progress
 * @route   PATCH /api/orders/:id/accept
 * @access  Private (Seller)
 */
export const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the seller can accept this order');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error(`Order is already ${order.status}`);
  }

  order.status = 'in_progress';
  await order.save();

  res.json({ success: true, message: 'Order accepted', order });
});

/**
 * @desc    Seller delivers the work
 * @route   PATCH /api/orders/:id/deliver
 * @access  Private (Seller)
 */
export const deliverOrder = asyncHandler(async (req, res) => {
  const { deliveryNote, deliveryUrl } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the seller can deliver this order');
  }

  if (order.status !== 'in_progress') {
    res.status(400);
    throw new Error('Order must be in progress to deliver');
  }

  order.deliveryNote = deliveryNote;
  order.deliveryUrl = deliveryUrl;
  order.status = 'completed';
  order.escrowStatus = 'released'; // Escrow released to seller
  await order.save();

  res.json({ success: true, message: 'Order delivered and escrow released', order });
});

/**
 * @desc    Buyer cancels the order (refund escrow)
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private (Buyer or Admin)
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isBuyer = order.buyerId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isBuyer && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  if (['completed', 'cancelled'].includes(order.status)) {
    res.status(400);
    throw new Error(`Order is already ${order.status}`);
  }

  order.status = 'cancelled';
  order.escrowStatus = 'refunded';
  await order.save();

  res.json({ success: true, message: 'Order cancelled and escrow refunded', order });
});

/**
 * @desc    Admin dashboard order stats
 * @route   GET /api/orders/stats
 * @access  Admin
 */
export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$price' },
      },
    },
  ]);

  res.json({ success: true, stats });
});
