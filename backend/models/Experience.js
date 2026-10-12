import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['work', 'education'],
      default: 'work',
    },
    role: {
      type: String,
      required: [true, 'Role or degree title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Company or University name is required'],
      trim: true,
    },
    organizationUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    period: {
      type: String,
      required: [true, 'Time period string is required (e.g. 2023 - Present)'],
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
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

export const Experience = mongoose.model('Experience', experienceSchema);
