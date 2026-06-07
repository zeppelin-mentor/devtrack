
# Technical Requirements Document (TRD)

## Product Name

**DevTrack – Developer Project & Experience Manager**

## Version

1.0

## Technology Stack

| Layer          | Technology           |
| -------------- | -------------------- |
| Frontend       | Next.js (App Router) |
| Styling        | TailwindCSS          |
| Backend        | Next.js API Routes   |
| Database       | Supabase PostgreSQL  |
| Authentication | Supabase Auth        |
| Hosting        | Vercel               |

---

# 1. System Architecture

## High Level Architecture

```
Client (Browser)
     ↓
Next.js Frontend (React)
     ↓
Next.js API Routes
     ↓
Supabase SDK
     ↓
PostgreSQL Database
     ↓
Supabase Auth
```

### Responsibilities

**Frontend**

* UI rendering
* Form handling
* API communication
* Client validation

**Backend API**

* Business logic
* Data validation
* CSV generation
* Secure DB operations

**Database**

* Store application data
* Manage relationships
* Enforce integrity

**Authentication**

* User login/session
* Access control

---

# 2. Application Modules

## Core Modules

1. Authentication Module
2. Dashboard Module
3. Project Management Module
4. Gmail Account Manager
5. GitHub Account Manager
6. Tech Stack Manager
7. Experience Export Module
8. Search & Filtering

---

# 3. Next.js Project Structure

Recommended structure using **Next.js App Router**

```
/devtrack
│
├── app
│   ├── layout.tsx
│   ├── page.tsx
│
│   ├── dashboard
│   │   └── page.tsx
│
│   ├── projects
│   │   ├── page.tsx
│   │   ├── create
│   │   │   └── page.tsx
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── edit
│   │       └── page.tsx
│
│   ├── gmail-accounts
│   │   └── page.tsx
│
│   ├── github-accounts
│   │   └── page.tsx
│
│   ├── tech-stacks
│   │   └── page.tsx
│
│   ├── export
│       └── page.tsx
│
│   ├── pages
│   │   ├── page.tsx
│   │   ├── create
│   │   │   └── page.tsx
│   │   └── [id]
│   │       └── page.tsx
│
│   └── share
│       └── [token]
│           └── page.tsx
│
├── components
│   ├── ui
│   ├── forms
│   ├── tables
│   └── dashboard
│
├── lib
│   ├── supabase
│   │   ├── client.ts
│   │   └── server.ts
│   ├── csv
│   │   └── export.ts
│   └── utils
│
├── services
│   ├── projectService.ts
│   ├── gmailService.ts
│   ├── githubService.ts
│   └── exportService.ts
│
├── app/api
│   ├── projects
│   ├── gmail
│   ├── github
│   ├── techstack
│   └── export
│
└── types
    └── index.ts
```

---

# 4. Database Schema

## Core Tables

### pages

| Column         | Type      | Description                      |
| -------------- | --------- | -------------------------------- |
| id             | uuid      | Primary key                      |
| user_id        | uuid      | Foreign key to auth.users        |
| project_id     | uuid      | Foreign key to projects (null)   |
| parent_id      | uuid      | Self-referencing for hierarchy   |
| title          | text      | Page title                       |
| slug           | text      | URL-friendly slug (unique)       |
| content        | text      | Markdown content                 |
| status         | text      | draft/published/archived         |
| icon           | text      | Emoji or icon character          |
| cover_url      | text      | Cover image URL                  |
| is_public      | boolean   | Public sharing enabled           |
| share_token    | text      | Unique shareable token (unique)  |
| view_count     | integer   | Number of public views           |
| last_viewed_at | timestamp | Last public view timestamp       |
| created_at     | timestamp | Creation timestamp               |
| updated_at     | timestamp | Auto-updated timestamp           |

### Database Functions

**generate_share_token()**
- Generates unique 12-character alphanumeric token
- Ensures no collision with existing tokens
- Returns string token

**generate_slug(page_title text)**
- Converts title to lowercase URL-safe slug
- Replaces spaces and special characters with hyphens
- Ensures uniqueness per user by appending counter
- Limits length to 60 characters

### Database Triggers

**set_pages_updated_at**
- Automatically updates `updated_at` on row modification
- Runs before UPDATE on pages table

### Row Level Security Policies

```sql
-- Users can view own pages OR public pages
CREATE POLICY "Anyone can view public pages"
  ON pages FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Users can create own pages
CREATE POLICY "Users can create own pages"
  ON pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own pages
CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own pages
CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  USING (auth.uid() = user_id);
```

