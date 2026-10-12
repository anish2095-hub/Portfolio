import mongoose from 'mongoose';
import { Media } from '../models/Media.js';
import { mediaData } from '../seeds/seedData.js';

let memoryMedia = mediaData.map((m, idx) => ({ ...m, _id: `mem_media_${idx + 1}` }));

// @desc    Get all media items (YouTube videos, gallery)
// @route   GET /api/media
// @access  Public
export const getMedia = async (req, res) => {
  try {
    const { type } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (type) query.type = type;
      const items = await Media.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: items.length, data: items });
    }

    let list = [...memoryMedia];
    if (type) list = list.filter((m) => m.type === type);
    res.json({ success: true, count: list.length, data: list, isFallback: true });
  } catch (error) {
    res.json({ success: true, count: memoryMedia.length, data: memoryMedia });
  }
};

// @desc    Create media item
// @route   POST /api/media
// @access  Private
export const createMedia = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const media = await Media.create(req.body);
      return res.status(201).json({ success: true, data: media, message: 'Media item created' });
    }

    const newItem = { ...req.body, _id: `mem_media_${Date.now()}` };
    memoryMedia.push(newItem);
    res.status(201).json({ success: true, data: newItem, message: 'Media item created in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete media item
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const media = await Media.findByIdAndDelete(req.params.id);
      if (!media) return res.status(404).json({ success: false, message: 'Media item not found' });
      return res.json({ success: true, message: 'Media item deleted' });
    }

    memoryMedia = memoryMedia.filter((m) => m._id !== req.params.id);
    res.json({ success: true, message: 'Media item deleted from session' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
