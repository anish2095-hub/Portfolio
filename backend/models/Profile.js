import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Anish Singh',
    },
    title: {
      type: String,
      default: 'Full Stack MERN Developer & Aspiring Software Engineer',
    },
    typingRoles: {
      type: [String],
      default: [
        'Full Stack MERN Developer',
        'React & Node.js Specialist',
        'CSE Diploma Student',
        'UI/UX & Creative Technologist',
        'Open Source Builder',
      ],
    },
    tagline: {
      type: String,
      default: 'Designing and engineering high-impact digital products, scalable web architectures, and fluid interactive experiences.',
    },
    avatar: {
      type: String,
      default: '/pfp.jpeg',
    },
    bio: {
      type: String,
      default: "Hi, I'm Anish—an aspiring software developer and a CSE student who is passionate about technology, programming, and building meaningful digital experiences.",
    },
    location: {
      type: String,
      default: 'Gaya ji, Bihar',
    },
    email: {
      type: String,
      default: 'anishsingh2095@gmail.com',
    },
    phone: {
      type: String,
      default: '+91 9334398322',
    },
    degree: {
      type: String,
      default: 'Diploma in Computer Science',
    },
    experienceYears: {
      type: String,
      default: '2+ years',
    },
    availability: {
      type: String,
      default: 'Available for Full-time Roles & High-Impact Contracts',
    },
    resumeUrl: {
      type: String,
      default: 'https://anish2095-hub.github.io/MyResumeDemo/',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/anish2095-hub' },
      linkedin: { type: String, default: 'https://www.linkedin.com/in/anish-kumar-03b105333/' },
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
    techPillars: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        tagline: { type: String, default: '' },
        metric: { type: String, default: '' },
        tools: { type: [String], default: [] },
      },
    ],
    telemetryText: {
      type: String,
      default: 'Full-Stack Ready • Diploma CSE',
    },
    codeWindowData: {
      filename: { type: String, default: 'DeveloperProfile.ts' },
      introSnippet: {
        type: String,
        default: `const developer = {
  name: "Anish Singh",
  focus: ["MERN Stack", "Modern Frontend", "Cloud Deployments"],
  currentStatus: "Open for Opportunities",
  traits: ["Clean Architecture", "Continuous Learner"],
  location: "Gaya ji, Bihar"
};`,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
