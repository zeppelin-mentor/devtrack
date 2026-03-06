import { Project, GmailAccount, GitHubAccount, TechStack, Category, Role } from '@/types';

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Web Development', description: 'Web applications and websites' },
  { id: '2', name: 'AI Platform', description: 'Artificial intelligence projects' },
  { id: '3', name: 'Mobile App', description: 'Mobile applications' },
  { id: '4', name: 'SaaS', description: 'Software as a Service' },
  { id: '5', name: 'Marketplace', description: 'E-commerce platforms' },
];

// Mock Roles
export const mockRoles: Role[] = [
  { id: '1', name: 'Full Stack Developer' },
  { id: '2', name: 'Frontend Developer' },
  { id: '3', name: 'Backend Developer' },
  { id: '4', name: 'DevOps Engineer' },
  { id: '5', name: 'AI Engineer' },
];

// Mock Tech Stacks
export const mockTechStacks: TechStack[] = [
  { id: '1', name: 'Next.js', category: 'Frontend', description: 'React framework' },
  { id: '2', name: 'React', category: 'Frontend', description: 'UI library' },
  { id: '3', name: 'Node.js', category: 'Backend', description: 'JavaScript runtime' },
  { id: '4', name: 'Supabase', category: 'Database', description: 'PostgreSQL platform' },
  { id: '5', name: 'TailwindCSS', category: 'Frontend', description: 'CSS framework' },
  { id: '6', name: 'PostgreSQL', category: 'Database', description: 'Relational database' },
  { id: '7', name: 'TypeScript', category: 'Frontend', description: 'Typed JavaScript' },
  { id: '8', name: 'Express', category: 'Backend', description: 'Node.js framework' },
  { id: '9', name: 'MongoDB', category: 'Database', description: 'NoSQL database' },
  { id: '10', name: 'Docker', category: 'DevOps', description: 'Containerization' },
];

// Mock Gmail Accounts
export const mockGmailAccounts: GmailAccount[] = [
  {
    id: '1',
    user_id: 'user1',
    email: 'dev.projects@gmail.com',
    recovery_email: 'backup.dev@gmail.com',
    notes: 'Primary development account',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    email: 'work.freelance@gmail.com',
    recovery_email: 'personal@gmail.com',
    notes: 'Freelance client communications',
    created_at: '2024-02-20T10:00:00Z',
  },
  {
    id: '3',
    user_id: 'user1',
    email: 'startup.projects@gmail.com',
    recovery_email: 'backup.dev@gmail.com',
    notes: 'Startup and side projects',
    created_at: '2024-03-10T10:00:00Z',
  },
];

