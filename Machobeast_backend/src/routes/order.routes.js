import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCodOrder,
  getAllOrders
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);
router.post('/cod', createCodOrder);
router.get('/', getAllOrders);

export default router;
