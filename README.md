# 🌌 Full-Stack MERN Portfolio with Admin Panel

A high-performance, developer and creator portfolio built with the **MERN Stack** (MongoDB, Express, React, Node.js), featuring a **Cosmic Aurora** aesthetic, fluid transitions, and a complete **CMS Admin Panel** for effortless content management.

Designed for seamless deployment with **Vercel** (Frontend) and **Render** (Backend), cloud image storage via **ImgBB API** or **Cloudinary**, and persistent database storage via **MongoDB Atlas**.

---

## ✨ Features & Highlights

### 🎨 Visual Identity & Transitions (Inspired by Ujjwal Mehta)
* **Cosmic Aurora Palette**: Deep Nebula Charcoal (`#060810`, `#0b0f1d`) contrasted with luminous Electric Cyan (`#06b6d4`), Neon Violet (`#8b5cf6`), and Radiant Rose (`#f43f5e`).
* **Dark / Light Theme Switcher**: Instant theme toggle with smooth knob sliding and persistent `localStorage` preference.
* **Scroll-Linked Progress Bar**: Top-mounted gradient indicator tracking reading depth.
* **Interactive Hero Code Window**: macOS-styled terminal window with window controls, tab switcher (`Profile.ts`, `TechStack.json`, `QuickRun.sh`), one-click code copy, and syntax highlighting.
* **Animated Typewriter**: Real-time role cycling with blinking cursor.
* **Interactive Case Study Modals**: Modal views for projects with full architecture breakdowns and live demo links.
* **Celebratory Confetti**: Interactive particle explosion on successful contact form submission.

### 🛡️ CMS Admin Panel (`/admin`)
* **Secure JWT Authentication**: Protected admin routes with bcrypt password hashing and token expiration guards.
* **Overview Dashboard**: High-level telemetry displaying total projects, active skills, verified certificates, and unread inquiries.
* **Profile & Hero Manager**: Modify full name, titles, typewriter role phrases, bio, location, contact information, resume download URL, and social media handles.
* **Image Upload Integration**: Direct file upload to **ImgBB API** or **Cloudinary**, with an automated base64 fallback.
* **Projects Manager**: Full CRUD for projects, category categorization (`fullstack`, `frontend`, `backend`, `mobile`, `ai-cloud`), live demo & GitHub URLs, and "Featured" toggling.
* **Skills Matrix**: Adjust skill proficiencies (1–100%) with interactive sliders, select icon types, and categorize tools.
* **Experience & Education Timeline**: Manage career roles, university degrees, date periods, and bullet-point achievements.
* **Certificates Manager**: Upload credential badges, specify issuing authorities, issue dates, and verification links.
* **Media & Creator Showcase**: Add YouTube tutorial cards with thumbnails, captions, and external video links.
* **Contact Messages Inbox**: View messages submitted through the public contact form, toggle Read/Unread statuses, reply directly via email, and delete inquiries.

---

## 🏗️ Project Architecture

```
e:\Portfolio/
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB connection handler with fallback resilience
│   │   └── upload.js            # Multer memory storage configuration
│   ├── controllers/
│   │   ├── authController.js        # JWT Login, GetMe, ChangePassword
│   │   ├── profileController.js     # Public bio & admin profile updates
│   │   ├── projectController.js     # Projects CRUD & category filters
│   │   ├── skillController.js       # Skills CRUD & proficiency levels
│   │   ├── experienceController.js  # Career & Education timeline CRUD
│   │   ├── certificateController.js # Licenses & certifications CRUD
│   │   ├── messageController.js     # Contact inquiries & inbox management
│   │   ├── mediaController.js       # YouTube tutorials & media showcase
│   │   └── uploadController.js      # ImgBB / Cloudinary / Base64 upload
│   ├── middleware/
│   │   ├── auth.js              # Bearer token verification guard
│   │   └── errorHandler.js      # Global error & 404 middlewares
│   ├── models/
│   │   ├── User.js              # Admin credentials & bcrypt hashing
│   │   ├── Profile.js           # Bio, stats, socials, and typing roles
│   │   ├── Project.js           # Showcase projects & case studies
│   │   ├── Skill.js             # Technical skills & proficiency %
│   │   ├── Experience.js        # Timeline milestones & education
│   │   ├── Certificate.js       # Credential IDs, URLs, & badges
│   │   ├── Message.js           # Contact form inquiries
│   │   └── Media.js             # Videos & creative items
│   ├── routes/                  # Express REST API routes
│   ├── seeds/
│   │   ├── seedData.js          # Pre-populated showcase data
│   │   └── seeder.js            # Database reset & population script
│   ├── .env.example             # Backend environment template
│   ├── index.js                 # Express server entry point & CORS
│   ├── package.json
│   └── render.yaml              # Render Blueprint configuration
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg          # Modern gradient SVG brand favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Frosted glass navbar & mobile drawer
│   │   │   ├── Hero.jsx             # Typewriter hero with CTA buttons
│   │   │   ├── CodeWindow.jsx       # Interactive macOS code playground
│   │   │   ├── About.jsx            # Offset avatar framing & facts grid
│   │   │   ├── Skills.jsx           # Filterable skills with animated progress
│   │   │   ├── ExperienceTimeline.jsx # Dual-column career & education timeline
│   │   │   ├── Projects.jsx         # Project showcase & case study modal
│   │   │   ├── Certificates.jsx     # Licenses & credential cards
│   │   │   ├── MediaShowcase.jsx    # YouTube tutorials & channel banner
│   │   │   ├── Contact.jsx          # Contact form with confetti trigger
│   │   │   ├── Footer.jsx           # Clean footer with back-to-top button
│   │   │   ├── ThemeToggle.jsx      # Dark/light mode switch knob
│   │   │   └── ScrollProgress.jsx   # Top-mounted aurora scroll indicator
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Admin session & JWT token state
│   │   │   ├── PortfolioContext.jsx # Reactive portfolio data provider
│   │   │   └── ThemeContext.jsx     # Dark/Light theme class manager
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Public single-page portfolio
│   │   │   └── admin/               # Full CMS Admin Management Suite
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProfile.jsx
│   │   │       ├── AdminProjects.jsx
│   │   │       ├── AdminSkills.jsx
│   │   │       ├── AdminExperience.jsx
│   │   │       ├── AdminCertificates.jsx
│   │   │       ├── AdminMedia.jsx
│   │   │       ├── AdminMessages.jsx
│   │   │       └── AdminSettings.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios client with interceptors
│   │   ├── styles/
│   │   │   └── index.css            # Tailwind directives & cosmic theme
│   │   ├── App.jsx                  # React Router definitions
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js       # Custom design tokens & keyframes
│   ├── vite.config.js           # Vite dev server with proxy
│   └── vercel.json              # Vercel SPA client rewrite rules
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
* **Node.js**: v18+ or v20+ LTS
* **MongoDB**: Local MongoDB instance OR free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string.

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
npm install
```

