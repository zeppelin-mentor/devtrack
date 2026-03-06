export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  project_type?: string;
  category_id?: string;
  role_id?: string;
  project_description?: string;
  responsibilities?: string;
  project_highlights?: string;
  start_date?: string;
  end_date?: string;
  team_size?: number;
  client_name?: string;
  gmail_id?: string;
  github_id?: string;
  repo_url?: string;
  hosting?: string;
  domain?: string;
  notes?: string;
  created_at: string;
}

export interface GmailAccount {
  id: string;
  user_id: string;
  email: string;
  recovery_email?: string;
  notes?: string;
  created_at: string;
}

export interface GitHubAccount {
  id: string;
  user_id: string;
  username: string;
  email: string;
  ssh_key?: string;
  notes?: string;
  created_at: string;
}

export interface TechStack {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface ProjectTechStack {
  id: string;
  project_id: string;
  tech_stack_id: string;
}
