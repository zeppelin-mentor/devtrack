# DevTrack - Quick Start Guide

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Mock Backend Features

The application now includes a fully functional mock backend with sample data. All CRUD operations work in-memory (data resets on page refresh).

### Pre-loaded Sample Data

- **5 Projects**: Including RapidAid, ShopHub Marketplace, TaskFlow Pro, FitTracker Mobile, and DevPortfolio Builder
- **3 Gmail Accounts**: Development, freelance, and startup accounts
- **2 GitHub Accounts**: Personal and work accounts
- **10 Tech Stacks**: Next.js, React, Node.js, Supabase, TailwindCSS, PostgreSQL, TypeScript, Express, MongoDB, Docker
- **5 Categories**: Web Development, AI Platform, Mobile App, SaaS, Marketplace
- **5 Roles**: Full Stack, Frontend, Backend, DevOps, AI Engineer

### Available Features

#### 1. Landing Page
- Feature overview
- Login/Signup buttons
- Navigate to `/`

#### 2. Authentication (Mock)
- Login page at `/auth/login`
- Signup page at `/auth/signup`
- Currently redirects to dashboard without actual authentication

#### 3. Dashboard (`/dashboard`)
- Statistics cards showing counts
- Quick action buttons
- Recent projects list
- All data is live from mock store

#### 4. Projects (`/projects`)
- View all projects in a table
- Search by project name
- Filter by category and role
- Create new projects
- View project details
- Edit projects (coming soon)
- Delete projects
- Tech stack associations

#### 5. Project Creation (`/projects/create`)
- Complete form with all fields
- Category and role dropdowns
- Tech stack multi-select
- Gmail and GitHub account selection
- Date pickers
- Form validation

#### 6. Project Details (`/projects/[id]`)
- View complete project information
- See associated tech stacks
- View linked accounts
- All project metadata

#### 7. Gmail Accounts (`/gmail-accounts`)
- View all Gmail accounts
- Add new accounts
- Edit existing accounts
- Delete accounts
- See project usage count

#### 8. GitHub Accounts (`/github-accounts`)
- View all GitHub accounts
- Add new accounts with SSH keys
- Edit existing accounts
- Delete accounts
- See project usage count

#### 9. Tech Stacks (`/tech-stacks`)
- View all tech stacks
- Filter by category
- Add new tech stacks
- Edit existing stacks
- Delete stacks
- See project usage count

#### 10. Export (`/export`)
- Select projects to export
- Filter by role and category
- Select all / Clear all
- Export to CSV
- CSV includes all project details

### Testing the Application

1. **Navigate to Dashboard**: See live statistics
2. **Create a Project**: 
   - Click "Add Project" button
   - Fill in the form
   - Select tech stacks
   - Submit and see it appear in the list
3. **Add Accounts**:
   - Go to Gmail or GitHub accounts
   - Click "Add" button
   - Fill in details
   - See them available in project creation
4. **Export Data**:
   - Go to Export page
   - Select projects
   - Apply filters
   - Click "Export CSV"
   - Check your downloads folder

### Mock Store Features

The mock store (`lib/mockStore.ts`) provides:

- In-memory data storage
- Full CRUD operations
- Relationship tracking
- Helper methods for counts and lookups
- Automatic ID generation
- Timestamp management

### Data Persistence

**Important**: Data is stored in-memory and will reset when you:
- Refresh the page
- Restart the development server
- Navigate away and back

This is intentional for UI testing. When you're ready, you can replace the mock store with Supabase integration.

## UI Testing Checklist

- [ ] Landing page displays correctly
- [ ] Navigation between pages works
- [ ] Dashboard shows correct statistics
- [ ] Can create new projects
- [ ] Can view project details
- [ ] Can delete projects
- [ ] Search and filters work
- [ ] Can add Gmail accounts
- [ ] Can add GitHub accounts
- [ ] Can add tech stacks
- [ ] Tech stack selection works in project form
- [ ] Export generates CSV file
- [ ] All modals open and close properly
- [ ] Forms validate required fields
- [ ] Responsive design works on mobile

## Next Steps

Once you're happy with the UI:

1. Review the design and layout
2. Test all interactions
3. Verify responsive behavior
4. Check color scheme and branding
5. Test on different browsers
6. Then proceed with Supabase integration (see SETUP.md)

## Customization

To modify the mock data, edit:
- `lib/mockData.ts` - Initial sample data
- `lib/mockStore.ts` - Store logic and methods

## Notes

- All forms include validation
- Delete operations require confirmation
- Project counts update automatically
- CSV export includes all selected project data
- Tech stacks can be filtered by category
- Projects can be filtered by role and category
