import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Handloom', 'Copperware', 'Woodcraft', 'Aipan Art'],
      message: '{VALUE} is not a valid category',
    },
  },
  price: {
    type: String,
    required: [true, 'Product price is required'],
  },
  minOrder: {
    type: Number,
    required: [true, 'Minimum order quantity is required'],
    min: [1, 'Minimum order quantity must be at least 1'],
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
  },
  artisan: {
    type: String,
    required: [true, 'Artisan name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
