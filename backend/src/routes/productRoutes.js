import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorizeRoles('artisan'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorizeRoles('artisan'), updateProduct)
  .delete(protect, authorizeRoles('artisan'), deleteProduct);

export default router;
