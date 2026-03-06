# DevTrack – Developer Project & Experience Manager

A web-based tool that helps developers track projects, accounts, tech stacks, and export professional experience for resumes and portfolios.

## Features

- Project management with detailed tracking
- Gmail and GitHub account management
- Tech stack library
- Experience export to CSV
- Professional project descriptions
- Role and responsibility tracking

## Tech Stack

- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

4. Database Setup:

The database schema is automatically created using Supabase migrations. The following tables are created:
- `projects` - Project information
- `gmail_accounts` - Gmail account tracking
- `github_accounts` - GitHub account tracking
- `tech_stacks` - Technology stack library
- `categories` - Project categories
- `roles` - Developer roles
- `project_tech_stack` - Many-to-many relationship between projects and tech stacks

Row Level Security (RLS) policies are enabled to ensure users can only access their own data.

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/app
  /dashboard       - Dashboard with statistics
  /projects        - Project management
  /gmail-accounts  - Gmail account tracking
  /github-accounts - GitHub account tracking
  /tech-stacks     - Tech stack library
  /export          - Experience export
/components        - Reusable UI components
/lib               - Utilities and services
/types             - TypeScript definitions
```

## Documentation

- [Product Requirements (PRD)](./doc/prd.md)
- [Database Requirements (DRD)](./doc/drd.md)
- [Technical Requirements (TRD)](./doc/trd.md)

## Key Features

### Dashboard
View statistics and recent projects at a glance.

### Project Management
Track project details including:
- Name, type, and category
- Role and responsibilities
- Tech stack used
- Repository and hosting info
- Start and end dates

### Account Management
Manage Gmail and GitHub accounts used across projects.

### Tech Stack Library
Maintain a library of technologies used in your projects.

### Experience Export
Export selected projects to CSV format for resumes and job applications.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

## License

MIT
