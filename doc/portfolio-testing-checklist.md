# Public Portfolio Feature - Testing Checklist

## 🧪 Pre-Deployment Testing

Use this checklist to ensure the portfolio feature works correctly before deploying to production.

---

## ✅ Database Migration

- [ ] Migration file runs without errors
- [ ] `user_profiles` table created
- [ ] `portfolio_projects` table created
- [ ] Visibility columns added to `projects` table
- [ ] All indexes created
- [ ] All RLS policies applied
- [ ] Triggers created successfully
- [ ] Reserved username function works
- [ ] Can rollback migration cleanly

---

## ✅ Profile Management (API)

### Create Profile (POST /api/profile)

- [ ] Can create profile with valid data
- [ ] Username validation works (lowercase, 3-30 chars)
- [ ] Reserved usernames are blocked (admin, api, etc.)
- [ ] Duplicate username returns 409 error
- [ ] Bio length limited to 1000 characters
- [ ] Social URLs are optional
- [ ] Returns 401 when not authenticated
- [ ] Profile created with correct default values

### Get Profile (GET /api/profile)

- [ ] Returns user's own profile when authenticated
- [ ] Returns null when profile doesn't exist
- [ ] Returns 401 when not authenticated
- [ ] All fields returned correctly

### Update Profile (PUT /api/profile)

- [ ] Can update all profile fields
- [ ] Username change works (if allowed)
- [ ] Duplicate username blocked on update
- [ ] Validation runs on update
- [ ] Returns 401 when not authenticated
- [ ] Returns updated profile data

### Delete Profile (DELETE /api/profile)

- [ ] Can delete own profile
- [ ] Profile actually removed from database
- [ ] Returns 401 when not authenticated
- [ ] Cascade deletes portfolio_projects

---

## ✅ Portfolio Projects (API)

### List Portfolio Projects (GET /api/portfolio/projects)

- [ ] Returns user's portfolio projects
- [ ] Projects ordered by display_order
- [ ] Includes full project details
- [ ] Includes tech stacks
- [ ] Returns 401 when not authenticated
- [ ] Returns empty array when no projects

### Add Project (POST /api/portfolio/projects)

- [ ] Can add project to portfolio
- [ ] display_order assigned correctly
- [ ] Can't add project twice (409 error)
- [ ] Can't add other user's projects (404)
- [ ] Returns 401 when not authenticated
- [ ] Returns created portfolio_project

### Update Portfolio Project (PUT /api/portfolio/projects/:id)

- [ ] Can update is_visible
- [ ] Can update display_order
- [ ] Can't update other user's portfolio projects
- [ ] Returns 401 when not authenticated
- [ ] Returns 404 for non-existent project

### Reorder Projects (PUT /api/portfolio/projects/reorder)

- [ ] Can batch update display orders
- [ ] All projects updated correctly
- [ ] Can't reorder other user's projects
- [ ] Returns 401 when not authenticated

### Remove Project (DELETE /api/portfolio/projects/:id)

- [ ] Can remove project from portfolio
- [ ] Project actually deleted from database
- [ ] Can't remove other user's projects
- [ ] Returns 401 when not authenticated

---

## ✅ Public Portfolio (API)

### Get Public Portfolio (GET /api/portfolio/:username)

- [ ] Returns portfolio when public
- [ ] Returns 404 when username not found
- [ ] Returns 404 when profile is private
- [ ] Profile data filtered correctly (no internal IDs)
- [ ] Social links shown/hidden based on settings
- [ ] Email shown only when enabled
- [ ] Projects filtered by is_visible
- [ ] Project data filtered by visibility flags
- [ ] Tech stacks included
- [ ] Category and role names resolved
- [ ] View counter increments
- [ ] Owner's views don't increment counter
- [ ] Last viewed timestamp updated

---

## ✅ Profile Settings Page (UI)

### Page Load

- [ ] Redirects to login when not authenticated
- [ ] Loads existing profile if present
- [ ] Shows empty form if no profile
- [ ] Loads portfolio projects
- [ ] Loads all user's projects
- [ ] No console errors

### Basic Information Form

- [ ] Can enter username
- [ ] Can enter display name
- [ ] Can enter bio
- [ ] Can enter location
- [ ] Character counter works for bio
- [ ] Username format hint shown
- [ ] All fields pre-filled when editing

### Visibility Settings

- [ ] Can toggle "Make portfolio public"
- [ ] Can toggle "Available for work"
- [ ] Can toggle "Show email"
- [ ] Toggles reflect saved state

### Social Links

- [ ] Can enter GitHub URL
- [ ] Can enter LinkedIn URL
- [ ] Can enter Twitter URL
- [ ] Can enter Website URL
- [ ] Can toggle show/hide for each
- [ ] URLs pre-filled when editing

### Portfolio Projects

- [ ] Shows currently added projects
- [ ] Shows available projects
- [ ] Can add project (moves to added section)
- [ ] Can remove project (moves to available section)
- [ ] Projects don't duplicate

### Save Profile

- [ ] Save button works
- [ ] Shows loading state while saving
- [ ] Shows success message on save
- [ ] Shows error message on failure
- [ ] Error messages are clear
- [ ] Form persists after save

### Portfolio URL

- [ ] Shows correct URL with username
- [ ] Copy button works
- [ ] Success message shown when copied
- [ ] Only visible when profile exists

### Analytics

- [ ] Shows view count
- [ ] Shows last viewed date
- [ ] Only visible when profile exists

### Preview Button

- [ ] Preview button opens portfolio in new tab
- [ ] Only visible when profile exists

---

## ✅ Public Portfolio Page (UI)

### Page Load

