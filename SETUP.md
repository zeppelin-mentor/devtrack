# DevTrack Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Create Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT
);

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

-- Tech stacks table
CREATE TABLE tech_stacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT
);

-- Gmail accounts table
CREATE TABLE gmail_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  recovery_email TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- GitHub accounts table
CREATE TABLE github_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  ssh_key TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  project_type TEXT,
  category_id UUID REFERENCES categories(id),
  role_id UUID REFERENCES roles(id),
  project_description TEXT,
  responsibilities TEXT,
  project_highlights TEXT,
  start_date DATE,
  end_date DATE,
  team_size INTEGER,
  client_name TEXT,
  gmail_id UUID REFERENCES gmail_accounts(id),
  github_id UUID REFERENCES github_accounts(id),
  repo_url TEXT,
  hosting TEXT,
  domain TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project tech stack mapping
CREATE TABLE project_tech_stack (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tech_stack_id UUID REFERENCES tech_stacks(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE gmail_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tech_stack ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own gmail accounts"
  ON gmail_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gmail accounts"
  ON gmail_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gmail accounts"
  ON gmail_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gmail accounts"
  ON gmail_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view own github accounts"
  ON github_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own github accounts"
  ON github_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Seed Initial Data (Optional)

```sql
-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Web Development', 'Web applications and websites'),
  ('AI Platform', 'Artificial intelligence projects'),
  ('Mobile App', 'Mobile applications'),
  ('SaaS', 'Software as a Service'),
  ('Marketplace', 'E-commerce and marketplace platforms');

-- Insert sample roles
INSERT INTO roles (name) VALUES
  ('Full Stack Developer'),
  ('Frontend Developer'),
  ('Backend Developer'),
  ('DevOps Engineer'),
  ('AI Engineer');

-- Insert sample tech stacks
INSERT INTO tech_stacks (name, category) VALUES
  ('Next.js', 'Frontend'),
  ('React', 'Frontend'),
  ('Node.js', 'Backend'),
  ('Supabase', 'Database'),
  ('TailwindCSS', 'Frontend'),
  ('PostgreSQL', 'Database'),
  ('Vercel', 'DevOps');
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features Implemented

- Landing page with feature overview
- Authentication screens (Login/Signup)
- Dashboard with statistics
- Projects management (list, create)
- Gmail accounts management
- GitHub accounts management
- Tech stacks library
- Export functionality

## Next Steps

To complete the implementation:

1. Connect Supabase authentication in auth pages
2. Implement API routes for CRUD operations
3. Connect forms to Supabase
4. Implement CSV export functionality
5. Add search and filtering
6. Add form validation
7. Implement edit and delete operations

## Troubleshooting

If you encounter issues:

1. Verify environment variables are set correctly
2. Check Supabase project is active
3. Ensure RLS policies are enabled
4. Check browser console for errors
