import express from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
