import express from 'express';
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { inquiryRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInquiries)
  .post(protect, inquiryRateLimiter, createInquiry);

router.route('/:id')
  .patch(protect, authorizeRoles('artisan', 'buyer'), updateInquiryStatus)
  .delete(protect, authorizeRoles('artisan'), deleteInquiry);

export default router;
