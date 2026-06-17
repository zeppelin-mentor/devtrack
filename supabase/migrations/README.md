# Database Migrations

This directory contains Supabase database migration scripts.

## Running Migrations

### Using Supabase CLI (Recommended)

If you have the Supabase CLI installed locally:

```bash
# Link your project (first time only)
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Manual Application via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and execute the SQL

## Migrations

### 20260617_portfolio_feature.sql

**Description:** Adds public portfolio profile functionality

**Changes:**
- Creates `user_profiles` table for user portfolio profiles
- Creates `portfolio_projects` table to manage which projects appear on portfolio
- Adds visibility control columns to `projects` table
- Adds RLS policies for public access to portfolios
- Creates triggers and constraints for data integrity

**Dependencies:** 
- Requires existing `projects` table
- Requires `auth.users` table (standard Supabase auth)

**To Apply:**
Run this migration against your Supabase database either via CLI or SQL Editor.

## Post-Migration Steps

After running the migration:

1. **Test Profile Creation**: Try creating a user profile via `/api/profile`
2. **Verify RLS Policies**: Ensure public access works for public portfolios
3. **Test Portfolio Visibility**: Add projects to portfolio and verify public view
4. **Check Analytics**: Verify view counter increments correctly

## Rollback

To rollback this migration, execute:

```sql
-- Drop tables
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Remove columns from projects
ALTER TABLE projects 
  DROP COLUMN IF EXISTS show_description,
  DROP COLUMN IF EXISTS show_responsibilities,
  DROP COLUMN IF EXISTS show_highlights,
  DROP COLUMN IF EXISTS show_tech_stack,
  DROP COLUMN IF EXISTS show_repo,
  DROP COLUMN IF EXISTS show_dates,
  DROP COLUMN IF EXISTS show_team_size,
  DROP COLUMN IF EXISTS show_client;

-- Drop functions
DROP FUNCTION IF EXISTS is_reserved_username(TEXT);
DROP FUNCTION IF EXISTS update_user_profiles_updated_at();
```

## Notes

- Usernames are unique and lowercase only
- Reserved system usernames are blocked (admin, api, etc.)
- Profiles cascade delete when user account is deleted
- Portfolio projects cascade delete when project is deleted
