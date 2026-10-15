const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.get('/me', authMiddleware, customerController.getMe);
router.post('/logout', authMiddleware, customerController.logout);
router.patch('/change-password', authMiddleware, customerController.changePassword);

module.exports = router;
