export const adminUser = {
  name: 'Anish Singh',
  email: 'anishsingh2095@gmail.com',
  password: 'admin123',
  role: 'admin',
};

export const profileData = {
  name: 'Anish Singh',
  title: 'Full Stack MERN Developer & Software Engineer',
  typingRoles: [
    'Full Stack MERN Developer',
    'React & Node.js Specialist',
    'Creative UI/UX Designer',
    'Cloud & API Architect',
    'Open Source Builder',
  ],
  tagline: 'Designing and engineering high-impact digital products, scalable web architectures, and fluid interactive experiences.',
  avatar: '/pfp.jpeg',
  bio: "Hi, I'm Anish—an aspiring software developer and a CSE student who is passionate about technology, programming, and building meaningful digital experiences.",
  location: 'Gaya ji, Bihar',
  email: 'anishsingh2095@gmail.com',
  phone: '+91 9334398322',
  degree: 'Diploma in Computer Science',
  experienceYears: '2+ years',
  availability: 'Available for Full-time Roles & High-Impact Contracts',
  resumeUrl: 'https://anish2095-hub.github.io/MyResumeDemo/',
  socialLinks: {
    github: 'https://github.com/anish2095-hub',
    linkedin: 'https://www.linkedin.com/in/anish-kumar-03b105333/',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
  },
  stats: [
    { label: 'Completed Projects', value: '35+' },
    { label: 'Years Experience', value: '2+ years' },
    { label: 'GitHub Repositories', value: '80+' },
    { label: 'Happy Clients', value: '20+' },
  ],
  telemetryText: 'Full-Stack Ready • Diploma CSE',
  techPillars: [
    {
      id: 'frontend',
      label: 'Frontend',
      tagline: 'Pixel-perfect, high-performance UI',
      metric: '60fps Fluid UI',
      tools: ['React 19', 'TailwindCSS', 'Framer Motion', 'Vite', 'Responsive Design'],
    },
    {
      id: 'backend',
      label: 'Backend',
      tagline: 'Robust & secure API architecture',
      metric: '<40ms API Latency',
      tools: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Middleware'],
    },
    {
      id: 'database',
      label: 'Database',
      tagline: 'Scalable data models & indexing',
      metric: 'Zero Data Loss',
      tools: ['MongoDB Atlas', 'Mongoose ORM', 'Schema Design', 'Data Validation'],
    },
    {
      id: 'cloud',
      label: 'Cloud & Deploy',
      tagline: 'Continuous delivery & reliability',
      metric: '99.9% Uptime',
      tools: ['Vercel', 'Render', 'Git & GitHub', 'ImgBB / Cloudinary API'],
    },
  ],
  skillsHeaderBadge: '// My Tech Arsenal',
  skillsHeaderTitle: 'Skills & Expertise',
  skillsHeaderDescription: 'A comprehensive overview of technologies, frameworks, and modern tools I leverage to build resilient applications.',
};

export const projectsData = [
  {
    title: 'Movie Cast Webpage',
    slug: 'movie-cast-webpage',
    summary: 'A webpage for the profile of cast and characters of a movie.',
    description: '',
    coverImage: 'https://i.ibb.co/XxMpZ3KP/edac76990b59.png',
    technologies: ['HTML', 'CSS', 'JS'],
    category: 'frontend',
    liveUrl: 'https://castmovie.netlify.app/',
    githubUrl: '',
    featured: true,
    order: 0,
  },
  {
    title: 'Laundary service',
    slug: 'laundary-service',
    summary: 'This is just a simple frontend page for the laundary service webpage',
    description: '',
    coverImage: 'https://anishtask2.netlify.app/Laundaryimg.webp',
    technologies: ['HTML', 'CSS'],
    category: 'frontend',
    liveUrl: 'https://anishtask2.netlify.app/',
    githubUrl: '',
    featured: true,
    order: 0,
  },
];

