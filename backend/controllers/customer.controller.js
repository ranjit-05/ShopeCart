const Customer = require('../models/customer.model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password too short' });
    }

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCustomer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone
    });

    const token = generateToken(newCustomer._id);
    const expireDays = Number(process.env.COOKIE_EXPIRE) || 7;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: expireDays * 24 * 60 * 60 * 1000
    };
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      customer: {
        _id: newCustomer._id,
        fullName: newCustomer.fullName,
        email: newCustomer.email,
        phone: newCustomer.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    const expireDays = Number(process.env.COOKIE_EXPIRE) || 7;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: expireDays * 24 * 60 * 60 * 1000
    };
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password;
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const logout = async (req, res) => {
  try {
    const expireDays = Number(process.env.COOKIE_EXPIRE) || 7;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: expireDays * 24 * 60 * 60 * 1000
    };
    res.clearCookie('token', cookieOptions);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await Customer.findById(req.user._id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password too short' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  changePassword
};
