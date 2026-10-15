
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, 48MP camera system, titanium design, and USB-C connectivity.',
    price: 134900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
    stock: 25
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.',
    price: 24990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop',
    stock: 40
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches, full anti-ghosting, and detachable wrist rest.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
    stock: 15
  },
  {
    name: 'Classic Leather Jacket',
    description: 'Premium genuine leather jacket with quilted lining, perfect for all seasons. Available in multiple sizes.',
    price: 7999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    stock: 0  
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight mesh running shoes with responsive cushioning and breathable upper for maximum comfort.',
    price: 3499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock: 60
  },
  {
    name: 'The Pragmatic Programmer',
    description: 'Classic software development book by Andrew Hunt and David Thomas. A must-read for every developer.',
    price: 599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
    stock: 100
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with touch dimmer, adjustable arm, and USB charging port. Warm and cool light modes.',
    price: 1899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
    stock: 30
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker with 360° sound, 12-hour battery, and built-in microphone.',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    stock: 0  
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    
    await Product.deleteMany({});
    console.log('Cleared existing products');

    
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${inserted.length} products`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();
