import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  acceptOrder,
  deliverOrder,
  cancelOrder,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/stats', restrictTo('admin'), getOrderStats);
router.get('/:id', getOrderById);
router.patch('/:id/accept', acceptOrder);
router.patch('/:id/deliver', deliverOrder);
router.patch('/:id/cancel', cancelOrder);

export default router;
