import { NextResponse } from 'next/server';
import { getAuthenticatedUserFromBearer } from '@/lib/mcp/security';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

// Get active announcements for regular users
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .select('id, title, content, type, priority, created_at')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
