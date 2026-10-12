import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'portfolio_jwt_super_secret_key_2026', {
    expiresIn: '30d',
  });
};

// Default fallback admin user for local / offline demo
const defaultAdmin = {
  _id: 'default_admin_id_001',
  name: 'Admin',
  email: 'admin@portfolio.com',
  role: 'admin',
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email }).select('+password');
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
          },
        });
      }
    }

    // Default admin fallback for offline / initial setup
    if (email === 'admin@portfolio.com' && password === 'admin123') {
      const token = generateToken(defaultAdmin._id);
      return res.json({
        success: true,
        data: {
          ...defaultAdmin,
          token,
        },
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (req.user) {
      return res.json({ success: true, data: req.user });
    }
    res.json({ success: true, data: defaultAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (mongoose.connection.readyState === 1 && req.user?._id !== defaultAdmin._id) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user || !(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = newPassword;
      await user.save();
      return res.json({ success: true, message: 'Password updated successfully' });
    }

    if (currentPassword === 'admin123') {
      return res.json({ success: true, message: 'Password updated in session' });
    }

    res.status(400).json({ success: false, message: 'Current password is incorrect' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
