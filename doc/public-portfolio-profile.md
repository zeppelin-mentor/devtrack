# Public Portfolio Profile Feature Specification

**Feature ID:** IMP-005  
**Priority:** P0 (High)  
**Status:** Planned - Ready for Implementation  
**Effort:** Medium (2-3 weeks)  
**Owner:** TBD  
**Approved By:** User  
**Date Created:** June 8, 2026

---

## 📋 Executive Summary

Enable DevTrack users to create beautiful, public-facing portfolio profiles showcasing their projects with granular privacy controls. Users will have complete control over what information is visible to the public.

---

## 🎯 Problem Statement

**Current State:**
- Users track projects in DevTrack but cannot showcase them publicly
- No easy way to share professional portfolio with recruiters/clients
- Projects and accomplishments are private only

**Desired State:**
- Users have a public portfolio URL (e.g., `/portfolio/username`)
- Complete control over project visibility and information display
- Professional presentation of work history
- Shareable link for job applications and networking

**User Pain Points:**
1. Have to maintain separate portfolio websites
2. Data duplication between DevTrack and portfolio sites
3. No centralized place to showcase projects
4. Difficult to control what's public vs private

---

## 👥 User Stories

### As a Developer
1. **I want** to create a public portfolio profile **so that** I can share my work with recruiters
2. **I want** to select which projects appear on my portfolio **so that** I only showcase my best work
3. **I want** to control what information is shown per project **so that** I can protect sensitive client data
4. **I want** a shareable URL **so that** I can easily add it to my resume and LinkedIn

### As a Recruiter/Visitor
1. **I want** to see a developer's public projects **so that** I can evaluate their experience
2. **I want** to see tech stacks used **so that** I can match candidates to roles
3. **I want** to contact the developer **so that** I can discuss opportunities

---

## 🏗️ Technical Architecture

### Database Schema

#### New Table: `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  location TEXT,
  
  -- Profile visibility settings
  is_public BOOLEAN DEFAULT FALSE,
  available_for_work BOOLEAN DEFAULT FALSE,
  show_email BOOLEAN DEFAULT FALSE,
  
  -- Social links
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  show_github BOOLEAN DEFAULT TRUE,
  show_linkedin BOOLEAN DEFAULT TRUE,
  show_twitter BOOLEAN DEFAULT TRUE,
  show_website BOOLEAN DEFAULT TRUE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  CONSTRAINT username_lowercase CHECK (username = LOWER(username))
);

-- Indexes
CREATE UNIQUE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_is_public ON user_profiles(is_public);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public profiles"
  ON user_profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
```

#### New Table: `portfolio_projects`

```sql
CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Visibility settings
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, project_id)
);

-- Indexes
CREATE INDEX idx_portfolio_projects_user_id ON portfolio_projects(user_id);
CREATE INDEX idx_portfolio_projects_project_id ON portfolio_projects(project_id);
CREATE INDEX idx_portfolio_projects_order ON portfolio_projects(user_id, display_order);

-- RLS Policies
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own portfolio projects"
  ON portfolio_projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view portfolio projects of public profiles"
  ON portfolio_projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = portfolio_projects.user_id
      AND user_profiles.is_public = true
    )
    AND is_visible = true
  );
```

#### Extend Table: `projects`

```sql
-- Add visibility control columns
ALTER TABLE projects ADD COLUMN show_description BOOLEAN DEFAULT TRUE;
ALTER TABLE projects ADD COLUMN show_responsibilities BOOLEAN DEFAULT TRUE;
ALTER TABLE projects ADD COLUMN show_highlights BOOLEAN DEFAULT TRUE;
ALTER TABLE projects ADD COLUMN show_tech_stack BOOLEAN DEFAULT TRUE;
ALTER TABLE projects ADD COLUMN show_repo BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN show_dates BOOLEAN DEFAULT TRUE;
ALTER TABLE projects ADD COLUMN show_team_size BOOLEAN DEFAULT TRUE;
ALTER TABLE projects ADD COLUMN show_client BOOLEAN DEFAULT FALSE;

-- Update RLS policy for public portfolio access
CREATE POLICY "Public can view portfolio projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_projects pp
      JOIN user_profiles up ON up.user_id = pp.user_id
      WHERE pp.project_id = projects.id
      AND up.is_public = true
      AND pp.is_visible = true
    )
  );