// Mock GitHub Accounts
export const mockGitHubAccounts: GitHubAccount[] = [
  {
    id: '1',
    user_id: 'user1',
    username: 'devuser',
    email: 'dev.projects@gmail.com',
    ssh_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ...',
    notes: 'Personal GitHub account',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    username: 'workuser',
    email: 'work.freelance@gmail.com',
    ssh_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ...',
    notes: 'Work projects account',
    created_at: '2024-02-20T10:00:00Z',
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'RapidAid',
    project_type: 'AI',
    category_id: '2',
    role_id: '1',
    project_description: 'Emergency AI dispatch system that connects users with emergency services using intelligent routing and real-time location tracking.',
    responsibilities: 'Led full-stack development, implemented AI routing algorithms, integrated Twilio for communications, deployed on Vercel with 99.9% uptime.',
    project_highlights: 'Reduced emergency response time by 40%, served 10,000+ users',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    team_size: 4,
    client_name: 'HealthTech Solutions',
    gmail_id: '1',
    github_id: '1',
    repo_url: 'https://github.com/devuser/rapidaid',
    hosting: 'Vercel',
    domain: 'https://rapidaid.com',
    notes: 'Won Best Healthcare Innovation Award 2024',
    created_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'ShopHub Marketplace',
    project_type: 'E-Commerce',
    category_id: '5',
    role_id: '2',
    project_description: 'Multi-vendor e-commerce platform with real-time inventory management, payment processing, and vendor analytics dashboard.',
    responsibilities: 'Developed responsive frontend using React and TailwindCSS, implemented shopping cart and checkout flow, integrated Stripe payments.',
    project_highlights: 'Processed $500K+ in transactions, 50+ active vendors',
    start_date: '2023-08-01',
    end_date: '2024-02-28',
    team_size: 6,
    client_name: 'RetailCorp',
    gmail_id: '2',
    github_id: '2',
    repo_url: 'https://github.com/workuser/shophub',
    hosting: 'AWS',
    domain: 'https://shophub.io',
    notes: 'Featured in TechCrunch',
    created_at: '2023-08-01T10:00:00Z',
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'TaskFlow Pro',
    project_type: 'SaaS',
    category_id: '4',
    role_id: '1',
    project_description: 'Project management and team collaboration tool with Kanban boards, time tracking, and automated reporting.',
    responsibilities: 'Built full-stack application, designed database schema, implemented real-time collaboration features using WebSockets.',
    project_highlights: '1,000+ active teams, 4.8/5 rating on Product Hunt',
    start_date: '2023-03-01',
    end_date: '2023-12-31',
    team_size: 3,
    gmail_id: '1',
    github_id: '1',
    repo_url: 'https://github.com/devuser/taskflow',
    hosting: 'Vercel',
    domain: 'https://taskflowpro.com',
    notes: 'Bootstrapped SaaS with $10K MRR',
    created_at: '2023-03-01T10:00:00Z',
  },
  {
    id: '4',
    user_id: 'user1',
    name: 'FitTracker Mobile',
    project_type: 'Mobile',
    category_id: '3',
    role_id: '1',
    project_description: 'Cross-platform fitness tracking app with workout plans, nutrition tracking, and social features.',
    responsibilities: 'Developed React Native mobile app, integrated health APIs, implemented offline-first architecture.',
    project_highlights: '50K+ downloads, 4.5 star rating',
    start_date: '2023-01-01',
    end_date: '2023-07-31',
    team_size: 2,
    gmail_id: '3',
    github_id: '1',
    repo_url: 'https://github.com/devuser/fittracker',
    hosting: 'Firebase',
    domain: 'https://fittracker.app',
    created_at: '2023-01-01T10:00:00Z',
  },
  {
    id: '5',
    user_id: 'user1',
    name: 'DevPortfolio Builder',
    project_type: 'Web',
    category_id: '1',
    role_id: '2',
    project_description: 'No-code portfolio builder for developers with customizable templates and GitHub integration.',
    responsibilities: 'Designed and implemented frontend UI, created drag-and-drop builder, integrated GitHub API.',
    project_highlights: '5,000+ portfolios created',
    start_date: '2022-09-01',
    end_date: '2023-02-28',
    team_size: 2,
    gmail_id: '1',
    github_id: '1',
    repo_url: 'https://github.com/devuser/portfolio-builder',
    hosting: 'Netlify',
    domain: 'https://devportfolio.io',
    created_at: '2022-09-01T10:00:00Z',
  },
];

// Mock Project Tech Stack Mapping
export const mockProjectTechStacks: Record<string, string[]> = {
  '1': ['1', '3', '4', '5', '7'], // RapidAid: Next.js, Node.js, Supabase, TailwindCSS, TypeScript
  '2': ['2', '3', '5', '6', '7'], // ShopHub: React, Node.js, TailwindCSS, PostgreSQL, TypeScript
  '3': ['1', '3', '4', '5', '7'], // TaskFlow: Next.js, Node.js, Supabase, TailwindCSS, TypeScript
  '4': ['2', '3', '9', '7'], // FitTracker: React, Node.js, MongoDB, TypeScript
  '5': ['1', '2', '5', '7'], // DevPortfolio: Next.js, React, TailwindCSS, TypeScript
};
