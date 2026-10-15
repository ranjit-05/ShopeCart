const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/:productId', cartController.addToCart);
router.patch('/:productId', cartController.updateQuantity);
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;