```

---

## 🎨 User Interface Design

### 1. Profile Settings Page (`/profile`)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Profile Settings                           [Preview]     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ Basic Information                                         │
│ ┌─────────────────────────────────────────────────┐     │
│ │ [Photo Upload]  Username: john-doe              │     │
│ │                 Display Name: John Doe          │     │
│ │                 Bio: [Markdown editor]          │     │
│ │                 Location: San Francisco, CA     │     │
│ └─────────────────────────────────────────────────┘     │
│                                                           │
│ Visibility Settings                                       │
│ ┌─────────────────────────────────────────────────┐     │
│ │ ☑ Make portfolio public                         │     │
│ │ ☑ Available for work                            │     │
│ │ ☐ Show email address                            │     │
│ └─────────────────────────────────────────────────┘     │
│                                                           │
│ Social Links                                              │
│ ┌─────────────────────────────────────────────────┐     │
│ │ GitHub:   [URL input]                  ☑ Show   │     │
│ │ LinkedIn: [URL input]                  ☑ Show   │     │
│ │ Twitter:  [URL input]                  ☑ Show   │     │
│ │ Website:  [URL input]                  ☑ Show   │     │
│ └─────────────────────────────────────────────────┘     │
│                                                           │
│ Portfolio Projects                                        │
│ ┌─────────────────────────────────────────────────┐     │
│ │ All Projects (2)                      [+ Add All]│     │
│ │                                                   │     │
│ │ ☑ [≡] Project Alpha          [⚙ Settings] [×]   │     │
│ │ ☑ [≡] Project Beta           [⚙ Settings] [×]   │     │
│ │ ☐     Project Gamma                              │     │
│ └─────────────────────────────────────────────────┘     │
│                                                           │
│ Portfolio URL                                             │
│ ┌─────────────────────────────────────────────────┐     │
│ │ trackmydevelopement.com/portfolio/john-doe      │     │
│ │                           [Copy Link] [QR Code] │     │
│ └─────────────────────────────────────────────────┘     │
│                                                           │
│ Analytics                                                 │
│ ┌─────────────────────────────────────────────────┐     │
│ │ Total Views: 127                                │     │
│ │ Last Viewed: 2 hours ago                        │     │
│ └─────────────────────────────────────────────────┘     │
│                                                           │
│                    [Save Changes]                         │
└─────────────────────────────────────────────────────────┘
```

**Project Settings Modal:**
```
┌──────────────────────────────────────────┐
│ Project Visibility Settings              │
├──────────────────────────────────────────┤
│ Project: Alpha Platform                  │
│                                          │
│ Show on Portfolio:                       │
│ ☑ Description                            │
│ ☑ Responsibilities                       │
│ ☑ Highlights                             │
│ ☑ Tech Stack                             │
│ ☐ Repository Link                        │
│ ☑ Project Dates                          │
│ ☑ Team Size                              │
│ ☐ Client Name                            │
│                                          │
│          [Cancel]  [Save Settings]       │
└──────────────────────────────────────────┘
```

---

### 2. Public Portfolio View (`/portfolio/[username]`)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                      DevTrack                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│           [Photo]                                         │
│                                                           │
│          John Doe                                         │
│     Full Stack Developer                                 │
│     📍 San Francisco, CA                                 │
│                                                           │
│     [💼 Available for Work]                              │
│                                                           │
│     Bio goes here with markdown support...                │
│                                                           │
│     [GitHub] [LinkedIn] [Twitter] [Website]              │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Featured Projects                                        │
│                                                           │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │ Project Alpha         │  │ Project Beta          │  │
│  │                       │  │                       │  │
│  │ Description...        │  │ Description...        │  │
│  │                       │  │                       │  │
│  │ React TypeScript      │  │ Node.js PostgreSQL   │  │
│  │ Tailwind              │  │ Docker                │  │
│  │                       │  │                       │  │
│  │ Jan 2024 - Mar 2024   │  │ Apr 2024 - Present   │  │
│  │ Team Size: 3          │  │ Team Size: 5         │  │
│  └───────────────────────┘  └───────────────────────┘  │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│         Powered by DevTrack                               │
│         Create your own portfolio                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Profile Management (Authenticated)

#### `GET /api/profile`
Get current user's profile.

**Response:**
```json
{
  "id": "uuid",
  "username": "john-doe",
  "display_name": "John Doe",
  "bio": "Full stack developer...",
  "profile_photo_url": "https://...",
  "location": "San Francisco, CA",
  "is_public": true,
  "available_for_work": true,
  "show_email": false,
  "github_url": "https://github.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "show_github": true,
  "show_linkedin": true,
  "view_count": 127,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-06-01T00:00:00Z"
}
```

#### `POST /api/profile`
Create user profile.

**Request:**
```json
{
  "username": "john-doe",
  "display_name": "John Doe",
  "bio": "Full stack developer...",
  "location": "San Francisco, CA",
  "is_public": true,
  "available_for_work": true,
  "github_url": "https://github.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe"
}
```

#### `PUT /api/profile`
Update profile.

#### `DELETE /api/profile`
Delete profile (soft delete or cascade).

---

### Portfolio Projects (Authenticated)

