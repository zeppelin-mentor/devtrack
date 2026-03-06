
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

# 5.7 Experience Export

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

# 9. Future Features

* GitHub repo auto import
* AI resume generator
* Portfolio generator
* Domain expiry tracker
* Environment variable manager

---