---

# 5. Supabase Configuration

## Required Supabase Services

* PostgreSQL database
* Supabase Auth
* Row Level Security (RLS)
* Storage (optional future use)

---

# 5. Authentication Implementation

Authentication will use **Supabase Auth Email/Password**.

### Login Flow

```
User enters email/password
        ↓
Supabase Auth request
        ↓
Session created
        ↓
Session stored in cookies
        ↓
User redirected to dashboard
```

### Authentication Middleware

Next.js middleware should protect routes.

Example protected routes:

```
/dashboard
/projects
/gmail-accounts
/github-accounts
/export
```

---

# 6. API Design

All APIs will be implemented using **Next.js API Routes**.

Base path:

```
/api/
```

---

# 6.1 Projects API

## Create Project

```
POST /api/projects
```

Payload

```json
{
"name": "RapidAid",
"project_type": "AI",
"category_id": "uuid",
"role_id": "uuid",
"description": "Emergency AI dispatch system",
"tech_stacks": ["uuid","uuid"],
"repo_url": "github.com/project",
"hosting": "Vercel"
}
```

---

## Get All Projects

```
GET /api/projects
```

Query parameters:

```
?role=frontend
?category=AI
?search=Rapid
```

---

## Get Single Project

```
GET /api/projects/{id}
```

---

## Update Project

```
PUT /api/projects/{id}
```

---

## Delete Project

```
DELETE /api/projects/{id}
```

---

# 6.2 Gmail Accounts API

### Create Gmail

```
POST /api/gmail
```

### Get Gmail Accounts

```
GET /api/gmail
```

### Update Gmail

```
PUT /api/gmail/{id}
```

### Delete Gmail

```
DELETE /api/gmail/{id}
```

---

# 6.3 GitHub Accounts API

### Create GitHub Account

```
POST /api/github
```

### Get GitHub Accounts

```
GET /api/github
```

### Update GitHub Account

```
PUT /api/github/{id}
```

### Delete GitHub Account

```
DELETE /api/github/{id}
```

---

# 6.4 Tech Stack API

```
GET /api/techstack
POST /api/techstack
PUT /api/techstack/{id}
DELETE /api/techstack/{id}
```

---

# 6.5 Export API

```
GET /api/export
```

Query parameters

```
?role=FullStack
?category=AI
?format=csv
```

---

# 7. Pages Feature Implementation

## 7.1 Editor Architecture

### Auto-save Strategy

```typescript
useEffect(() => {
  if (!dirty || loading || !page) return;
  
  const timeout = setTimeout(() => {
    savePage();
  }, 800);
  
  return () => clearTimeout(timeout);
}, [dirty, loading, page, savePage]);
```

- Debounced autosave (800ms after last change)
- Visual save status indicator (saved/saving/unsaved/error)
- Manual save with Ctrl/Cmd+S shortcut

### Content Format

Pages use **Markdown** for content storage:
- Simple to parse and render
- Copy-paste friendly
- Compatible with external tools
- Extensible to rich text in future

---

## 7.2 Sharing Implementation

### Public Sharing Flow

```
User clicks "Make Public"
        ↓
Call generate_share_token()
        ↓
Update page: is_public=true, share_token={token}
        ↓
Display shareable link
```

### Share URL Format

```
https://devtrack.com/share/{12-char-token}
```

Example: `https://devtrack.com/share/aB3xK9mPq2Lz`

### Public Page View

- No authentication required
- Increments view_count on load
- Updates last_viewed_at timestamp
- Shows DevTrack branding
- Displays read-only content
- Includes CTA to create account

---

## 7.3 Slug Generation

### Auto-generation Logic

```typescript
// Backend function
generate_slug('My Project Guide 2024!')
// Returns: 'my-project-guide-2024'

// If slug exists, appends counter
generate_slug('My Project Guide 2024!') // second call
// Returns: 'my-project-guide-2024-1'
```

### Manual Slug Override

Users can disable auto-generation and provide custom slug:
- Validates URL-safe characters
- Still ensures uniqueness per user
- Falls back to auto-generation if empty

---

## 7.4 Project Linking UX

### Quick Project Creation

From page create/edit screen:
1. Click "Create New" button next to project dropdown
2. Modal opens with project name input
3. Create project instantly
4. Auto-selects newly created project
5. Continue editing page

