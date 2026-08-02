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
    const { buyerEmail, productName } = req.body;

    if (!buyerEmail || !productName) {
      return res.status(400).json({
        success: false,
        message: 'Buyer email and product name are required.'
      });
    }

    // Check if there is already an active/pending inquiry for this product and buyer
    const existingInquiry = await Inquiry.findOne({
      buyerEmail: buyerEmail.toLowerCase(),
      productName: productName,
      status: { $in: ['Pending Review', 'Quote Sent', 'In Discussion'] }
    });

    if (existingInquiry) {
      return res.status(400).json({
        success: false,
        message: `You already have an active sourcing request for "${productName}" (Status: ${existingInquiry.status}). Duplicate submissions are not allowed.`
      });
    }

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
    const { status, priceQuote, leadTime, shippingCost, artisanNotes, trackingCode } = req.body;
    let inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      res.status(404);
      throw new Error(`Inquiry not found with id: ${req.params.id}`);
    }
    
    if (status !== undefined) inquiry.status = status;
    if (priceQuote !== undefined) inquiry.priceQuote = priceQuote;
    if (leadTime !== undefined) inquiry.leadTime = leadTime;
    if (shippingCost !== undefined) inquiry.shippingCost = shippingCost;
    if (artisanNotes !== undefined) inquiry.artisanNotes = artisanNotes;
    if (trackingCode !== undefined) inquiry.trackingCode = trackingCode;
    
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
