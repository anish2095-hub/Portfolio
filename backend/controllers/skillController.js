import mongoose from 'mongoose';
import { Skill } from '../models/Skill.js';
import { skillsData } from '../seeds/seedData.js';

let memorySkills = skillsData.map((s, idx) => ({ ...s, _id: `mem_skill_${idx + 1}` }));

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const { category } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category && category !== 'all') query.category = category;
      const skills = await Skill.find(query).sort({ order: 1, proficiency: -1 });
      return res.json({ success: true, count: skills.length, data: skills });
    }

    let list = [...memorySkills];
    if (category && category !== 'all') {
      list = list.filter((s) => s.category === category);
    }
    res.json({ success: true, count: list.length, data: list, isFallback: true });
  } catch (error) {
    res.json({ success: true, count: memorySkills.length, data: memorySkills });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const skill = await Skill.create(req.body);
      return res.status(201).json({ success: true, data: skill, message: 'Skill created successfully' });
    }

    const newSkill = { ...req.body, _id: `mem_skill_${Date.now()}` };
    memorySkills.push(newSkill);
    res.status(201).json({ success: true, data: newSkill, message: 'Skill created in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.json({ success: true, data: skill, message: 'Skill updated successfully' });
    }

    const idx = memorySkills.findIndex((s) => s._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Skill not found' });
    memorySkills[idx] = { ...memorySkills[idx], ...req.body };
    res.json({ success: true, data: memorySkills[idx], message: 'Skill updated in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const skill = await Skill.findByIdAndDelete(req.params.id);
      if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.json({ success: true, message: 'Skill deleted successfully' });
    }

    memorySkills = memorySkills.filter((s) => s._id !== req.params.id);
    res.json({ success: true, message: 'Skill deleted from session' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
