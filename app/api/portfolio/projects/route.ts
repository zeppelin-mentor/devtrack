import { NextResponse } from 'next/server';
import { getAuthenticatedUserFromBearer } from '@/lib/mcp/security';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { PortfolioProject, PortfolioProjectWithDetails } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/portfolio/projects - Get user's portfolio project selections
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select(`
        *,
        project:projects(
          *,
          category:categories(id, name),
          role:roles(id, name)
        )
      `)
      .eq('user_id', user.id)
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch tech stacks for each project
    const projectsWithTechStacks = await Promise.all(
      (data || []).map(async (portfolioProject: any) => {
        const { data: techStackData } = await supabaseAdmin
          .from('project_tech_stack')
          .select(`
            tech_stack:tech_stacks(*)
          `)
          .eq('project_id', portfolioProject.project.id);

        return {
          ...portfolioProject,
          project: {
            ...portfolioProject.project,
            tech_stacks: techStackData?.map((pts: any) => pts.tech_stack) || [],
          },
        };
      })
    );

    return NextResponse.json({ projects: projectsWithTechStacks as PortfolioProjectWithDetails[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/portfolio/projects - Add project to portfolio
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { project_id?: string };

    if (!body.project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', body.project_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if already added
    const { data: existing } = await supabaseAdmin
      .from('portfolio_projects')
      .select('id')
      .eq('user_id', user.id)
      .eq('project_id', body.project_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Project already in portfolio' },
        { status: 409 }
      );
    }

    // Get max display order
    const { data: maxOrderData } = await supabaseAdmin
      .from('portfolio_projects')
      .select('display_order')
      .eq('user_id', user.id)
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData as any)?.display_order ? (maxOrderData as any).display_order + 1 : 1;

    // Add to portfolio
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert([
        {
          user_id: user.id,
          project_id: body.project_id,
          is_visible: true,
          display_order: nextOrder,
        },
      ] as never[])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ portfolioProject: data as PortfolioProject }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/portfolio/projects/reorder - Batch update display order
export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      projects?: Array<{ id: string; display_order: number }>;
    };

    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: 'Projects array is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Update each project's display order
    const updates = body.projects.map(async (proj) => {
      return supabaseAdmin
        .from('portfolio_projects')
        .update({ display_order: proj.display_order } as never)
        .eq('id', proj.id)
        .eq('user_id', user.id);
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
