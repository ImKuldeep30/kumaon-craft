import express from 'express';
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInquiries)
  .post(protect, createInquiry);

router.route('/:id')
  .patch(protect, authorizeRoles('artisan'), updateInquiryStatus)
  .delete(protect, authorizeRoles('artisan'), deleteInquiry);

export default router;
