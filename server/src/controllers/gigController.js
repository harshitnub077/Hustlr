import asyncHandler from 'express-async-handler';
import Gig from '../models/Gig.js';
import cloudinaryClient from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadImageToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinaryClient.uploader.upload_stream(
      { folder: 'hustlr/gigs' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * @desc    Create a gig
 * @route   POST /api/gigs
 * @access  Private (Student)
 */
export const createGig = asyncHandler(async (req, res) => {
  const { title, description, category, price, deliveryTimeDays, tags } = req.body;

  let images = [];
  if (req.files && req.files.length > 0) {
    images = await Promise.all(req.files.map((f) => uploadImageToCloudinary(f.buffer)));
  }

  const gig = await Gig.create({
    sellerId: req.user._id,
    title,
    description,
    category,
    price: Number(price),
    deliveryTimeDays: Number(deliveryTimeDays),
    tags: tags ? JSON.parse(tags) : [],
    images,
  });

  res.status(201).json({ success: true, gig });
});

/**
 * @desc    Get all gigs with search & filter
 * @route   GET /api/gigs
 * @access  Public
 */
export const getGigs = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const filter = { isActive: true };

  if (q) {
    filter.$text = { $search: q };
  }
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortQuery = { createdAt: -1 };
  if (sort === 'price_asc') sortQuery = { price: 1 };
  if (sort === 'price_desc') sortQuery = { price: -1 };
  if (sort === 'rating') sortQuery = { averageRating: -1 };

  const gigs = await Gig.find(filter)
    .populate('sellerId', 'name profile.avatarUrl profile.premiumBadge averageRating')
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Gig.countDocuments(filter);

  res.json({ success: true, total, page: Number(page), gigs });
});

/**
 * @desc    Get a single gig
 * @route   GET /api/gigs/:id
 * @access  Public
 */
export const getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate(
    'sellerId',
    'name profile averageRating totalReviews createdAt'
  );

  if (!gig || !gig.isActive) {
    res.status(404);
    throw new Error('Gig not found');
  }

  res.json({ success: true, gig });
});

/**
 * @desc    Update own gig
 * @route   PUT /api/gigs/:id
 * @access  Private (Owner)
 */
export const updateGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  if (gig.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this gig');
  }

  const allowed = ['title', 'description', 'category', 'price', 'deliveryTimeDays', 'tags'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) gig[field] = req.body[field];
  });

  const updated = await gig.save();
  res.json({ success: true, gig: updated });
});

/**
 * @desc    Delete (deactivate) own gig
 * @route   DELETE /api/gigs/:id
 * @access  Private (Owner)
 */
export const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  if (gig.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this gig');
  }

  gig.isActive = false;
  await gig.save();

  res.json({ success: true, message: 'Gig removed' });
});

/**
 * @desc    Get gigs by a specific seller
 * @route   GET /api/gigs/seller/:sellerId
 * @access  Public
 */
export const getGigsBySeller = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({ sellerId: req.params.sellerId, isActive: true }).sort({
    createdAt: -1,
  });
  res.json({ success: true, gigs });
});
