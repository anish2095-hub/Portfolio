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
      } else if (
        profile.name === 'Alex Rivera' ||
        profile.avatar?.includes('photo-1534528741775-53994a69daeb') ||
        !profile.avatar
      ) {
        // Auto-heal old placeholder record in MongoDB with Anish Singh details
        profile.name = 'Anish Singh';
        profile.title = 'Full Stack MERN Developer & Aspiring Software Engineer';
        profile.avatar = '/pfp.jpeg';
        profile.location = 'Gaya ji, Bihar';
        profile.degree = 'Diploma in Computer Science';
        profile.email = 'anishsingh2095@gmail.com';
        profile.phone = '+91 9334398322';
        profile.experienceYears = '2+ years';
        profile.availability = 'Available for Full-time Roles & High-Impact Contracts';
        profile.bio = "Hi, I'm Anish—an aspiring software developer and a CSE student who is passionate about technology, programming, and building meaningful digital experiences.";
        profile.socialLinks = {
          github: profile.socialLinks?.github || 'https://github.com/anish2095-hub',
          linkedin: profile.socialLinks?.linkedin || 'https://www.linkedin.com/in/anish-kumar-03b105333/',
          twitter: profile.socialLinks?.twitter || 'https://x.com',
          youtube: profile.socialLinks?.youtube || 'https://youtube.com',
          instagram: profile.socialLinks?.instagram || 'https://instagram.com',
        };
        await profile.save();
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
