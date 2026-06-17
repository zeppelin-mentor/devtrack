
# Product Requirements Document (PRD)

## Product Name

**DevTrack – Project & Experience Manager**

## Version

1.0

## Objective

DevTrack is a web-based tool that helps developers track:

* Projects they worked on
* Gmail accounts used per project
* GitHub accounts and repositories
* Tech stacks used
* Hosting platforms
* Roles and responsibilities
* Project descriptions
* Experience for resumes

The system also allows exporting project experience in **CSV format** for use in **CVs, resumes, portfolios, and job applications**.

---

# 1. Product Goals

### Primary Goals

1. Centralize project information.
2. Track accounts used for projects.
3. Track tech stacks used across projects.
4. Store professional project descriptions.
5. Export experience data for resumes.

### Secondary Goals

* Improve developer productivity.
* Create a developer experience database.
* Generate structured project records.

---

# 2. Target Users

### Primary Users

* Freelance developers
* Software engineers
* Startup developers
* Students building portfolios

### Secondary Users

* Development agencies
* Technical recruiters (future)

---

# 3. Tech Stack

| Layer          | Technology          |
| -------------- | ------------------- |
| Frontend       | Next.js             |
| Styling        | TailwindCSS         |
| Backend        | Next.js API Routes  |
| Database       | Supabase PostgreSQL |
| Authentication | Supabase Auth       |
| Hosting        | Vercel              |

---

# 4. System Architecture

```
User
 ↓
Next.js Frontend
 ↓
Next.js API Routes
 ↓
Supabase Database
 ↓
Supabase Auth
```

---

# 5. Core Features

## 5.1 Authentication

Authentication will be handled by **Supabase Auth**.

### Features

* User registration
* Login
* Logout
* Password reset
* Session management

### Authentication Fields

| Field    | Type   |
| -------- | ------ |
| email    | string |
| password | string |

---

# 5.2 Dashboard

The dashboard provides an overview of all stored information.

### Components

Statistics cards:

* Total Projects
* Total Gmail Accounts
* Total GitHub Accounts
* Total Tech Stacks

Additional sections:

Recent Projects
Quick Add Buttons

---

# 5.3 Project Management

Users can create and manage projects.

### Features

* Add project
* Edit project
* Delete project
* View project
* Search projects
* Filter projects

### Project Fields

| Field            | Description              |
| ---------------- | ------------------------ |
| Project Name     | Name of project          |
| Project Type     | Web, AI, SaaS, etc       |
| Category         | Type of project          |
| Role             | User role in project     |
| Description      | Professional description |
| Responsibilities | Work performed           |
| Tech Stack       | Technologies used        |
| Hosting          | Deployment platform      |
| Domain           | Live site                |
| Repository       | GitHub repo              |
| Start Date       | Project start            |
| End Date         | Project completion       |

---

# 5.4 Gmail Account Manager

Allows users to track Gmail accounts used for projects.

### Features

* Add Gmail account
* Edit Gmail account
* Delete Gmail account
* Track usage across projects

### Fields

| Field          | Type   |
| -------------- | ------ |
| email          | string |
| recovery_email | string |
| notes          | text   |

---

# 5.5 GitHub Account Manager

Track GitHub accounts used for development.

### Features

* Add GitHub account
* Edit GitHub account
* Delete GitHub account

### Fields

| Field    | Type   |
| -------- | ------ |
| username | string |
| email    | string |
| ssh_key  | text   |
| notes    | text   |

---

# 5.6 Tech Stack Library

Allows users to maintain a list of technologies used across projects.

### Categories

Frontend
Backend
Database
DevOps
Mobile
AI

---

# 5.7 Pages & Documentation

Users can create Notion-style pages for project documentation, notes, and articles.

### Features

* Create and edit pages with Markdown support
* Link pages to projects or create standalone pages
* Auto-generate URL slugs for SEO-friendly sharing
* Make pages public with shareable links
* Track page views and engagement
* Quick project creation from page editor
* Autosave with change tracking
* Templates for common documentation types

### Page Fields

| Field       | Description                          |
| ----------- | ------------------------------------ |
| title       | Page title                           |
| content     | Markdown content                     |
| status      | draft / published / archived         |
| is_public   | Public sharing enabled               |
| share_token | Unique shareable URL token           |
| slug        | Auto-generated or custom URL slug    |
| project_id  | Linked project (optional)            |
| icon        | Custom emoji or icon                 |
| cover_url   | Header cover image                   |
| view_count  | Number of public views               |

### Sharing Features

* One-click public/private toggle
* Automatic share token generation
* Copy shareable link
* View count tracking
* Public page with branded layout
* SEO-friendly URLs with slugs

---

# 5.8 Experience Export

Users can export selected project experiences.

### Export Formats

CSV
JSON (future)
Markdown (future)

### Export Filters

