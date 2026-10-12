import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'tools'],
      default: 'frontend',
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 100,
      default: 85,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Code',
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

export const Skill = mongoose.model('Skill', skillSchema);
