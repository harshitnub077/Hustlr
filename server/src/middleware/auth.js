import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Protect routes — verifies JWT token from Authorization header or cookie.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — user not found');
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — invalid token');
  }
});

/**
 * Restrict access to specific roles.
 * Usage: restrictTo('admin', 'company')
 */
export const restrictTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied — role '${req.user.role}' is not permitted`);
    }
    next();
  });

/**
 * Requires that a student account is approved by admin before access.
 */
export const requireApproved = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'student' && !req.user.isApprovedByAdmin) {
    res.status(403);
    throw new Error('Your account is pending admin approval');
  }
  next();
});
