import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  getAllUsers,
  approveUser,
  suspendUser,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Public
router.get('/:id', getUserProfile);

// Private
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

// Admin only
router.get('/', protect, restrictTo('admin'), getAllUsers);
router.patch('/:id/approve', protect, restrictTo('admin'), approveUser);
router.patch('/:id/suspend', protect, restrictTo('admin'), suspendUser);

export default router;
