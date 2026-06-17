# DevTrack – Developer Project & Experience Manager

A comprehensive web-based platform that helps developers track projects, manage accounts, showcase portfolios, create documentation pages, and export professional experience.

## ✨ Features

### 📊 Project Management
- Detailed project tracking with categories and roles
- Tech stack library and management
- Timeline tracking (start/end dates)
- Client and team information
- Repository and hosting details

### 🎨 Public Portfolio
- Create beautiful, shareable portfolios at `/portfolio/username`
- Complete privacy controls (3 levels)
- Social links integration
- View analytics
- SEO optimized

### 📝 Pages & Documentation
- Markdown-based page editor
- Cover images and icons
- Public page sharing (`/pages/:id` or `/share/:token`)
- Project linking
- Status management (draft/published/archived)

### 🔐 Account Management
- Gmail account tracking
- GitHub account tracking with SSH keys
- OAuth integration (Google & GitHub)

### 🔌 MCP Integration
- Self-hosted MCP server (`/api/mcp`)
- Per-user API key management
- Rate limiting (100 requests/day per key)
- Tools: `list_projects`, `add_project`, `edit_project`, and more

### 📤 Export & Sharing
- Export projects to CSV
- Public portfolio URLs
- Public page sharing
- Dynamic sitemap for SEO

## 🎯 New Features

### Public Portfolio Profile
Create a professional portfolio page with:
- Unique username (e.g., `/portfolio/john-doe`)
- Bio, location, and profile photo
- Social links (GitHub, LinkedIn, Twitter, Website)
- Selected projects showcase
- Privacy controls for each field
- View counter and analytics

[📖 Read the Portfolio User Guide](./doc/portfolio-user-guide.md)

### Public Pages
Share documentation and pages publicly:
- Direct URLs (`/pages/:id`)
- Beautiful read-only view
- Markdown rendering
- Cover images and icons
- View counter

[📖 Read the Public Pages Feature Doc](./doc/public-pages-feature.md)

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email + OAuth)
- **Storage**: Supabase Storage (profile photos, page covers)
- **Email**: Resend
- **Hosting**: Vercel
- **MCP**: Custom Model Context Protocol server

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- npm or yarn

### Installation

1. **Clone the repository**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MCP
MCP_API_KEY_PEPPER=random_secret_for_key_hashing

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=DevTrack <noreply@yourdomain.com>

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Database Setup**

Migrations are in `supabase/migrations/`:
- Use Supabase CLI: `supabase db push`
- Or run SQL files manually in Supabase Dashboard

Tables created:
- `projects` - Project information
- `gmail_accounts` - Gmail tracking
- `github_accounts` - GitHub tracking
- `tech_stacks` - Technology library
- `categories` - Project categories
- `roles` - Developer roles
- `project_tech_stack` - Project-tech relationships
- `pages` - Documentation pages
- `mcp_api_keys` - MCP API keys
- `user_profiles` - Portfolio profiles
- `portfolio_projects` - Portfolio project selections

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### OAuth Setup (Optional)

**Google OAuth:**
1. Supabase Dashboard → Authentication → Providers
2. Enable Google, add credentials
3. Redirect URL: `https://[project].supabase.co/auth/v1/callback`

**GitHub OAuth:**
1. Supabase Dashboard → Authentication → Providers
2. Enable GitHub
3. Create OAuth App: https://github.com/settings/developers
4. Callback: `https://[project].supabase.co/auth/v1/callback`

## 🔌 MCP Server

### Features
- HTTP transport at `/api/mcp`
- Per-user API key authentication
- Rate limiting (100 req/day per key)
- Tools for project management

### Setup for Users
1. Sign in to DevTrack
2. Navigate to `/mcp`
3. Create API key
4. Configure in your IDE (VS Code, Cursor, Kiro)

[📖 Setup Guide available at `/mcp/docs`](./app/mcp/docs/page.tsx)

### Live Endpoint
```
https://trackmydevelopement.vercel.app/api/mcp
```

