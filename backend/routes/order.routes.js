const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Static routes defined BEFORE GET /:id
router.post('/create-payment-order', orderController.createPaymentOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.post('/payment-failed', orderController.paymentFailed);
router.get('/', orderController.getOrders);

// Dynamic routes
router.patch('/:id/status', orderController.updateOrderStatus);
router.get('/:id', orderController.getOrderById);

module.exports = router;