No need to leave page editor to create project.

---

## 7.5 Page Templates

### Available Templates

```typescript
const pageTemplates = [
  {
    id: 'blank',
    name: 'Blank Page',
    content: ''
  },
  {
    id: 'prd',
    name: 'Product Requirements',
    content: '# Product Requirements Document\n\n## Overview\n...'
  },
  {
    id: 'drd',
    name: 'Design Requirements',
    content: '# Design Requirements Document\n\n## Goals\n...'
  },
  {
    id: 'trd',
    name: 'Technical Requirements',
    content: '# Technical Requirements Document\n\n## Architecture\n...'
  },
  {
    id: 'readme',
    name: 'README',
    content: '# Project Name\n\n## Installation\n...'
  },
  {
    id: 'api',
    name: 'API Documentation',
    content: '# API Documentation\n\n## Endpoints\n...'
  }
];
```

Templates populate initial content but are fully editable.

---

# 8. CSV Export Implementation

The CSV generator will convert project records into CSV.

### CSV Fields

```
Project Name
Role
Category
Description
Responsibilities
Tech Stack
Start Date
End Date
Repository
Domain
```

### CSV Generation Logic

1. Fetch filtered projects
2. Map data fields
3. Convert to CSV
4. Return downloadable file

Example implementation

```
lib/csv/export.ts
```

Use libraries like:

```
papaparse
json2csv
```

---

# 8. Data Fetching Strategy

### Server Components

Used for:

* Dashboard stats
* Project lists

### Client Components

Used for:

* Forms
* Filters
* Search
* Export actions

---

# 9. State Management

Use **React built-in state**.

Tools:

```
useState
useEffect
useContext
```

Optional improvement:

```
Zustand
```

---

# 10. Form Handling

Forms handled using:

```
React Hook Form
```

Validation using:

```
Zod
```

Example

```
Project creation form
```

Validation rules:

* Name required
* Role required
* Category required
* Description optional

---

# 11. UI Components

Reusable components should include:

### Layout Components

* Sidebar
* Header
* Dashboard cards

### Form Components

* Input
* Textarea
* Dropdown
* Date picker

### Table Components

* Project table
* Account tables

### Utility Components

* Modal
* Confirm dialog
* Pagination

---

# 12. Security Implementation

### Row Level Security

Supabase RLS policies must ensure:

```
user_id = auth.uid()
```

Users can only access their own data.

Example policy

```
CREATE POLICY "User access only"
ON projects
FOR SELECT
USING (auth.uid() = user_id);
```

---

# 13. Performance Requirements

| Feature           | Target  |
| ----------------- | ------- |
| API response      | < 500ms |
| Page load         | < 2s    |
| Export generation | < 1s    |

---

# 14. Pagination Strategy

Large datasets should use pagination.

Example:

```
GET /api/projects?page=1&limit=20
```

---

# 15. Search Implementation

Search fields:

* project name
* tech stack
* category
* role

Database query example

```
ILIKE %search%
```

---

# 16. Logging

Error logging should capture:

* API errors
* Export failures
* Auth errors

Tools

```
console logs (initial)
Sentry (future)
```

---

# 17. Deployment

Deployment platform:

**Vercel**

Steps:

1. Connect GitHub repo
2. Add environment variables
3. Deploy

Required env variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

# 18. Backup Strategy

Handled by Supabase.

Backup retention:

7–30 days.

---

# 19. Testing Requirements

Testing types:

### Unit Testing

Test:

* API routes
* CSV generation

Tools:

```
Jest
```

### Integration Testing

Test:

* Project creation
* Export functionality

---

# 20. Implemented Features (Latest)

## Pages System ✅

### Core Features
- Full CRUD for pages with Markdown editor
- Autosave with 800ms debounce
- Project linking with quick creation modal
- Public sharing with unique tokens
- Auto-generated SEO slugs
- View count tracking
- Page templates (PRD, DRD, TRD, README, API docs)

### Database Features
- Row Level Security policies
- Automatic slug generation function
- Share token generation function
- Updated_at trigger
- Unique constraints on share_token and user-slug pairs

### UI Features
- Real-time save status indicator
- Public/private toggle
- Copy shareable link button
- Insert link helper (Ctrl/Cmd+K)
- Keyboard shortcuts
- Responsive editor layout
- Preview panel
- Icon and cover image support

---

# 21. MCP (Model Context Protocol) Implementation

## Architecture

