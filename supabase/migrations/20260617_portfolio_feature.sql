-- Migration: Public Portfolio Profile Feature
-- Created: 2026-06-17
-- Description: Add tables and columns for public portfolio functionality

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  location TEXT,
  
  -- Profile visibility settings
  is_public BOOLEAN DEFAULT FALSE,
  available_for_work BOOLEAN DEFAULT FALSE,
  show_email BOOLEAN DEFAULT FALSE,
  
  -- Social links
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  show_github BOOLEAN DEFAULT TRUE,
  show_linkedin BOOLEAN DEFAULT TRUE,
  show_twitter BOOLEAN DEFAULT TRUE,
  show_website BOOLEAN DEFAULT TRUE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  CONSTRAINT username_lowercase CHECK (username = LOWER(username)),
  CONSTRAINT bio_length CHECK (LENGTH(bio) <= 1000)
);

-- Create indexes for user_profiles
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_public ON user_profiles(is_public);

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Visibility settings
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, project_id)
);

-- Create indexes for portfolio_projects
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_user_id ON portfolio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_project_id ON portfolio_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_order ON portfolio_projects(user_id, display_order);

-- Add portfolio visibility columns to projects table
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS show_description BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_responsibilities BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_highlights BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_tech_stack BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_repo BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS show_dates BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_team_size BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_client BOOLEAN DEFAULT FALSE;

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public profiles"
  ON user_profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on portfolio_projects
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_projects
CREATE POLICY "Users can manage own portfolio projects"
  ON portfolio_projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view portfolio projects of public profiles"
  ON portfolio_projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = portfolio_projects.user_id
      AND user_profiles.is_public = true
    )
    AND is_visible = true
  );

-- Update RLS policy for projects to allow public portfolio access
CREATE POLICY "Public can view portfolio projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_projects pp
      JOIN user_profiles up ON up.user_id = pp.user_id
      WHERE pp.project_id = projects.id
      AND up.is_public = true
      AND pp.is_visible = true
    )
  );

-- Create trigger for user_profiles updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Create function to reserve system usernames
CREATE OR REPLACE FUNCTION is_reserved_username(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN username IN (
    'admin', 'api', 'www', 'app', 'auth', 'dashboard', 'profile', 
    'settings', 'portfolio', 'public', 'static', 'assets', 'login', 
    'signup', 'logout', 'forgot-password', 'reset-password', 'terms', 
    'privacy', 'contact', 'about', 'help', 'support', 'docs', 'blog',
    'projects', 'pages', 'export', 'share', 'mcp', 'tech-stacks',
    'gmail-accounts', 'github-accounts'
  );
END;
$$ LANGUAGE plpgsql;

-- Add constraint to prevent reserved usernames
ALTER TABLE user_profiles ADD CONSTRAINT no_reserved_usernames 
  CHECK (NOT is_reserved_username(username));
