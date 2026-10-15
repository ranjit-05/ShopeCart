require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();
app.set('trust proxy', 1);

// Configure CORS to accept configured FRONTEND_URL and local dev origins
const frontendUrls = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shope-cart.vercel.app',
  ...frontendUrls
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    let isVercel = false;
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith('.vercel.app')) isVercel = true;
    } catch (_) {}

    if (allowedOrigins.includes(normalizedOrigin) || isVercel) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: "ShopKart API running" });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: "ShopKart API running" });
});

// Application routes
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('Database connection error: MONGO_URI environment variable is not defined.');
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB database');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message || err);
  });
