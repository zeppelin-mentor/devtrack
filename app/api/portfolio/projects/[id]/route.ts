import { NextResponse } from 'next/server';
import { getAuthenticatedUserFromBearer } from '@/lib/mcp/security';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { PortfolioProject } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PUT /api/portfolio/projects/:id - Update portfolio project settings
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Partial<PortfolioProject>;

    const supabaseAdmin = getSupabaseAdmin();

    // Build update object
    const updates: Partial<PortfolioProject> = {};
    if (body.is_visible !== undefined) updates.is_visible = body.is_visible;
    if (body.display_order !== undefined) updates.display_order = body.display_order;

    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .update(updates as never)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Portfolio project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ portfolioProject: data as PortfolioProject });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/portfolio/projects/:id - Remove project from portfolio
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('portfolio_projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
