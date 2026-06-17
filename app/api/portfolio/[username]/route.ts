import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { PublicPortfolio } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/portfolio/:username - Get public portfolio data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const supabaseAdmin = getSupabaseAdmin();

    // Get profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('is_public', true)
      .maybeSingle();

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: 'Portfolio not found or not public' },
        { status: 404 }
      );
    }

    const profile = profileData as any;

    // Update view count (exclude owner's views if authenticated)
    const authHeader = request.headers.get('authorization');
    let isOwner = false;
    
    if (authHeader?.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.slice(7).trim();
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      if (userData.user && userData.user.id === profile.user_id) {
        isOwner = true;
      }
    }

    if (!isOwner) {
      await supabaseAdmin
        .from('user_profiles')
        .update({
          view_count: profile.view_count + 1,
          last_viewed_at: new Date().toISOString(),
        } as never)
        .eq('id', profile.id);
    }

    // Get portfolio projects
    const { data: portfolioProjects, error: projectsError } = await supabaseAdmin
      .from('portfolio_projects')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('user_id', profile.user_id)
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 500 });
    }

    // Fetch full project details with tech stacks
    const projectsWithDetails = await Promise.all(
      (portfolioProjects || []).map(async (pp: any) => {
        const project = pp.project;

        // Get tech stacks
        const { data: techStackData } = await supabaseAdmin
          .from('project_tech_stack')
          .select(`
            tech_stack:tech_stacks(name)
          `)
          .eq('project_id', project.id);

        const techStacks = techStackData?.map((pts: any) => pts.tech_stack.name) || [];

        // Get category name
        let categoryName: string | undefined;
        if (project.category_id) {
          const { data: categoryData } = await supabaseAdmin
            .from('categories')
            .select('name')
            .eq('id', project.category_id)
            .maybeSingle();
          categoryName = (categoryData as any)?.name;
        }

        // Get role name
        let roleName: string | undefined;
        if (project.role_id) {
          const { data: roleData } = await supabaseAdmin
            .from('roles')
            .select('name')
            .eq('id', project.role_id)
            .maybeSingle();
          roleName = (roleData as any)?.name;
        }

        // Build public project object based on visibility settings
        const publicProject: any = {
          id: project.id,
          name: project.name,
          project_type: project.project_type,
        };

        if (project.show_description && project.project_description) {
          publicProject.project_description = project.project_description;
        }
        if (project.show_responsibilities && project.responsibilities) {
          publicProject.responsibilities = project.responsibilities;
        }
        if (project.show_highlights && project.project_highlights) {
          publicProject.project_highlights = project.project_highlights;
        }
        if (project.show_tech_stack && techStacks.length > 0) {
          publicProject.tech_stacks = techStacks;
        }
        if (project.show_repo && project.repo_url) {
          publicProject.repo_url = project.repo_url;
        }
        if (project.show_dates) {
          if (project.start_date) publicProject.start_date = project.start_date;
          if (project.end_date) publicProject.end_date = project.end_date;
        }
        if (project.show_team_size && project.team_size) {
          publicProject.team_size = project.team_size;
        }
        if (project.show_client && project.client_name) {
          publicProject.client_name = project.client_name;
        }
        if (categoryName) {
          publicProject.category = categoryName;
        }
        if (roleName) {
          publicProject.role = roleName;
        }

        return publicProject;
      })
    );

    // Build public profile object
    const publicProfile: any = {
      username: profile.username,
      display_name: profile.display_name,
      bio: profile.bio,
      profile_photo_url: profile.profile_photo_url,
      location: profile.location,
      available_for_work: profile.available_for_work,
    };

    // Add social links if shown
    if (profile.show_github && profile.github_url) {
      publicProfile.github_url = profile.github_url;
    }
    if (profile.show_linkedin && profile.linkedin_url) {
      publicProfile.linkedin_url = profile.linkedin_url;
    }
    if (profile.show_twitter && profile.twitter_url) {
      publicProfile.twitter_url = profile.twitter_url;
    }
    if (profile.show_website && profile.website_url) {
      publicProfile.website_url = profile.website_url;
    }

    // Add email if shown
    if (profile.show_email) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);
      if (userData.user?.email) {
        publicProfile.email = userData.user.email;
      }
    }

    const portfolio: PublicPortfolio = {
      profile: publicProfile,
      projects: projectsWithDetails,
    };

    return NextResponse.json(portfolio);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
