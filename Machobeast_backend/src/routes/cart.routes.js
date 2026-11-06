import express from 'express';
import {
  getCart,
  syncCart,
  addToCart,
  updateCartItemQty,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All cart actions require the user to be logged in
router.use(protect);

router
  .route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/sync', syncCart);
router.post('/items', addToCart);
router.put('/items', updateCartItemQty);
router.delete('/items', removeFromCart);

export default router;

