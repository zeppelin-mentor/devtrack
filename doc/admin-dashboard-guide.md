# Admin Dashboard Guide

## Overview

The Admin Dashboard provides platform administrators with comprehensive tools to monitor platform usage, manage announcements, and view analytics. This feature is designed to give admins full visibility into platform operations and enable them to communicate effectively with users.

## Features

### 1. Platform Statistics Dashboard

The admin dashboard provides real-time statistics including:

- **Total Users**: Complete count of registered users on the platform
- **Total Projects**: Aggregate count of all projects created across the platform
- **Total Pages**: Count of all documentation pages created
- **Portfolio Projects**: Number of projects added to user portfolios
- **Active Announcements**: Current active system-wide announcements

### 2. Weekly Analytics

Track platform growth and engagement with comprehensive weekly analytics:

- **New Users**: Number of users who signed up each day
- **Active Users**: Number of users who logged in each day
- **New Projects**: Projects created each day
- **New Pages**: Documentation pages created each day
- **New Portfolio Projects**: Portfolio additions each day

Analytics data is automatically collected and can be viewed in:
- **Overview Tab**: 7-day summary with aggregated totals
- **Analytics Tab**: Detailed day-by-day breakdown in table format

### 3. Announcement Management

Create and manage system-wide announcements to communicate with all users:

**Announcement Types:**
- **Info** (ℹ️): General information and updates
- **Warning** (⚠️): Important notices requiring attention
- **Success** (✅): Positive updates and achievements
- **Error** (❌): Critical issues or maintenance alerts

**Announcement Features:**
- **Priority Levels**: Control the display order (higher numbers appear first)
- **Expiration Dates**: Set automatic expiration for time-sensitive announcements
- **Active/Inactive Toggle**: Control visibility without deleting
- **Rich Content**: Add detailed information in the content field

**User Experience:**
- Announcements appear as dismissible banners on the dashboard
- Each user can dismiss announcements individually (saved in localStorage)
- Active announcements are automatically shown to all authenticated users
- Announcements are displayed in order of priority and creation date

## Database Schema

### Tables Created

#### `announcements`
Stores system-wide announcements visible to users.

**Columns:**
- `id` (uuid): Unique identifier
- `title` (text): Announcement title
- `content` (text): Announcement message
- `type` (text): Type of announcement (info, warning, success, error)
- `is_active` (boolean): Whether announcement is currently visible
- `created_by` (uuid): Admin user who created the announcement
- `created_at` (timestamptz): Creation timestamp
- `updated_at` (timestamptz): Last update timestamp
- `expires_at` (timestamptz, nullable): Optional expiration date
- `priority` (integer): Display priority (default: 0)

#### `platform_analytics`
Tracks daily platform usage metrics.

**Columns:**
- `id` (uuid): Unique identifier
- `date` (date): Analytics date (unique)
- `total_users` (integer): Total registered users
- `new_users` (integer): New signups that day
- `active_users` (integer): Users who logged in
- `total_projects` (integer): Total projects on platform
- `new_projects` (integer): Projects created that day
- `total_pages` (integer): Total documentation pages
- `new_pages` (integer): Pages created that day
- `total_portfolio_projects` (integer): Total portfolio projects
- `new_portfolio_projects` (integer): Portfolio additions that day
- `total_api_requests` (integer): API request count (reserved for future use)
- `created_at` (timestamptz): Record creation timestamp

#### `user_profiles` (Updated)
Added admin role field to existing user profiles table.

**New Column:**
- `is_admin` (boolean): Identifies admin users (default: false)

## Setting Up Admin Access

### Making a User an Admin

1. **Via Database (SQL)**:
   ```sql
   UPDATE user_profiles 
   SET is_admin = TRUE 
   WHERE user_id = '<user_id>';
   ```

2. **Via Supabase Dashboard**:
   - Navigate to Table Editor → user_profiles
   - Find the user by user_id or username
   - Set `is_admin` to TRUE
   - Save changes

### First-Time Setup

1. Create your user profile first by logging in
2. Use SQL or Supabase Dashboard to set is_admin = true
3. Log out and log back in
4. The "Admin" link will appear in the sidebar

## API Endpoints

### Admin Endpoints (Requires Admin Authentication)

#### `GET /api/admin/stats`
Retrieves overall platform statistics and weekly analytics.

**Response:**
```json
{
  "totalUsers": 100,
  "totalProjects": 250,
  "totalPages": 180,
  "totalPortfolioProjects": 75,
  "activeAnnouncements": 3,
  "weeklyAnalytics": [...]
}
```

#### `GET /api/admin/announcements`
Lists all announcements (active and inactive).

#### `POST /api/admin/announcements`
Creates a new announcement.

**Body:**
```json
{
  "title": "Platform Maintenance",
  "content": "Scheduled maintenance on Sunday at 2 AM EST",
  "type": "warning",
  "is_active": true,
  "priority": 10,
  "expires_at": "2024-12-31T23:59:59Z"
}
```

#### `PATCH /api/admin/announcements/[id]`
Updates an existing announcement.

#### `DELETE /api/admin/announcements/[id]`
Deletes an announcement.

#### `GET /api/admin/analytics?days=30`
Retrieves analytics data for specified number of days (default: 30).

#### `POST /api/admin/analytics`
Manually triggers analytics update for the current day.

### User Endpoints (Requires Authentication)

