import Inquiry from '../models/Inquiry.js';

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Public
export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
// @access  Public
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      res.status(404);
      throw new Error(`Inquiry not found with id: ${req.params.id}`);
    }
    
    inquiry.status = status;
    await inquiry.save();
    
    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Public
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404);
      throw new Error(`Inquiry not found with id: ${req.params.id}`);
    }
    await inquiry.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Inquiry successfully removed'
    });
  } catch (error) {
    next(error);
  }
};
