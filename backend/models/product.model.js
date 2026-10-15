const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    validate: {
      validator: (v) => v > 0,
      message: 'Price must be greater than 0'
    }
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
