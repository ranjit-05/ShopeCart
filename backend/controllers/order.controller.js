const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const razorpay = require('../config/razorpay');

const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;

    // Server-side validate shippingAddress
    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !pincode ||
      !fullName.trim() ||
      !phone.trim() ||
      !addressLine1.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      return res.status(400).json({ message: 'All shipping address fields are required' });
    }

    const phoneTrimmed = phone.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneTrimmed)) {
      return res.status(400).json({ message: 'Phone must be a valid 10-digit Indian mobile number' });
    }

    const pincodeTrimmed = pincode.trim();
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincodeTrimmed)) {
      return res.status(400).json({ message: 'Pincode must contain 6 digits' });
    }

    // Authenticate and load user with populated cart
    const user = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price image stock category',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItems = (user.cart || []).filter((item) => item.product !== null);

    // 400 if cart is empty
    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Reload latest Product documents to verify availability and current stock
    const productIds = cartItems.map((item) => item.product._id);
    const latestProducts = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(latestProducts.map((p) => [p._id.toString(), p]));

    for (const item of cartItems) {
      const prodId = item.product._id.toString();
      const latestProd = productMap.get(prodId);
      if (!latestProd) {
        return res.status(400).json({ message: 'One or more products in your cart are no longer available' });
      }
      if (item.quantity > latestProd.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${latestProd.name}.` });
      }
    }

    // Compute totalAmount = Σ(latest price × quantity) on server and build snapshot items
    let totalAmount = 0;
    const itemsSnapshot = [];

    for (const item of cartItems) {
      const latestProd = productMap.get(item.product._id.toString());
      totalAmount += latestProd.price * item.quantity;
      itemsSnapshot.push({
        product: latestProd._id,
        name: latestProd.name,
        price: latestProd.price,
        quantity: item.quantity,
        image: latestProd.image,
      });
    }

    // Create the Order with PENDING_PAYMENT / PENDING
    const order = new Order({
      user: user._id,
      items: itemsSnapshot,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phoneTrimmed,
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincodeTrimmed,
      },
      totalAmount,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    });

    await order.save();

    // Create Razorpay order
    const amountInPaise = Math.round(totalAmount * 100);
    let razorpayOrderId;

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order._id.toString(),
      });
      razorpayOrderId = razorpayOrder.id;
    } catch (rzpErr) {
      // If placeholder keys are used in development/test environment, generate dev order ID
      if (
        process.env.RAZORPAY_KEY_ID?.includes('placeholder') ||
        process.env.RAZORPAY_KEY_ID?.includes('yourKeyId')
      ) {
        razorpayOrderId = `order_test_${Date.now()}`;
      } else {
        await Order.findByIdAndDelete(order._id);
        return res.status(500).json({ message: 'Failed to create Razorpay order' });
      }
    }

    order.razorpayOrderId = razorpayOrderId;
    await order.save();

    // Do NOT clear the cart here
    res.status(200).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required payment verification parameters' });
    }

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure order belongs to authenticated user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Idempotent: If already PAID, return success without reprocessing
    if (order.paymentStatus === 'PAID') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        order,
      });
    }

    // Compute expected HMAC SHA256 using razorpayOrderId STORED IN DB
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(order.razorpayOrderId + '|' + razorpay_payment_id)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    const isMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isMatch) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Match -> mark PAID, PLACED, save payment ID
    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Clear cart upon verified payment
    const user = await Customer.findById(req.user._id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const paymentFailed = async (req, res) => {
  try {
    const { shopKartOrderId } = req.body;

    if (!shopKartOrderId || !mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.paymentStatus === 'PENDING') {
      order.paymentStatus = 'FAILED';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Order marked as payment failed',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Development-only endpoint to update order status for testing
const updateOrderStatus = async (req, res) => {
  try {
    if (process.env.ENABLE_DEV_ORDER_STATUS !== 'true') {
      return res.status(403).json({ message: 'Dev order status update is disabled' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const allowedStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  paymentFailed,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
