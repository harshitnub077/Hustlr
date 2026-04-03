import asyncHandler from 'express-async-handler';
import Challenge from '../models/Challenge.js';

/**
 * @desc    Create a challenge
 * @route   POST /api/challenges
 * @access  Private (Company)
 */
export const createChallenge = asyncHandler(async (req, res) => {
  const { title, description, reward, deadline, category } = req.body;

  const challenge = await Challenge.create({
    createdBy: req.user._id,
    title,
    description,
    reward,
    deadline,
    category,
  });

  res.status(201).json({ success: true, challenge });
});

/**
 * @desc    Get all open challenges
 * @route   GET /api/challenges
 * @access  Public
 */
export const getChallenges = asyncHandler(async (req, res) => {
  const { status = 'open', category, page = 1, limit = 10 } = req.query;

  const filter = { status };
  if (category) filter.category = category;

  const challenges = await Challenge.find(filter)
    .populate('createdBy', 'name companyDetails.companyName profile.avatarUrl')
    .sort({ deadline: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Challenge.countDocuments(filter);

  res.json({ success: true, total, challenges });
});

/**
 * @desc    Get a single challenge
 * @route   GET /api/challenges/:id
 * @access  Public
 */
export const getChallengeById = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id)
    .populate('createdBy', 'name companyDetails.companyName profile.avatarUrl')
    .populate('submissions.userId', 'name profile.avatarUrl');

  if (!challenge) {
    res.status(404);
    throw new Error('Challenge not found');
  }

  res.json({ success: true, challenge });
});

/**
 * @desc    Submit to a challenge
 * @route   POST /api/challenges/:id/submit
 * @access  Private (Student)
 */
export const submitToChallenge = asyncHandler(async (req, res) => {
  const { submissionUrl, note } = req.body;

  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    res.status(404);
    throw new Error('Challenge not found');
  }

  if (challenge.status !== 'open') {
    res.status(400);
    throw new Error('This challenge is no longer accepting submissions');
  }

  if (new Date() > new Date(challenge.deadline)) {
    res.status(400);
    throw new Error('Submission deadline has passed');
  }

  const alreadySubmitted = challenge.submissions.find(
    (s) => s.userId.toString() === req.user._id.toString()
  );

  if (alreadySubmitted) {
    res.status(400);
    throw new Error('You have already submitted to this challenge');
  }

  challenge.submissions.push({ userId: req.user._id, submissionUrl, note });
  await challenge.save();

  res.json({ success: true, message: 'Submission received' });
});

/**
 * @desc    Company picks a winner
 * @route   PATCH /api/challenges/:id/winner
 * @access  Private (Challenge creator)
 */
export const pickWinner = asyncHandler(async (req, res) => {
  const { winnerId } = req.body;
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    res.status(404);
    throw new Error('Challenge not found');
  }

  if (challenge.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the challenge creator can pick a winner');
  }

  challenge.winnerId = winnerId;
  challenge.status = 'completed';
  await challenge.save();

  res.json({ success: true, message: 'Winner selected', challenge });
});
