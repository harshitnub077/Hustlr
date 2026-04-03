import { Router } from 'express';
import {
  createReview,
  getReviewsBySeller,
  getReviewsByGig,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createReview);
router.get('/seller/:sellerId', getReviewsBySeller);
router.get('/gig/:gigId', getReviewsByGig);

export default router;
