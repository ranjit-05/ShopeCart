const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await Customer.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = authMiddleware;
