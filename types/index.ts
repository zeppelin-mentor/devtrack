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
  // Portfolio visibility controls
  show_description?: boolean;
  show_responsibilities?: boolean;
  show_highlights?: boolean;
  show_tech_stack?: boolean;
  show_repo?: boolean;
  show_dates?: boolean;
  show_team_size?: boolean;
  show_client?: boolean;
}

export type PageStatus = 'draft' | 'published' | 'archived';

export interface Page {
  id: string;
  user_id: string;
  project_id?: string | null;
  parent_id?: string | null;
  title: string;
  slug?: string | null;
  content: string;
  status: PageStatus;
  icon?: string | null;
  cover_url?: string | null;
  is_public: boolean;
  share_token?: string | null;
  view_count: number;
  last_viewed_at?: string | null;
  created_at: string;
  updated_at: string;
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
  gmail_id?: string;
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

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio?: string | null;
  profile_photo_url?: string | null;
  location?: string | null;
  // Profile visibility settings
  is_public: boolean;
  available_for_work: boolean;
  show_email: boolean;
  // Social links
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  website_url?: string | null;
  show_github: boolean;
  show_linkedin: boolean;
  show_twitter: boolean;
  show_website: boolean;
  // Analytics
  view_count: number;
  last_viewed_at?: string | null;
  // Admin
  is_admin: boolean;
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  user_id: string;
  project_id: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
}

export interface PortfolioProjectWithDetails extends PortfolioProject {
  project: Project & {
    tech_stacks?: TechStack[];
    category?: Category;
    role?: Role;
  };
}

export interface PublicPortfolio {
  profile: Omit<UserProfile, 'id' | 'user_id' | 'show_email' | 'view_count' | 'last_viewed_at' | 'created_at' | 'updated_at'> & {
    email?: string;
  };
  projects: Array<{
    id: string;
    name: string;
    project_type?: string;
    category?: string;
    role?: string;
    project_description?: string;
    responsibilities?: string;
    project_highlights?: string;
    start_date?: string;
    end_date?: string;
    team_size?: number;
    client_name?: string;
    repo_url?: string;
    tech_stacks?: string[];
  }>;
}

export type AnnouncementType = 'info' | 'warning' | 'success' | 'error';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
  priority: number;
}

export interface PlatformAnalytics {
  id: string;
  date: string;
  total_users: number | null;
  new_users: number | null;
  active_users: number | null;
  total_projects: number | null;
  new_projects: number | null;
  total_pages: number | null;
  new_pages: number | null;
  total_portfolio_projects: number | null;
  new_portfolio_projects: number | null;
  total_api_requests: number | null;
  created_at: string | null;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalPages: number;
  totalPortfolioProjects: number;
  activeAnnouncements: number;
  weeklyAnalytics: PlatformAnalytics[];
}
