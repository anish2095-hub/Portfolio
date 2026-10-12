import mongoose from 'mongoose';
import { Message } from '../models/Message.js';

let memoryMessages = [
  {
    _id: 'msg_welcome_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techventures.io',
    subject: 'Full Stack Contract Role Opportunity',
    message: 'Hello Alex! Loved your portfolio projects and clean architecture. We have an exciting high-impact contract opportunity for a Senior MERN developer. Would love to set up a quick 15-min call to discuss!',
    read: false,
    replied: false,
    createdAt: new Date().toISOString(),
  },
];

// @desc    Send a new message from public contact form
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    if (mongoose.connection.readyState === 1) {
      const newMessage = await Message.create({
        name,
        email,
        subject: subject || 'Portfolio Contact',
        message,
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        data: newMessage,
      });
    }

    // In-memory fallback
    const memMsg = {
      _id: `msg_${Date.now()}`,
      name,
      email,
      subject: subject || 'Portfolio Contact',
      message,
      read: false,
      replied: false,
      createdAt: new Date().toISOString(),
    };
    memoryMessages.unshift(memMsg);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: memMsg,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find().sort({ createdAt: -1 });
      const unreadCount = await Message.countDocuments({ read: false });
      return res.json({
        success: true,
        count: messages.length,
        unreadCount,
        data: messages,
      });
    }

    const unreadCount = memoryMessages.filter((m) => !m.read).length;
    res.json({
      success: true,
      count: memoryMessages.length,
      unreadCount,
      data: memoryMessages,
      isFallback: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle message read status
// @route   PUT /api/messages/:id/read
// @access  Private
export const toggleMessageRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const message = await Message.findById(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
      message.read = req.body.read !== undefined ? req.body.read : !message.read;
      await message.save();
      return res.json({ success: true, data: message });
    }

    const msg = memoryMessages.find((m) => m._id === req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    msg.read = req.body.read !== undefined ? req.body.read : !msg.read;
    res.json({ success: true, data: msg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const message = await Message.findByIdAndDelete(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
      return res.json({ success: true, message: 'Message deleted successfully' });
    }

    memoryMessages = memoryMessages.filter((m) => m._id !== req.params.id);
    res.json({ success: true, message: 'Message deleted from inbox' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
