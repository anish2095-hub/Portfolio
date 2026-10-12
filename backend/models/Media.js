import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Media title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['youtube', 'gallery', 'article'],
      default: 'youtube',
    },
    url: {
      type: String,
      required: [true, 'Media external link or video link is required'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
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

export const Media = mongoose.model('Media', mediaSchema);
