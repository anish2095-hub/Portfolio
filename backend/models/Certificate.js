import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuing authority is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      required: [true, 'Issue date or year is required'],
    },
    credentialUrl: {
      type: String,
      default: '',
    },
    credentialId: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
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

export const Certificate = mongoose.model('Certificate', certificateSchema);
