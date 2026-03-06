# Database Requirements Document (DRD)

---

# Database Overview

Database system: **PostgreSQL (Supabase)**

Design goals:

* Normalize data
* Maintain relationships
* Ensure scalability
* Support filtering and exporting

---

# Database Entities

Main tables:

1. Users
2. Projects
3. Gmail Accounts
4. GitHub Accounts
5. Tech Stacks
6. Project Tech Stack Mapping
7. Categories
8. Roles

---

# Table: users

Managed by **Supabase Auth**

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| email      | text      |
| created_at | timestamp |

---

# Table: gmail_accounts

| Column         | Type      |
| -------------- | --------- |
| id             | uuid      |
| user_id        | uuid      |
| email          | text      |
| recovery_email | text      |
| notes          | text      |
| created_at     | timestamp |

---

# Table: github_accounts

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| username   | text      |
| email      | text      |
| ssh_key    | text      |
| notes      | text      |
| created_at | timestamp |

---

# Table: categories

| Column      | Type |
| ----------- | ---- |
| id          | uuid |
| name        | text |
| description | text |

Example values:

Web Development
AI
Mobile Apps
Marketplace
SaaS

---

# Table: roles

| Column | Type |
| ------ | ---- |
| id     | uuid |
| name   | text |

Example:

Frontend Developer
Backend Developer
Full Stack Developer
DevOps Engineer
AI Engineer

---

# Table: tech_stacks

| Column      | Type |
| ----------- | ---- |
| id          | uuid |
| name        | text |
| category    | text |
| description | text |

Example:

Next.js
React
Node.js
Supabase
MySQL

---

# Table: projects

| Column              | Type      |
| ------------------- | --------- |
| id                  | uuid      |
| user_id             | uuid      |
| name                | text      |
| project_type        | text      |
| category_id         | uuid      |
| role_id             | uuid      |
| project_description | text      |
| responsibilities    | text      |
| project_highlights  | text      |
| start_date          | date      |
| end_date            | date      |
| team_size           | integer   |
| client_name         | text      |
| gmail_id            | uuid      |
| github_id           | uuid      |
| repo_url            | text      |
| hosting             | text      |
| domain              | text      |
| notes               | text      |
| created_at          | timestamp |

---

# Table: project_tech_stack

Mapping table (Many-to-Many)

| Column        | Type |
| ------------- | ---- |
| id            | uuid |
| project_id    | uuid |
| tech_stack_id | uuid |

---

# Relationships

```
Users
 ├── Gmail Accounts
 ├── GitHub Accounts
 └── Projects

Projects
 ├── Category
 ├── Role
 ├── Gmail Account
 ├── GitHub Account
 └── Tech Stacks
```

---

# Indexing Strategy

Indexes for performance:

```
projects.user_id
projects.category_id
projects.role_id
project_tech_stack.project_id
```

---

# Data Export Structure (CSV)

Columns:

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

---

# Example CSV Output

```
Project Name,Role,Category,Description,Tech Stack
RapidAid,Full Stack Developer,AI Platform,"Emergency AI system","Next.js Node Supabase Twilio"
```

---

# Data Integrity Rules

1. Project must belong to a user.
2. Gmail account must belong to the same user.
3. GitHub account must belong to the same user.
4. Tech stacks must exist before linking.

---

# Backup Strategy

Supabase automatic backups.

Retention period: **7–30 days**.

---

# Estimated Database Scale

| Data              | Expected Volume |
| ----------------- | --------------- |
| Projects per user | 100–500         |
| Tech stacks       | 50              |
| Accounts          | 20              |
| Exports           | unlimited       |

---