DevTrack implements a modular MCP server that exposes all functionality through structured API tools.

### Server Structure

```
lib/mcp/
├── projectsServer.ts          # Main server entry point
├── security.ts                # API key validation & rate limiting
├── tools/                     # Modular tool registrations
│   ├── projects.ts           # Project CRUD operations
│   ├── pages.ts              # Page CRUD & sharing operations
│   ├── accounts.ts           # Gmail/GitHub account management
│   └── techStacks.ts         # Tech stack management
└── utils/
    └── projectHelpers.ts     # Shared utility functions
```

### Modular Tool Registration

Each tool category is registered through a dedicated function:

```typescript
// Main server initialization
export function createProjectsMcpServerForUser(userId: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const server = new McpServer({
    name: 'devtrack-projects-mcp-http',
    version: '1.0.0',
  });

  // Register all modular tools
  registerProjectsTools(server, supabaseAdmin, userId);
  registerPagesTools(server, supabaseAdmin, userId);
  registerAccountsTools(server, supabaseAdmin, userId);
  registerTechStacksTools(server, supabaseAdmin);

  return server;
}
```

### Available Tools

#### Project Tools
- `list_projects` - List all projects with status filtering
- `add_project` - Create new project
- `edit_project` - Update existing project
- `get_project_details` - Get full project details with relations
- `export_projects` - Export projects as CSV
- `delete_project` - Delete project

#### Page Tools
- `list_pages` - List pages with filtering
- `get_page` - Get page details
- `add_page` - Create new page with Markdown
- `edit_page` - Update page content
- `delete_page` - Delete page
- `publish_page` - Make page public and generate shareable link
- `unpublish_page` - Make page private

#### Account Tools
- `add_gmail_account` - Create Gmail account entry
- `add_github_account` - Create GitHub account entry

#### Tech Stack Tools
- `add_tech_stack` - Create or get tech stack

### Security & Rate Limiting

#### API Key System
- Custom API keys stored in `mcp_api_keys` table
- Keys linked to user accounts
- Can be enabled/disabled per key
- Rate limit: 100 requests/day per API key

#### Authentication Flow
```
Request → Extract API Key → Validate Key → Check Rate Limit → Process Request
```

#### Rate Limit Headers
```
x-ratelimit-limit: 100
x-ratelimit-remaining: 95
x-ratelimit-reset-date: 2024-01-01T00:00:00Z
```

### MCP Configuration

Client configuration in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "devtrack": {
      "url": "http://localhost:3000/api/mcp",
      "headers": {
        "x-api-key": "mcp_xxxxxxxxxxxxx"
      }
    }
  }
}
```

### API Endpoint

```
POST /api/mcp
```

Supports:
- Streamable HTTP transport
- JSON request/response
- Rate limiting
- Error handling

### Helper Functions

Shared utilities in `utils/projectHelpers.ts`:
- `normalizeProjectStatus` - Determine pending/worked status
- `getProjectTechStackIds` - Fetch tech stack associations
- `replaceProjectTechStacks` - Update tech stack mappings
- `resolveTechStackIds` - Find or create tech stacks
- `findOrCreateCategoryId` - Auto-create categories
- `findOrCreateRoleId` - Auto-create roles
- `buildProjectDetails` - Enrich project with relations
- `escapeCsvCell` - CSV formatting helper
- `uniqueStrings` - Array deduplication

### Benefits of Modular Architecture

1. **Maintainability** - Each tool category in separate file
2. **Testability** - Tools can be unit tested independently
3. **Scalability** - Easy to add new tool categories
4. **Reusability** - Helper functions shared across tools
5. **Type Safety** - Full TypeScript support throughout
6. **Separation of Concerns** - Clear boundaries between features

---

# 22. Future Technical Enhancements

### GitHub Integration

Auto import repositories via GitHub API.

### AI Resume Builder

Use AI to convert project descriptions and pages into resume bullets.

### Portfolio Generator

Generate developer portfolio automatically from public pages.

### API Key Vault

Store API keys securely.

### Pages Enhancements
- Rich text editor (beyond Markdown)
- Real-time collaboration
- Version history and restore
- Page hierarchy with drag-and-drop
- Comments and discussions
- Page analytics dashboard
- Export to PDF
- Custom domains for public pages

---

# Final Deliverables for Development

Developers should implement:

1. Supabase database schema
2. Next.js frontend
3. API routes
4. CSV export system
5. Authentication system
6. Filtering and search
7. Responsive UI

---