- [ ] Shows loader while fetching
- [ ] Shows error for invalid username
- [ ] Shows error for private portfolio
- [ ] Loads and displays portfolio correctly
- [ ] No console errors

### Profile Section

- [ ] Shows profile photo (if present)
- [ ] Shows display name
- [ ] Shows location (if present)
- [ ] Shows "Available for Work" badge (if enabled)
- [ ] Shows bio (if present)
- [ ] Bio preserves line breaks
- [ ] Social links shown correctly
- [ ] Social links open in new tab
- [ ] Email link works (if shown)
- [ ] Hidden social links don't appear

### Projects Section

- [ ] Only visible projects shown
- [ ] Projects displayed in correct order
- [ ] Project name shown
- [ ] Category shown (if present)
- [ ] Role shown (if present)
- [ ] Description shown (if enabled)
- [ ] Responsibilities shown (if enabled)
- [ ] Highlights shown (if enabled)
- [ ] Tech stack tags shown (if enabled)
- [ ] Project dates shown (if enabled)
- [ ] Team size shown (if enabled)
- [ ] Client name shown (if enabled)
- [ ] Repository link shown (if enabled)
- [ ] Repository link opens in new tab

### Layout & Design

- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768-1024px)
- [ ] Responsive on desktop (> 1024px)
- [ ] Project grid adapts to screen size
- [ ] No layout overflow issues
- [ ] Colors and styling consistent
- [ ] Images load correctly

### SEO & Meta Tags

- [ ] Page title includes display name
- [ ] Meta description present
- [ ] Open Graph tags present
- [ ] Twitter card tags present
- [ ] Open Graph image set (if photo present)

### Footer

- [ ] Footer visible
- [ ] "Powered by DevTrack" shown
- [ ] "Create your own portfolio" link works

---

## ✅ Security & Privacy

### Authentication

- [ ] Can't access other user's profile settings
- [ ] Can't modify other user's profiles
- [ ] Can't add projects to other user's portfolios
- [ ] API returns 401 for unauthenticated requests
- [ ] JWT token validated correctly

### Row Level Security

- [ ] Users can only read own profile in admin view
- [ ] Anyone can read public profiles
- [ ] Users can only insert own profile
- [ ] Users can only update own profile
- [ ] Users can only delete own profile
- [ ] Users can only manage own portfolio projects
- [ ] Public can read portfolio projects of public profiles
- [ ] Public can read projects in public portfolios

### Privacy Controls

- [ ] Private portfolios return 404 to public
- [ ] Hidden social links don't appear in API
- [ ] Hidden project fields don't appear in API
- [ ] Email only shown when enabled
- [ ] Non-visible projects excluded from public view
- [ ] Owner detection works for view counter

### Data Validation

- [ ] Username format enforced
- [ ] Reserved usernames blocked
- [ ] Bio length limited
- [ ] Duplicate usernames prevented
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

---

## ✅ Integration Tests

### Profile Creation Flow

- [ ] Sign up → Create profile → Add projects → Make public → View portfolio

### Profile Update Flow

- [ ] Create profile → Update info → Changes reflected in public view

### Project Management Flow

- [ ] Add project → Shows in portfolio → Remove project → Gone from portfolio

### Privacy Toggle Flow

- [ ] Make public → Portfolio visible → Make private → Returns 404

---

## ✅ Edge Cases

- [ ] Username with special characters handled
- [ ] Very long bio (1000 chars) displays correctly
- [ ] Profile with no projects displays correctly
- [ ] Profile with no bio displays correctly
- [ ] Profile with no social links displays correctly
- [ ] Invalid URLs don't break page
- [ ] Empty strings handled correctly
- [ ] Null values handled correctly
- [ ] Missing optional fields don't break UI

---

## ✅ Performance

- [ ] Profile page loads in < 2 seconds
- [ ] Public portfolio loads in < 2 seconds
- [ ] API responses < 500ms
- [ ] No N+1 query issues
- [ ] Database indexes used correctly
- [ ] Images load efficiently
- [ ] No memory leaks

---

## ✅ Browser Compatibility

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile Safari works
- [ ] Mobile Chrome works

---

## ✅ Accessibility

- [ ] Keyboard navigation works
- [ ] Form labels present
- [ ] Alt text on images
- [ ] Color contrast sufficient
- [ ] Screen reader friendly
- [ ] Focus indicators visible

---

## 🔍 Regression Testing

After deploying, verify existing features still work:

- [ ] Projects page works
- [ ] Create project works
- [ ] Edit project works
- [ ] Delete project works
- [ ] Gmail accounts page works
- [ ] GitHub accounts page works
- [ ] Tech stacks page works
- [ ] Export functionality works
- [ ] MCP access works
- [ ] Pages feature works

---

## 📝 Testing Notes

**Date Tested:** _________________

**Tester:** _________________

**Environment:** 
- [ ] Local
- [ ] Staging
- [ ] Production

**Issues Found:**

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |

**Overall Result:**
- [ ] Pass - Ready for deployment
- [ ] Pass with minor issues - Can deploy with monitoring
- [ ] Fail - Needs fixes before deployment

---

## ✅ Post-Deployment Verification

After deploying to production:

- [ ] Migration applied successfully
- [ ] No database errors in logs
- [ ] Can create new profile
- [ ] Can view public portfolio
- [ ] Analytics tracking works
- [ ] SEO tags visible in page source
- [ ] Sitemap includes portfolios
- [ ] No 500 errors in logs
- [ ] Performance acceptable

---

## 🎉 Sign-Off

**Developer:** _________________ Date: _______

**QA:** _________________ Date: _______

**Product Owner:** _________________ Date: _______