#### `GET /api/announcements`
Retrieves active, non-expired announcements for display to users.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Welcome!",
    "content": "Welcome to DevTrack",
    "type": "info",
    "priority": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

## Analytics Function

### `update_daily_analytics()`

A PostgreSQL function that updates daily analytics. Can be called:

1. **Manually** via Admin Dashboard → Analytics Tab → "Update Analytics" button
2. **Automatically** via cron job (recommended for production)

To set up automated daily updates, create a Supabase Edge Function or external cron job that calls:

```bash
curl -X POST https://your-domain.com/api/admin/analytics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Security & Permissions

### Row Level Security (RLS)

All admin tables have RLS enabled with specific policies:

**Announcements:**
- ✅ All users can read active announcements
- ✅ Only admins can create, update, or delete announcements

**Platform Analytics:**
- ✅ Only admins can read analytics data
- ✅ Only admins can insert analytics records

**User Profiles:**
- ✅ Users can read their own profile
- ✅ Only admins can modify is_admin field (via database)

### Authentication Flow

1. User logs in with Supabase Auth
2. Middleware checks `user_profiles.is_admin` field
3. If admin = false, returns 403 Forbidden
4. If admin = true, grants access to admin endpoints

## Usage Guide

### Accessing the Admin Dashboard

1. Log in to DevTrack
2. Look for "Admin" link in the sidebar (only visible to admins)
3. Click to access the admin dashboard

### Creating an Announcement

1. Go to Admin Dashboard
2. Click "Announcements" tab
3. Click "Create Announcement" button
4. Fill in the form:
   - **Title**: Short, clear title
   - **Content**: Detailed message
   - **Type**: Choose appropriate type for styling
   - **Priority**: Higher numbers appear first
   - **Expiration**: Optional auto-hide date
   - **Active**: Check to make visible immediately
5. Click "Create Announcement"

### Managing Announcements

From the Announcements tab, you can:
- **Activate/Deactivate**: Toggle visibility without deleting
- **Edit**: Update any announcement details
- **Delete**: Permanently remove an announcement

### Viewing Analytics

1. **Overview Tab**: See current totals and 7-day summary
2. **Analytics Tab**: View detailed day-by-day breakdown
3. Click "Update Analytics" to manually refresh current day's data
4. Use "Refresh" button to reload dashboard data

## Best Practices

### Announcements

1. **Use appropriate types**:
   - Info: Regular updates, new features
   - Warning: Maintenance, deprecations
   - Success: Milestone achievements
   - Error: Critical issues, outages

2. **Set priorities wisely**:
   - Critical alerts: Priority 100+
   - Important notices: Priority 10-99
   - General info: Priority 0-9

3. **Use expiration dates** for time-sensitive announcements

4. **Keep content concise** - users will dismiss long messages

### Analytics

1. **Update daily** for accurate tracking
2. **Review weekly trends** to identify growth patterns
3. **Monitor active users** to gauge engagement
4. **Compare periods** to measure feature impact

### Security

1. **Limit admin access** to trusted team members only
2. **Regular audits** of admin user list
3. **Monitor analytics API calls** for unusual activity
4. **Use HTTPS** for all admin operations

## Troubleshooting

### "Access Denied" Error

**Problem**: User sees "Access denied: Admin privileges required"

**Solution**:
1. Verify user has profile created: Check `user_profiles` table
2. Verify admin flag: Ensure `is_admin = true`
3. Log out and log back in to refresh session
4. Clear browser cache if issue persists

### Announcements Not Appearing

**Problem**: Created announcement doesn't show for users

**Solution**:
1. Check `is_active` is set to true
2. Verify `expires_at` is null or in the future
3. Check RLS policies are enabled
4. Ensure users are authenticated
5. Have users clear localStorage and refresh

### Analytics Data Missing

**Problem**: No analytics data in dashboard

**Solution**:
1. Click "Update Analytics" button to generate initial data
2. Verify `update_daily_analytics()` function exists
3. Check PostgreSQL logs for function errors
4. Ensure user_profiles table has data
5. Verify RLS policies allow admin read access

### Admin Link Not Showing in Sidebar

**Problem**: Admin users don't see Admin link

**Solution**:
1. Verify `is_admin = true` in database
2. Check sidebar component is checking admin status
3. Refresh the page after granting admin access
4. Clear browser cache and restart browser

## Future Enhancements

Potential improvements for future versions:

1. **Advanced Analytics**:
   - User retention metrics
   - Feature usage tracking
   - Export analytics to CSV
   - Custom date range selection
   - Visual charts and graphs

2. **Enhanced Announcements**:
   - Target specific user groups
   - Schedule future announcements
   - Rich text formatting (markdown)
   - Announcement templates
   - Analytics on announcement views

3. **User Management**:
   - Admin user management interface
   - User activity logs
   - Bulk user operations
   - Role-based access control (beyond admin/user)

4. **System Health**:
   - Database performance metrics
   - API response time tracking
   - Error rate monitoring
   - Storage usage statistics

5. **Notifications**:
   - Email announcements
   - Push notifications
   - Slack/Discord webhooks
   - SMS alerts for critical issues

## Support

For issues or questions about the admin dashboard:

1. Check this documentation first
2. Review database logs in Supabase dashboard
3. Check browser console for client-side errors
4. Verify API endpoint responses in Network tab
5. Contact system administrator for access issues

---

**Version**: 1.0.0
**Last Updated**: 2024
**Maintained By**: DevTrack Team
