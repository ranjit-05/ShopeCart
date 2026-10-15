const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/count', wishlistController.getWishlistCount);
router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.patch('/:productId/toggle', wishlistController.toggleWishlist);

module.exports = router;
