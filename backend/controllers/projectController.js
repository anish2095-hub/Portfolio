import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { projectsData } from '../seeds/seedData.js';

let memoryProjects = projectsData.map((p, idx) => ({ ...p, _id: `mem_proj_${idx + 1}` }));

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category && category !== 'all') query.category = category;
      if (featured === 'true') query.featured = true;

      const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: projects.length, data: projects });
    }

    // Fallback in-memory
    let list = [...memoryProjects];
    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (featured === 'true') {
      list = list.filter((p) => p.featured);
    }

    res.json({ success: true, count: list.length, data: list, isFallback: true });
  } catch (error) {
    res.json({ success: true, count: memoryProjects.length, data: memoryProjects });
  }
};

// @desc    Get project by slug or ID
// @route   GET /api/projects/:idOrSlug
// @access  Public
export const getProject = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    if (mongoose.connection.readyState === 1) {
      let project = null;
      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        project = await Project.findById(idOrSlug);
      }
      if (!project) {
        project = await Project.findOne({ slug: idOrSlug });
      }
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, data: project });
    }

    const item = memoryProjects.find((p) => p._id === idOrSlug || p.slug === idOrSlug);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.create(req.body);
      return res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
    }

    const newProj = {
      ...req.body,
      _id: `mem_proj_${Date.now()}`,
      slug: req.body.title?.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
      createdAt: new Date().toISOString(),
    };
    memoryProjects.unshift(newProj);
    res.status(201).json({ success: true, data: newProj, message: 'Project created in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, data: project, message: 'Project updated successfully' });
    }

    const idx = memoryProjects.findIndex((p) => p._id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    memoryProjects[idx] = { ...memoryProjects[idx], ...req.body };
    res.json({ success: true, data: memoryProjects[idx], message: 'Project updated in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, message: 'Project deleted successfully' });
    }

    memoryProjects = memoryProjects.filter((p) => p._id !== req.params.id);
    res.json({ success: true, message: 'Project deleted from session' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
