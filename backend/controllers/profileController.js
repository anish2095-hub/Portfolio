import mongoose from 'mongoose';
import { Profile } from '../models/Profile.js';
import { profileData } from '../seeds/seedData.js';

// In-memory cache when DB is in offline/fallback mode
let memoryProfile = { ...profileData };

// @desc    Get public profile data
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(profileData);
      }
      return res.json({ success: true, data: profile });
    }

    // Fallback if MongoDB is not connected locally
    res.json({ success: true, data: memoryProfile, isFallback: true });
  } catch (error) {
    res.json({ success: true, data: memoryProfile, error: error.message });
  }
};

// @desc    Update profile data
// @route   PUT /api/profile
// @access  Private (Admin)
export const updateProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(req.body);
      } else {
        profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
          new: true,
          runValidators: true,
        });
      }
      return res.json({ success: true, data: profile, message: 'Profile updated successfully' });
    }

    // In-memory fallback
    memoryProfile = { ...memoryProfile, ...req.body };
    res.json({
      success: true,
      data: memoryProfile,
      message: 'Profile updated in session memory (Connect MongoDB Atlas for persistent storage)',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