### Available Tools
- `list_projects` - List all projects
- `add_project` - Create new project
- `edit_project` - Update project
- `get_project_details` - Get project details
- `export_projects` - Export to CSV
- `list_pages` - List documentation pages
- `add_page` - Create page
- `edit_page` - Update page
- And more...

## 📁 Project Structure

```
/app
  /api               - API routes
    /mcp            - MCP server
    /profile        - Portfolio API
    /portfolio      - Public portfolio API
    /pages          - Pages API
  /auth             - Authentication pages
  /dashboard        - Dashboard
  /projects         - Project management
  /pages            - Pages editor
  /profile          - Portfolio settings
  /portfolio/[username] - Public portfolio view
  /gmail-accounts   - Gmail tracking
  /github-accounts  - GitHub tracking
  /tech-stacks      - Tech stack library
  /mcp              - MCP management
  /export           - Data export
/components         - UI components
/lib                - Utilities
  /supabase        - Supabase client & helpers
  /mcp             - MCP server logic
/types              - TypeScript definitions
/doc                - Documentation
/supabase/migrations - Database migrations
```

## 📚 Documentation

### Specifications
- [Product Requirements (PRD)](./doc/prd.md)
- [Database Requirements (DRD)](./doc/drd.md)
- [Technical Requirements (TRD)](./doc/trd.md)
- [Portfolio Feature Specification](./doc/public-portfolio-profile.md)

### User Guides
- [Portfolio User Guide](./doc/portfolio-user-guide.md)

### Implementation
- [Portfolio Implementation](./doc/portfolio-implementation.md)
- [Public Pages Feature](./doc/public-pages-feature.md)
- [Database Verification](./doc/database-verification.md)

### Testing
- [Portfolio Testing Checklist](./doc/portfolio-testing-checklist.md)

### Roadmap
- [Continuous Improvements](./doc/continuous-improvements.md)

[📖 View Full Documentation Index](./doc/README.md)

## 🎨 Key Features Detail

### Public Portfolio
Create and share professional portfolios:
- **URL**: `/portfolio/your-username`
- **Privacy**: 3-level control (profile, projects, details)
- **Content**: Bio, projects, tech stacks, social links
- **Analytics**: View counter, last viewed
- **SEO**: Indexed by search engines

### Documentation Pages
Create and share documentation:
- **Markdown Editor**: Full GFM support
- **Rich Media**: Cover images, icons, emojis
- **Sharing**: Public URLs (`/pages/:id`)
- **Organization**: Link to projects, status management
- **Collaboration**: Share tokens for review

### MCP Integration
Manage DevTrack from your IDE:
- **API Keys**: Personal, rate-limited access
- **Tools**: Full project CRUD operations
- **Security**: Hashed keys, request logging
- **Monitoring**: Rate limit headers, usage tracking

## 🚀 Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your repo
2. Add environment variables
3. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MCP_API_KEY_PEPPER=secure_random_string
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=DevTrack <noreply@yourdomain.com>
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔐 Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- API key hashing with pepper
- Rate limiting on MCP endpoints
- XSS and SQL injection prevention
- Secure file uploads (Supabase Storage)

## 📊 Database Migrations

All migrations are in `supabase/migrations/`:

```bash
# Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# Manual
# Run SQL files in Supabase Dashboard SQL Editor
```

Recent migrations:
- Portfolio feature (user_profiles, portfolio_projects)
- Public pages access policy
- MCP API keys with rate limiting
- Pages feature with sharing

## 🤝 Contributing

1. Read the documentation in `/doc`
2. Follow existing code patterns
3. Add tests for new features
4. Update documentation
5. Submit pull request

## 📝 License

MIT

## 🔗 Links

- **Live Demo**: https://trackmydevelopement.vercel.app
- **MCP Endpoint**: https://trackmydevelopement.vercel.app/api/mcp
- **Documentation**: [./doc](./doc)

## 📧 Support

For issues or questions:
1. Check [Documentation](./doc)
2. Review [Testing Checklist](./doc/portfolio-testing-checklist.md)
3. Open an issue on GitHub

---

**Built with Next.js, Supabase, and TypeScript** 🚀