Configure your `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_portfolio_token_key_2026
CLIENT_URL=http://localhost:5173

# Image Storage: Option 1 (ImgBB API: https://api.imgbb.com)
IMGBB_API_KEY=your_imgbb_key

# Image Storage: Option 2 (Cloudinary: https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed Database
Populate your database with the initial showcase projects, skills, timeline, and admin user:
```bash
npm run seed
```
> **Default Admin Account**:
> * **Email**: `admin@portfolio.com`
> * **Password**: `admin123`

### 4. Start Backend Server
```bash
npm run dev
# or: npm start
```
* Backend runs on: `http://localhost:5000`
* Health Check: `http://localhost:5000/health`

### 5. Start Frontend Development Server
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
* Open your browser at: `http://localhost:5173`
* Open the Admin CMS at: `http://localhost:5173/admin`

---

## ☁️ Deployment Instructions

### 1. Backend Deployment on Render (Node.js Web Service)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Set the following configuration options:
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Health Check Path**: `/health`
6. Under **Environment Variables**, add:
   * `NODE_ENV` = `production`
   * `PORT` = `10000`
   * `MONGODB_URI` = *(Your MongoDB Atlas connection URI)*
   * `JWT_SECRET` = *(Any secure 32+ character random secret string)*
   * `CLIENT_URL` = *(Your Vercel URL, e.g. `https://my-portfolio.vercel.app`)*
   * `IMGBB_API_KEY` = *(Optional: your ImgBB key)*
   * `CLOUDINARY_CLOUD_NAME` = *(Optional: Cloudinary credentials)*
   * `CLOUDINARY_API_KEY` = *(Optional)*
   * `CLOUDINARY_API_SECRET` = *(Optional)*
7. Click **Create Web Service**.
8. Once deployed, note down your Render service URL (e.g. `https://portfolio-backend-xyz.onrender.com`).

*(Alternatively, use `render.yaml` via Render Blueprints for automatic 1-click configuration).*

---

### 2. Frontend Deployment on Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project** and select your GitHub repository.
3. In the project setup settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click Edit and select `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   * `VITE_API_URL` = `https://portfolio-backend-xyz.onrender.com/api` *(Point to your deployed Render backend)*
5. Click **Deploy**.
6. Vercel will automatically build and publish your site with the client-side routing rules defined in `vercel.json`.

---

## 🖼️ Image Storage Options

The portfolio includes a unified image upload controller supporting three flexible options:

1. **ImgBB API (Recommended Free Option)**:
   * Sign up at [https://api.imgbb.com](https://api.imgbb.com) and click **Get API Key**.
   * Add `IMGBB_API_KEY=your_key` to your backend environment variables.
   * Uploads from the admin panel will instantly host on ImgBB.

2. **Cloudinary (Enterprise Cloud Option)**:
   * Sign up at [https://cloudinary.com](https://cloudinary.com).
   * Copy your Cloud Name, API Key, and API Secret.
   * Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to your backend environment variables.

3. **Zero-Configuration Fallback**:
   * If neither key is provided, the backend automatically converts uploaded images into optimized Base64 Data URIs so file uploads continue to work smoothly during local development and testing.

---

## 🔒 Security & Best Practices
* Passwords hashed using standard `bcryptjs` salt rounds.
* Protected API endpoints guarded by JWT Bearer tokens.
* Configured Cross-Origin Resource Sharing (CORS) permitting safe interaction between Vercel and Render.
* Sanitize inputs and file type validations restricting uploads to `image/jpeg`, `image/png`, `image/webp`, and `image/svg+xml`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
