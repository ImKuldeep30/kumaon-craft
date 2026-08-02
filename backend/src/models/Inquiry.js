import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    trim: true,
  },
  buyerEmail: {
    type: String,
    required: [true, 'Buyer email address is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Inquiry quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  status: {
    type: String,
    required: [true, 'Inquiry status is required'],
    enum: {
      values: ['Pending Review', 'Quote Sent', 'In Discussion', 'Approved', 'Shipped', 'Completed'],
      message: '{VALUE} is not a valid status',
    },
    default: 'Pending Review',
  },
  priceQuote: {
    type: Number,
    default: 0,
  },
  leadTime: {
    type: String,
    default: '',
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  artisanNotes: {
    type: String,
    default: '',
  },
  trackingCode: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
