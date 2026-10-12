import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Alex Rivera',
    },
    title: {
      type: String,
      default: 'Full Stack MERN Developer & Creative Technologist',
    },
    typingRoles: {
      type: [String],
      default: [
        'Full Stack Developer',
        'MERN Specialist',
        'UI/UX Enthusiast',
        'Open Source Creator',
      ],
    },
    tagline: {
      type: String,
      default: 'Crafting performant web experiences, scalable microservices, and elegant interfaces with modern technologies.',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    bio: {
      type: String,
      default: 'I am a passionate software engineer with extensive experience developing full-stack web applications. I focus on clean architectures, high performance, and thoughtful user experience.',
    },
    location: {
      type: String,
      default: 'San Francisco, CA (Open to Remote)',
    },
    email: {
      type: String,
      default: 'alex.rivera@example.com',
    },
    phone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    degree: {
      type: String,
      default: 'B.S. in Computer Science',
    },
    experienceYears: {
      type: String,
      default: '4+ Years',
    },
    availability: {
      type: String,
      default: 'Available for Full-time & High-impact Contracts',
    },
    resumeUrl: {
      type: String,
      default: '#',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://x.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      instagram: { type: String, default: 'https://instagram.com' },
    },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    codeWindowData: {
      filename: { type: String, default: 'DeveloperProfile.ts' },
      introSnippet: {
        type: String,
        default: `const developer = {
  name: "Alex Rivera",
  focus: ["MERN Stack", "Cloud Systems", "Interactive UI"],
  currentStatus: "Open for Opportunities",
  traits: ["Pixel Perfectionist", "Clean Code Advocate"],
  isCoffeePowered: true
};`,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
