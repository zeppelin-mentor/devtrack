export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      github_accounts: {
        Row: {
          created_at: string | null
          email: string
          gmail_id: string | null
          id: string
          notes: string | null
          ssh_key: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          gmail_id?: string | null
          id?: string
          notes?: string | null
          ssh_key?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          gmail_id?: string | null
          id?: string
          notes?: string | null
          ssh_key?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      gmail_accounts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          notes: string | null
          recovery_email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          notes?: string | null
          recovery_email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          notes?: string | null
          recovery_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mcp_api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string | null
          requests_date: string
          requests_today: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name?: string | null
          requests_date?: string
          requests_today?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string | null
          requests_date?: string
          requests_today?: number
          user_id?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string
          cover_url: string | null
          created_at: string
          icon: string | null
          id: string
          is_public: boolean
          last_viewed_at: string | null
          parent_id: string | null
          project_id: string | null
          share_token: string | null
          slug: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          content?: string
          cover_url?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_public?: boolean
          last_viewed_at?: string | null
          parent_id?: string | null
          project_id?: string | null
          share_token?: string | null
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          content?: string
          cover_url?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_public?: boolean
          last_viewed_at?: string | null
          parent_id?: string | null
          project_id?: string | null
          share_token?: string | null
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: []
      }
      platform_analytics: {
        Row: {
          active_users: number | null
          created_at: string | null
          date: string
          id: string
          new_pages: number | null
          new_portfolio_projects: number | null
          new_projects: number | null
          new_users: number | null
          total_api_requests: number | null
          total_pages: number | null
          total_portfolio_projects: number | null
          total_projects: number | null
          total_users: number | null
        }
        Insert: {
          active_users?: number | null
          created_at?: string | null
          date: string
          id?: string
          new_pages?: number | null
          new_portfolio_projects?: number | null
          new_projects?: number | null
          new_users?: number | null
          total_api_requests?: number | null
          total_pages?: number | null
          total_portfolio_projects?: number | null
          total_projects?: number | null
          total_users?: number | null
        }
        Update: {
          active_users?: number | null
          created_at?: string | null
          date?: string
          id?: string
          new_pages?: number | null
          new_portfolio_projects?: number | null
          new_projects?: number | null
          new_users?: number | null
          total_api_requests?: number | null
          total_pages?: number | null
          total_portfolio_projects?: number | null
          total_projects?: number | null
          total_users?: number | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          is_visible: boolean | null
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          is_visible?: boolean | null
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean | null
          project_id?: string
          user_id?: string
        }
        Relationships: []
      }
      project_tech_stack: {
        Row: {
          id: string
          project_id: string
          tech_stack_id: string
        }
        Insert: {
          id?: string
          project_id: string
          tech_stack_id: string
        }
        Update: {
          id?: string
          project_id?: string
          tech_stack_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category_id: string | null
          client_name: string | null
          created_at: string | null
          domain: string | null
          end_date: string | null
          github_id: string | null
          gmail_id: string | null
          hosting: string | null
          id: string
          name: string
          notes: string | null
          project_description: string | null
          project_highlights: string | null
          project_type: string | null
          repo_url: string | null
          responsibilities: string | null
          role_id: string | null
          show_client: boolean | null
          show_dates: boolean | null
          show_description: boolean | null
          show_highlights: boolean | null
          show_repo: boolean | null
          show_responsibilities: boolean | null
          show_team_size: boolean | null
          show_tech_stack: boolean | null
          start_date: string | null
          team_size: number | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          client_name?: string | null
          created_at?: string | null
          domain?: string | null
          end_date?: string | null
          github_id?: string | null
          gmail_id?: string | null
          hosting?: string | null
          id?: string
          name: string
          notes?: string | null
          project_description?: string | null
          project_highlights?: string | null
          project_type?: string | null
          repo_url?: string | null
          responsibilities?: string | null
          role_id?: string | null
          show_client?: boolean | null
          show_dates?: boolean | null
          show_description?: boolean | null
          show_highlights?: boolean | null
          show_repo?: boolean | null
          show_responsibilities?: boolean | null
          show_team_size?: boolean | null
          show_tech_stack?: boolean | null
          start_date?: string | null
          team_size?: number | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          client_name?: string | null
          created_at?: string | null
          domain?: string | null
          end_date?: string | null
          github_id?: string | null
          gmail_id?: string | null
          hosting?: string | null
          id?: string
          name?: string
          notes?: string | null
          project_description?: string | null
          project_highlights?: string | null
          project_type?: string | null
          repo_url?: string | null
          responsibilities?: string | null
          role_id?: string | null
          show_client?: boolean | null
          show_dates?: boolean | null
          show_description?: boolean | null
          show_highlights?: boolean | null
          show_repo?: boolean | null
          show_responsibilities?: boolean | null
          show_team_size?: boolean | null
          show_tech_stack?: boolean | null
          start_date?: string | null
          team_size?: number | null
          user_id?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      tech_stacks: {
        Row: {
          category: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          available_for_work: boolean | null
          bio: string | null
          created_at: string | null
          display_name: string
          github_url: string | null
          id: string
          is_admin: boolean | null
          is_public: boolean | null
          last_viewed_at: string | null
          linkedin_url: string | null
          location: string | null
          profile_photo_url: string | null
          show_email: boolean | null
          show_github: boolean | null
          show_linkedin: boolean | null
          show_twitter: boolean | null
          show_website: boolean | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string
          username: string
          view_count: number | null
          website_url: string | null
        }
        Insert: {
          available_for_work?: boolean | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          github_url?: string | null
          id?: string
          is_admin?: boolean | null
          is_public?: boolean | null
          last_viewed_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          profile_photo_url?: string | null
          show_email?: boolean | null
          show_github?: boolean | null
          show_linkedin?: boolean | null
          show_twitter?: boolean | null
          show_website?: boolean | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id: string
          username: string
          view_count?: number | null
          website_url?: string | null
        }
        Update: {
          available_for_work?: boolean | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          github_url?: string | null
          id?: string
          is_admin?: boolean | null
          is_public?: boolean | null
          last_viewed_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          profile_photo_url?: string | null
          show_email?: boolean | null
          show_github?: boolean | null
          show_linkedin?: boolean | null
          show_twitter?: boolean | null
          show_website?: boolean | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
          view_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      generate_share_token: { Args: Record<string, never>; Returns: string }
      generate_slug: { Args: { page_title: string }; Returns: string }
      is_reserved_username: { Args: { username: string }; Returns: boolean }
      update_daily_analytics: { Args: Record<string, never>; Returns: undefined }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
