import mongoose from 'mongoose';
import { Experience } from '../models/Experience.js';
import { experienceData } from '../seeds/seedData.js';

let memoryExperiences = experienceData.map((e, idx) => ({ ...e, _id: `mem_exp_${idx + 1}` }));

// @desc    Get all experiences & educations
// @route   GET /api/experience
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const { type } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (type && type !== 'all') query.type = type;
      const items = await Experience.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: items.length, data: items });
    }

    let list = [...memoryExperiences];
    if (type && type !== 'all') {
      list = list.filter((e) => e.type === type);
    }
    res.json({ success: true, count: list.length, data: list, isFallback: true });
  } catch (error) {
    res.json({ success: true, count: memoryExperiences.length, data: memoryExperiences });
  }
};

// @desc    Create new experience/education
// @route   POST /api/experience
// @access  Private
export const createExperience = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await Experience.create(req.body);
      return res.status(201).json({ success: true, data: item, message: 'Timeline item created successfully' });
    }

    const newItem = { ...req.body, _id: `mem_exp_${Date.now()}` };
    memoryExperiences.push(newItem);
    res.status(201).json({ success: true, data: newItem, message: 'Timeline item created in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update experience/education
// @route   PUT /api/experience/:id
// @access  Private
export const updateExperience = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, data: item, message: 'Timeline item updated successfully' });
    }

    const idx = memoryExperiences.findIndex((e) => e._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });
    memoryExperiences[idx] = { ...memoryExperiences[idx], ...req.body };
    res.json({ success: true, data: memoryExperiences[idx], message: 'Timeline item updated in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete experience/education
// @route   DELETE /api/experience/:id
// @access  Private
export const deleteExperience = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await Experience.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, message: 'Timeline item deleted successfully' });
    }

    memoryExperiences = memoryExperiences.filter((e) => e._id !== req.params.id);
    res.json({ success: true, message: 'Timeline item deleted from session' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
