import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Certificate } from '../models/Certificate.js';
import { Media } from '../models/Media.js';

import {
  adminUser,
  profileData,
  projectsData,
  skillsData,
  experienceData,
  certificatesData,
  mediaData,
} from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db';
    console.log(`[Seeder] Connecting to MongoDB at ${connUri}...`);
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seeder] Connected to database.');

    // Clear old data
    await User.deleteMany();
    await Profile.deleteMany();
    await Project.deleteMany();
    await Skill.deleteMany();
    await Experience.deleteMany();
    await Certificate.deleteMany();
    await Media.deleteMany();

    console.log('[Seeder] Old data cleared.');

    // Create Admin User
    const createdAdmin = await User.create(adminUser);
    console.log(`[Seeder] Admin user created: ${createdAdmin.email} (Password: admin123)`);

    // Create Profile
    await Profile.create(profileData);
    console.log('[Seeder] Profile data seeded.');

    // Create Projects
    await Project.insertMany(projectsData);
    console.log(`[Seeder] ${projectsData.length} projects seeded.`);

    // Create Skills
    await Skill.insertMany(skillsData);
    console.log(`[Seeder] ${skillsData.length} skills seeded.`);

    // Create Experiences
    await Experience.insertMany(experienceData);
    console.log(`[Seeder] ${experienceData.length} experience/education items seeded.`);

    // Create Certificates
    await Certificate.insertMany(certificatesData);
    console.log(`[Seeder] ${certificatesData.length} certificates seeded.`);

    // Create Media
    await Media.insertMany(mediaData);
    console.log(`[Seeder] ${mediaData.length} media items seeded.`);

    console.log('🎉 [Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();
