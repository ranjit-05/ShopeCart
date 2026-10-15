const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const getWishlistCount = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).select('wishlist');
    res.status(200).json({
      success: true,
      count: user.wishlist.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await Customer.findById(req.user._id);

    if (user.wishlist.some((id) => id.toString() === productId)) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price category image stock',
    });

    const wishlist = user.wishlist.filter((item) => item !== null);

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const user = await Customer.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    if (index === -1) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    user.wishlist.splice(index, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await Customer.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    let message;
    let isWishlisted;

    if (index === -1) {
      user.wishlist.push(productId);
      message = 'Product added to wishlist';
      isWishlisted = true;
    } else {
      user.wishlist.splice(index, 1);
      message = 'Product removed from wishlist';
      isWishlisted = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message,
      isWishlisted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getWishlistCount,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
};
