import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Project short summary is required'],
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    },
    gallery: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'mobile', 'ai-cloud'],
      default: 'fullstack',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

export const Project = mongoose.model('Project', projectSchema);
