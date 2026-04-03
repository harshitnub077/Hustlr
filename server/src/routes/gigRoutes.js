import { Router } from 'express';
import {
  createGig,
  getGigs,
  getGigById,
  updateGig,
  deleteGig,
  getGigsBySeller,
} from '../controllers/gigController.js';
import { protect, restrictTo, requireApproved } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Public
router.get('/', getGigs);
router.get('/seller/:sellerId', getGigsBySeller);
router.get('/:id', getGigById);

// Private — Students only with admin approval
router.post(
  '/',
  protect,
  restrictTo('student'),
  requireApproved,
  upload.array('images', 5),
  createGig
);
router.put('/:id', protect, restrictTo('student'), updateGig);
router.delete('/:id', protect, restrictTo('student'), deleteGig);

export default router;
