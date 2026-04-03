import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Order from '../models/Order.js';
import cloudinaryClient from '../config/cloudinary.js';
import streamifier from 'streamifier';

/**
 * @desc    Get public profile of a user
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password -collegeDetails.idCardUrl'
  );
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

/**
 * @desc    Update own profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { name, profile, companyDetails, collegeDetails } = req.body;

  if (name) user.name = name;
  if (profile) {
    user.profile = { ...user.profile.toObject(), ...profile };
  }
  if (companyDetails && user.role === 'company') {
    user.companyDetails = { ...user.companyDetails.toObject(), ...companyDetails };
  }
  if (collegeDetails && user.role === 'student') {
    user.collegeDetails = { ...user.collegeDetails.toObject(), ...collegeDetails };
  }

  const updated = await user.save();
  res.json({ success: true, user: updated });
});

/**
 * @desc    Upload avatar
 * @route   POST /api/users/avatar
 * @access  Private
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const uploadStream = (buffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinaryClient.uploader.upload_stream(
        { folder: 'hustlr/avatars', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

  const result = await uploadStream(req.file.buffer);

  await User.findByIdAndUpdate(req.user._id, { 'profile.avatarUrl': result.secure_url });

  res.json({ success: true, avatarUrl: result.secure_url });
});

/**
 * @desc    Get all students (admin)
 * @route   GET /api/users
 * @access  Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, isApprovedByAdmin, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isApprovedByAdmin !== undefined) filter.isApprovedByAdmin = isApprovedByAdmin === 'true';

  const users = await User.find(filter)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);
  res.json({ success: true, total, page: Number(page), users });
});

/**
 * @desc    Admin approves a student account
 * @route   PATCH /api/users/:id/approve
 * @access  Admin
 */
export const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApprovedByAdmin: true },
    { new: true }
  ).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, message: 'User approved', user });
});

/**
 * @desc    Admin suspends a user
 * @route   PATCH /api/users/:id/suspend
 * @access  Admin
 */
export const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApprovedByAdmin: false },
    { new: true }
  ).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, message: 'User suspended', user });
});