#### `GET /api/portfolio/projects`
Get user's portfolio project selections.

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "is_visible": true,
      "display_order": 1,
      "project": {
        "id": "uuid",
        "name": "Project Alpha",
        "show_description": true,
        "show_tech_stack": true,
        "show_repo": false
      }
    }
  ]
}
```

#### `POST /api/portfolio/projects`
Add project to portfolio.

**Request:**
```json
{
  "project_id": "uuid"
}
```

#### `PUT /api/portfolio/projects/:id`
Update project settings.

**Request:**
```json
{
  "is_visible": true,
  "display_order": 2
}
```

#### `PUT /api/portfolio/projects/reorder`
Batch update display order.

**Request:**
```json
{
  "projects": [
    { "id": "uuid1", "display_order": 1 },
    { "id": "uuid2", "display_order": 2 }
  ]
}
```

#### `DELETE /api/portfolio/projects/:id`
Remove project from portfolio.

---

### Public Access (Unauthenticated)

#### `GET /api/portfolio/:username`
Get public portfolio data.

**Response:**
```json
{
  "profile": {
    "username": "john-doe",
    "display_name": "John Doe",
    "bio": "Full stack developer...",
    "profile_photo_url": "https://...",
    "location": "San Francisco, CA",
    "available_for_work": true,
    "github_url": "https://github.com/johndoe",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "show_github": true,
    "show_linkedin": true
  },
  "projects": [
    {
      "id": "uuid",
      "name": "Project Alpha",
      "description": "...",
      "tech_stacks": ["React", "TypeScript"],
      "start_date": "2024-01-01",
      "end_date": "2024-03-01",
      "team_size": 3
    }
  ]
}
```

---

## 🔒 Privacy & Security

### Privacy Controls (3 Levels)

#### Level 1: Profile Level
- **is_public** - Master switch for entire portfolio
- **show_email** - Display email on public profile
- **show_github/linkedin/twitter/website** - Per-platform visibility

#### Level 2: Project Selection
- **portfolio_projects.is_visible** - Include project in portfolio
- **display_order** - Control presentation order

#### Level 3: Project Detail Level
- **show_description** - Display project description
- **show_responsibilities** - Display responsibilities
- **show_highlights** - Display project highlights
- **show_tech_stack** - Display technologies used
- **show_repo** - Display repository link
- **show_dates** - Display start/end dates
- **show_team_size** - Display team size
- **show_client** - Display client name

### Username Rules
- **Format:** Lowercase alphanumeric, hyphens, underscores only
- **Length:** 3-30 characters
- **Uniqueness:** Must be unique across platform
- **Immutability:** Consider limiting changes (e.g., once per 30 days)
- **Reserved:** Prevent system keywords (admin, api, www, etc.)

### RLS Policies
- Users can only edit their own profile
- Public profiles are readable by anyone
- Portfolio projects inherit profile's public status
- Project details respect visibility flags

---

## 📊 Analytics & Tracking

### View Counter
- Increment on each portfolio page load
- Update `last_viewed_at` timestamp
- Exclude owner's own views
- Optional: Track unique vs total views

### Future Analytics (Optional)
- Visitor location (country-level)
- Referrer sources
- Time on page
- Project click-through rates

---

## 🎨 Design System

### Profile Photo
- **Size:** 500x500px recommended
- **Max File Size:** 2MB
- **Formats:** JPG, PNG, WebP
- **Storage:** Supabase Storage bucket `profile-photos`
- **Path:** `{user_id}/profile.{ext}`
- **Default:** Generated avatar with initials

### Portfolio Themes
- **Light Mode** (default)
- **Dark Mode** (optional)
- Custom color accents (future)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🚀 Implementation Phases

### Phase 1: Core Profile (Week 1)
**Goals:**
- Database tables and migrations
- Profile CRUD operations
- Profile settings UI
- Username validation and uniqueness

**Deliverables:**
- ✅ Database migration file
- ✅ `/profile` settings page
- ✅ Profile API endpoints
- ✅ Profile photo upload

**Acceptance Criteria:**
- User can create profile with username
- Username is validated and unique
- Profile can be edited and deleted
- Profile photo uploads to storage

---

### Phase 2: Project Selection & Privacy (Week 2)
**Goals:**
- Add/remove projects from portfolio
- Drag-and-drop reordering
- Per-project visibility settings
- Privacy controls UI

**Deliverables:**
- ✅ Portfolio projects table
- ✅ Project selection UI
- ✅ Drag-and-drop ordering
- ✅ Project settings modal
- ✅ Privacy toggle switches

**Acceptance Criteria:**
- User can add projects to portfolio
- Projects can be reordered
- Visibility settings work per project
- Privacy controls save correctly

---

### Phase 3: Public Portfolio View (Week 3)
**Goals:**
- Public-facing portfolio page
- SEO optimization
- View counter
- Social sharing

**Deliverables:**
- ✅ `/portfolio/[username]` route
- ✅ Public API endpoint
- ✅ Responsive portfolio layout
- ✅ SEO meta tags
- ✅ View counter logic
- ✅ Share link copying

**Acceptance Criteria:**
- Public portfolio displays correctly
- Only enabled projects and data show
- View counter increments
- Portfolio is mobile responsive
- SEO tags are present

---

### Phase 4: Polish & Analytics (Week 3-4)
**Goals:**
- Analytics dashboard
- Preview mode
- QR code generation
- Social validation
- Performance optimization

**Deliverables:**
- ✅ View analytics display
- ✅ Portfolio preview in settings
- ✅ QR code generator
- ✅ Social URL validation
- ✅ Performance improvements

**Acceptance Criteria:**
- Analytics show accurate data
- Preview matches public view
- QR codes work correctly
- Social links are validated
- Page loads quickly

---

## 🧪 Testing Strategy

### Unit Tests
- Username validation logic
- Privacy control logic
- Display order calculation
- View counter increment

### Integration Tests
- Profile CRUD operations
- Portfolio project management
- Public portfolio access
- RLS policy enforcement

### E2E Tests
1. Create profile with username
2. Add projects to portfolio
3. Configure privacy settings
4. Verify public view reflects settings
5. Test unauthenticated access

### Manual Testing Checklist
- [ ] Create profile flow
- [ ] Username uniqueness validation
- [ ] Profile photo upload
- [ ] Add/remove portfolio projects
- [ ] Drag-and-drop reordering
- [ ] Privacy toggles work
- [ ] Public portfolio displays correctly
- [ ] View counter increments
- [ ] Copy link works
- [ ] Mobile responsive
- [ ] SEO tags present
- [ ] Social links validated

---

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)

#### Adoption
- **Target:** 60% of active users create portfolio within 30 days
- **Metric:** Profiles created / Active users

#### Engagement
- **Target:** Average 3+ projects per portfolio
- **Metric:** Portfolio projects / Profiles

#### Public Visibility
- **Target:** 40% of portfolios set to public
- **Metric:** Public profiles / Total profiles

#### Traffic
- **Target:** 100+ portfolio views per week
- **Metric:** Total view count

---

## 🚧 Constraints & Dependencies

### Technical Dependencies
- Supabase Storage for profile photos
- Next.js 13+ App Router
- TailwindCSS for styling
- React DnD or similar for drag-and-drop

### Constraints
- Username changes limited to prevent abuse
- Profile photo size limited to 2MB
- Bio length limited to 1000 characters
- Maximum 50 projects per portfolio

### Assumptions
- Users want public portfolios
- Projects have sufficient data for showcase
- Username is acceptable identifier

---

## 🔮 Future Enhancements

### Phase 5: Advanced Features
- **Custom Themes** - User-selectable color schemes
- **Custom Domains** - Point personal domain to portfolio
- **PDF Export** - Download portfolio as PDF resume
- **Embed Code** - Embed portfolio widget on personal site
- **Portfolio Templates** - Pre-designed layouts
- **Analytics Dashboard** - Detailed visitor insights
- **Social Proof** - Testimonials and endorsements
- **Skills Section** - Aggregated tech stack expertise
- **Activity Feed** - Recent project updates

---

## 📝 Open Questions

1. **Username Changes:**
   - Allow unlimited changes?
   - Limit to once per 30 days?
   - Preserve old URLs with redirects?
   
2. **Default Portfolio:**
   - Auto-create on signup?
   - Require manual setup?
   - Pre-populate with all projects?

3. **Social Proof:**
   - Show project dates by default?
   - Show client names by default?
   - Allow testimonials in future?

4. **SEO:**
   - Generate sitemap for all public portfolios?
   - Add structured data (JSON-LD)?
   - Allow custom meta descriptions?

5. **Analytics:**
   - Track unique visitors vs total views?
   - Show analytics to profile owners only?
   - Real-time or daily aggregates?

---

## 📚 References

### Similar Products
- LinkedIn Profile
- GitHub Profile README
- Notion Portfolio Templates
- About.me
- Linktree

### Design Inspiration
- Minimalist developer portfolios
- GitHub profile pages
- Dribbble portfolios

---

## ✅ Approval & Sign-off

**Approved By:** User  
**Date:** June 8, 2026  
**Status:** Ready for Implementation (Waiting for go-ahead)

**Next Steps:**
1. Wait for user approval to start implementation
2. Begin Phase 1: Database and Core Profile
3. Iterative delivery with user feedback

---

**Document Version:** 1.0  
**Last Updated:** June 8, 2026  
**Maintained By:** Development Team
