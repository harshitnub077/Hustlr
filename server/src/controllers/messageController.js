import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import Order from '../models/Order.js';

/**
 * @desc    Get messages for an order
 * @route   GET /api/messages/:orderId
 * @access  Private (Order participants)
 */
export const getMessages = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isParticipant =
    order.buyerId.toString() === req.user._id.toString() ||
    order.sellerId.toString() === req.user._id.toString();

  if (!isParticipant && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view messages for this order');
  }

  const messages = await Message.find({ orderId: req.params.orderId })
    .populate('sender', 'name profile.avatarUrl')
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

/**
 * @desc    Send a message (HTTP fallback — Socket.io is primary)
 * @route   POST /api/messages/:orderId
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isParticipant =
    order.buyerId.toString() === req.user._id.toString() ||
    order.sellerId.toString() === req.user._id.toString();

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const message = await Message.create({
    sender: req.user._id,
    orderId: req.params.orderId,
    content,
  });

  const populated = await message.populate('sender', 'name profile.avatarUrl');

  res.status(201).json({ success: true, message: populated });
});
