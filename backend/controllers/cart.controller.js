const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + 1;
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Cannot add more. Only ${product.stock} units in stock.`,
        });
      }
      existingItem.quantity = newQty;
    } else {
      if (product.stock === 0) {
        return res.status(400).json({ message: 'Product is out of stock' });
      }
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    const populatedUser = await Customer.findById(user._id)
      .select('cart')
      .populate({
        path: 'cart.product',
        select: 'name price image stock category',
      });

    const cart = (populatedUser.cart || []).filter((item) => item.product !== null);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getCart = async (req, res) => {
  try {
    const populatedUser = await Customer.findById(req.user._id)
      .select('cart')
      .populate({
        path: 'cart.product',
        select: 'name price image stock category',
      });

    if (!populatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = (populatedUser.cart || []).filter((item) => item.product !== null);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (quantity === undefined || quantity === null || typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be an integer' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Quantity exceeds available stock (${product.stock})`,
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    const populatedUser = await Customer.findById(user._id)
      .select('cart')
      .populate({
        path: 'cart.product',
        select: 'name price image stock category',
      });

    const cart = (populatedUser.cart || []).filter((item) => item.product !== null);

    res.status(200).json({
      success: true,
      message: 'Quantity updated',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const index = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    user.cart.splice(index, 1);
    await user.save();

    const populatedUser = await Customer.findById(user._id)
      .select('cart')
      .populate({
        path: 'cart.product',
        select: 'name price image stock category',
      });

    const cart = (populatedUser.cart || []).filter((item) => item.product !== null);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
};
