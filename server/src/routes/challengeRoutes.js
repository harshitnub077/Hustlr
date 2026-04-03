import { Router } from 'express';
import {
  createChallenge,
  getChallenges,
  getChallengeById,
  submitToChallenge,
  pickWinner,
} from '../controllers/challengeController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getChallenges);
router.get('/:id', getChallengeById);

// Company creates challenges
router.post('/', protect, restrictTo('company'), createChallenge);

// Students submit
router.post('/:id/submit', protect, restrictTo('student'), submitToChallenge);

// Company picks winner
router.patch('/:id/winner', protect, restrictTo('company'), pickWinner);

export default router;
