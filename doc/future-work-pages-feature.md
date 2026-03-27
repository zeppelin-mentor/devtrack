# Future Work Roadmap: Notion-Style Pages Feature

## Goal
Add a Notion-like Pages module where each user can write structured project articles, notes, and documentation.

This roadmap is split into practical phases so implementation can be done incrementally without breaking current DevTrack features.

---

## Phase 0: Discovery and Planning

### Outcome
Clear scope, UX boundaries, and technical direction.

### Tasks
- Define "Pages" terminology in product copy (Page, Article, Draft, Published).
- Decide editor format for MVP:
  - Markdown string (simpler), or
  - JSON rich-text document (more flexible).
- Confirm where pages appear in navigation and how they connect to projects.
- Finalize success criteria for MVP.

### Exit Criteria
- Approved wireframe for list page and editor page.
- Final decision on content storage format.

---

## Phase 1: Core Data Model and CRUD (MVP Foundation)

### Outcome
Users can create, edit, view, and delete pages.

### Database Changes
Add table `pages`:
- `id` uuid primary key
- `user_id` uuid not null
- `project_id` uuid null
- `parent_id` uuid null
- `title` text not null
- `slug` text null
- `content` text or jsonb not null
- `status` text default `draft` (`draft|published|archived`)
- `created_at` timestamp
- `updated_at` timestamp

### RLS Rules
- Users can only access pages where `user_id = auth.uid()`.

### App Routes
- `/pages` list page
- `/pages/create` create page
- `/pages/[id]` editor/view page

### API
- `GET /api/pages`
- `POST /api/pages`
- `GET /api/pages/:id`
- `PUT /api/pages/:id`
- `DELETE /api/pages/:id`

### Exit Criteria
- Full CRUD works for authenticated users.
- Page persists and reloads correctly.

---

## Phase 2: Editor UX and Productivity

### Outcome
Writing experience feels smooth and practical.

### Tasks
- Add autosave with debounce (500-1000ms).
- Add unsaved changes indicator.
- Add title + cover + icon fields.
- Support markdown shortcuts or lightweight rich-text controls.
- Add keyboard shortcuts:
  - `Ctrl/Cmd + S` manual save
  - `Ctrl/Cmd + K` insert link

### Exit Criteria
- Stable editor with autosave and no accidental data loss.

---

## Phase 3: Project Linking and Knowledge Structure

### Outcome
Pages become useful project knowledge assets instead of isolated notes.

### Tasks
- Link page to project (`project_id`).
- Add optional page hierarchy using `parent_id`.
- Add project filter in pages list.
- Show linked pages on project detail view.
- Add templates:
  - PRD
  - DRD
  - TRD
  - Weekly progress update
  - Project retrospective

### Exit Criteria
- A project can have multiple linked pages.
- User can quickly start from templates.

---

## Phase 4: Publish, Share, and Export

### Outcome
Pages can be shared externally and reused for portfolios.

### Tasks
- Add `published` state and public page route:
  - `/p/[slug]`
- Add SEO metadata for public pages.
- Export page as Markdown and PDF.
- Add "Convert to portfolio summary" helper action.

### Exit Criteria
- Users can publish selected pages publicly.
- Users can export article content for external use.

---

## Phase 5: MCP and AI Workflow Integration

### Outcome
Pages are writable/readable from coding assistants.

### MCP Tools (Planned)
- `list_pages`
- `get_page`
- `add_page`
- `edit_page`
- `delete_page`
- `publish_page`
- `link_page_to_project`

### AI Helpers (Planned)
- Generate article from project data.
- Summarize page into resume bullets.
- Improve grammar and formatting.

### Exit Criteria
- MCP clients can manage pages safely per user.
- AI helpers produce useful draft content.

---

## Recommended Implementation Order
1. Phase 1 (minimum usable feature)
2. Phase 2 (editor reliability)
3. Phase 3 (project value)
4. Phase 4 (external sharing)
5. Phase 5 (automation and AI)

---

## Risks and Mitigation
- Editor complexity risk:
  - Start with markdown-first MVP, then evolve.
- Data consistency risk with autosave:
  - Use updated timestamps + optimistic UI + retry.
- Scope creep risk:
  - Keep hierarchy, collaboration, and AI out of MVP.

---

## Definition of Done (For Initial Release)
- Authenticated user can create, edit, delete, and view pages.
- Page can be linked to a project.
- Editor autosave works reliably.
- RLS protects user data.
- Basic search by title/content works.
- UI is responsive on desktop and mobile.