* Role
* Category
* Tech stack
* Date range

---

# 6. UI Screens

## Authentication Screens

Login
Signup

---

## Dashboard

Sections:

* Statistics cards
* Recent projects
* Quick actions

---

## Projects Page

Table columns:

Project Name
Role
Category
Tech Stack
Repository
Domain
Actions

---

## Add/Edit Project Screen

Form inputs:

Project Name
Project Type
Category
Role
Description
Responsibilities
Tech Stack
Hosting
Repository
Domain
Start Date
End Date

---

## Gmail Accounts Page

Columns:

Email
Recovery Email
Projects Using
Actions

---

## GitHub Accounts Page

Columns:

Username
Email
Projects Using
Actions

---

## Tech Stack Page

Columns:

Stack Name
Category
Projects Using
Actions

---

## Pages Section

### Pages List Page

Columns:

Page Title with Icon
Linked Project
Status Badge
Public/Private Indicator
Last Updated
View Count (if public)
Actions (Edit/Delete)

### Create Page Screen

Form inputs:

Page Title
Auto-generate Slug Toggle
Custom Slug (optional)
Link to Existing Project
Create New Project (modal)
Template Selection
  - Blank
  - PRD Template
  - DRD Template
  - TRD Template
  - README Template
  - API Documentation

### Page Editor Screen

Editor Components:

Title Input with Icon
Cover Image URL
Markdown Editor with Toolbar
Insert Link Helper (Ctrl/Cmd+K)
Auto-save Indicator
Preview Panel

Sidebar Controls:

Status Dropdown (Draft/Published/Archived)
Project Selector with "Create New" Option
Public/Private Toggle
Share Link (when public)
Copy Link Button
View Count Display
Cover URL Input
Last Updated Timestamp
Save Button (Ctrl/Cmd+S)
Delete Button

### Public Page View (`/share/[token]`)

Elements:

DevTrack Branding Header
Page Title with Icon
Cover Image
Content Display (Markdown rendered)
Status Badge
View Count
Last Updated Date
Call-to-action to Create Account

---

## Export Page

Options:

Select projects
Apply filters
Export CSV

---

# 7. Non Functional Requirements

| Requirement  | Description                        |
| ------------ | ---------------------------------- |
| Security     | Data protected with authentication |
| Performance  | API < 500ms                        |
| Scalability  | Support thousands of records       |
| Availability | 99.9% uptime                       |

---

# 8. Security Requirements

* Row Level Security (Supabase)
* Authentication required for all APIs
* Sensitive fields encrypted
* User data isolation

---

# 9. Implemented Features

## Pages & Documentation System ✅ (Completed: June 17, 2026)

* Notion-style page editor with Markdown support
* Public sharing with automatic URL generation
* Auto-generated SEO-friendly slugs
* Project linking with quick project creation
* Page templates (PRD, DRD, TRD, README, API docs)
* View count tracking for public pages
* One-click public/private toggle
* Shareable links with unique tokens
* Autosave functionality
* Change tracking with save status indicators
* Public page access via direct URLs (`/pages/:id`)

## Public Portfolio Profile ✅ (Completed: June 17, 2026)

* User profile creation with display name, bio, and profile photo
* Social links (GitHub, LinkedIn, Twitter, website)
* Email visibility control
* Portfolio project selection and ordering
* Per-project visibility controls (8 fields: description, responsibilities, highlights, tech stack, repo, dates, team size, client)
* Public portfolio view at `/portfolio/[username]`
* View counter and analytics
* SEO-optimized with sitemap integration
* 3-level privacy system: account private → public portfolio → project-level controls

## MCP API Security Improvements ✅ (Completed: June 17, 2026)

* Fixed API key revocation to actually delete keys from database
* Fixed rate limit reset logic to properly reset after 24 hours
* Improved security and integrity of MCP API system

---

# 10. Future Features (Backlog)

## High Priority (P0)
* **Resume bullet generator** - AI-assisted resume bullet generation from project data
* **API key rotation & usage history UI** - Complete key management interface with usage analytics

## Important (P1)
* **Page/Article MCP tools** - Add `add_page`, `edit_page`, `list_pages` MCP tools for AI agents
* **Global search** - Search across projects/accounts/stacks/pages using Postgres FTS
* **Extended export formats** - Add Markdown and JSON export (CSV already exists)
* **Audit trail** - Track critical changes for projects and MCP key events
* **Project health status** - Red/Amber/Green status with blockers tracking
* **Analytics dashboard** - Track trends, stack usage, role mix with time-based views

## Nice to Have (P2)
* GitHub repo auto import
* AI resume generator from page content
* Portfolio website generator from public pages
* Domain expiry tracker
* Environment variable manager
* Page collaboration and comments
* Version history for pages
* Nested page hierarchy (parent-child relationships)
* Rich text editor (beyond Markdown)
* Page analytics dashboard

---

