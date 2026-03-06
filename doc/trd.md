
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
│   └── export
│       └── page.tsx
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

# 4. Supabase Configuration

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

# 7. CSV Export Implementation

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

# 20. Future Technical Enhancements

### GitHub Integration

Auto import repositories via GitHub API.

### AI Resume Builder

Use AI to convert project descriptions into resume bullets.

### Portfolio Generator

Generate developer portfolio automatically.

### API Key Vault

Store API keys securely.

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

