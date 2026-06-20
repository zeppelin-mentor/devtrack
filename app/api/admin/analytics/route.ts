import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

// Get analytics data
export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const supabaseAdmin = getSupabaseAdmin();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabaseAdmin
      .from('platform_analytics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching analytics:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/admin/analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Manually trigger analytics update
export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Call the update function
    const { error } = await supabaseAdmin.rpc('update_daily_analytics');

    if (error) {
      console.error('Error updating analytics:', error);
      return NextResponse.json({ error: 'Failed to update analytics' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Analytics updated successfully' });
  } catch (error) {
    console.error('Error in POST /api/admin/analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
