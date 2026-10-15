const Product = require('../models/product.model');
const mongoose = require('mongoose');


const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    
    if (!name || !description || !price || !category || !image || stock === undefined || stock === null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a number greater than 0' });
    }

    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a number and cannot be negative' });
    }

    const product = await Product.create({ name, description, price, category, image, stock });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    
    const query = {};

    if (search) {
      
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      
      query.category = category;
    }

    
    let sortOption = { createdAt: -1 }; 
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .select('name description price category image stock createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById
};
