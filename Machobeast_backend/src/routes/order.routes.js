import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCodOrder,
  getAllOrders,
  getMyOrders
} from '../controllers/order.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User routes (must be logged in)
router.post('/razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyRazorpayPayment);
router.post('/cod', protect, createCodOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin-only route
router.get('/', protect, admin, getAllOrders);

export default router;