export const skillsData = [
  // Frontend
  { name: 'React.js', category: 'frontend', proficiency: 95, icon: 'Atom', description: 'Hooks, Suspense, Context, React Query, Zustand, Virtual DOM' },
  { name: 'JavaScript (ES6+)', category: 'frontend', proficiency: 96, icon: 'FileCode', description: 'Async/Await, Closures, Event Loop, Prototypes, ES Modules' },
  { name: 'TypeScript', category: 'frontend', proficiency: 88, icon: 'Code', description: 'Generics, Strict Type Safety, Interfaces, Utility Types' },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 94, icon: 'Palette', description: 'Custom Design Tokens, Responsive layouts, Animations' },
  { name: 'HTML5 & Modern CSS3', category: 'frontend', proficiency: 96, icon: 'Layout', description: 'Flexbox, Grid, CSS Variables, SVG Animation, A11y' },
  
  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 92, icon: 'Server', description: 'Event Loop, Streams, Cluster Module, Async I/O, REST APIs' },
  { name: 'Express.js', category: 'backend', proficiency: 94, icon: 'Cpu', description: 'Middleware Architecture, Route Guards, Error Handling' },
  { name: 'REST & GraphQL APIs', category: 'backend', proficiency: 90, icon: 'Network', description: 'API Design, JWT Authentication, Rate Limiting, CORS' },

  // Database
  { name: 'MongoDB & Mongoose', category: 'database', proficiency: 92, icon: 'Database', description: 'Aggregation Pipelines, Schema Indexing, Replica Sets' },
  { name: 'Redis', category: 'database', proficiency: 82, icon: 'Zap', description: 'In-memory caching, Pub/Sub, Session Management' },
  { name: 'PostgreSQL', category: 'database', proficiency: 80, icon: 'Layers', description: 'Relational Schema Design, Foreign Keys, SQL Queries' },

  // DevOps & Cloud
  { name: 'Docker & Containers', category: 'devops', proficiency: 84, icon: 'Container', description: 'Dockerfile optimization, Multi-stage builds, Compose' },
  { name: 'Render & Vercel Deployments', category: 'devops', proficiency: 92, icon: 'Cloud', description: 'Automated CI/CD pipelines, SSL, Environment variables' },
  { name: 'Git & GitHub Workflows', category: 'tools', proficiency: 94, icon: 'GitBranch', description: 'Branching strategies, Actions CI/CD, Pull Requests' },
  { name: 'Postman & API Testing', category: 'tools', proficiency: 90, icon: 'CheckCircle2', description: 'Automated Test Suites, Environment Variables, Mocking' },
];

export const experienceData = [
  {
    type: 'work',
    role: 'Internship',
    organization: 'TechSharthi Academy',
    organizationUrl: '',
    location: '',
    period: '2026',
    current: false,
    description: '',
    highlights: [],
    order: 0,
  },
  {
    type: 'education',
    role: 'Diploma in Computer Science',
    organization: 'Government Polytechnic Gaya',
    organizationUrl: '',
    location: '',
    period: '2025-present',
    current: true,
    description: '',
    highlights: [],
    order: 0,
  },
];

export const certificatesData = [
  {
    title: 'Digital Producvity with AI',
    issuer: 'YuWaah / UNICEF',
    issueDate: '2026',
    credentialUrl: 'https://skills.myp2e.org/storage/certificates/Certificate_3174948_37_1513l.pdf',
    credentialId: '',
    image: 'https://i.ibb.co/FkLzFKCz/c355be6be52d.png',
    order: 0,
  },
  {
    title: 'Basics of Python',
    issuer: 'UniAthena / Cambridge International Qualifications, UK',
    issueDate: '2026',
    credentialUrl: '',
    credentialId: '',
    image: 'https://i.ibb.co/PzPFhsXz/4ae3cdd6c3b3.jpg',
    order: 0,
  },
  {
    title: 'SPARK IDEA  HACKATHON 2026',
    issuer: 'New Government Polytechnic, Patna -13',
    issueDate: '2026',
    credentialUrl: '',
    credentialId: '',
    image: 'https://i.ibb.co/DHCfp1QP/06b3abe06b71.jpg',
    order: 0,
  },
  {
    title: 'Narayan National Hackathon 2026 participation',
    issuer: 'Jai Narayan Vidya Mandir, Kanpur, Uttar Pradesh',
    issueDate: '2026',
    credentialUrl: 'https://unstop.com/certificate-preview/7ef58394-7e08-46b8-9e27-86b3019c6e07',
    credentialId: '',
    image: 'https://i.ibb.co/FLFgh3b9/2ca6bab45148.png',
    order: 0,
  },
  {
    title: 'IT Essential',
    issuer: 'Cisco Networking Academy program',
    issueDate: '2025',
    credentialUrl: '',
    credentialId: '',
    image: 'https://i.ibb.co/qLH1XXxP/b3c153897780.png',
    order: 0,
  },
  {
    title: 'Internship 1.0',
    issuer: 'TechSharthi academy',
    issueDate: '2026',
    credentialUrl: '',
    credentialId: '',
    image: 'https://i.ibb.co/67Kqj7Lb/8fc592032908.png',
    order: 0,
  },
  {
    title: 'Hacklith 1.0 participation',
    issuer: 'Government Engineering College, BANKA',
    issueDate: '2026',
    credentialUrl: 'https://app.truscholar.io/profile?credId=6ae07818b82a22a9efdf6e5a',
    credentialId: '',
    image: 'https://i.ibb.co/NnWMFCCB/38b23fc5b106.png',
    order: 0,
  },
];

export const mediaData = [];
