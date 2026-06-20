import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { Announcement } from '@/types';

export const runtime = 'nodejs';

// Get all announcements (admin only)
export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/admin/announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new announcement (admin only)
export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json() as Partial<Announcement>;

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const newAnnouncement = {
      title: body.title,
      content: body.content,
      type: body.type || 'info',
      is_active: body.is_active !== undefined ? body.is_active : true,
      priority: body.priority || 0,
      expires_at: body.expires_at || null,
      created_by: authResult.user!.id,
    };

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert([newAnnouncement])
      .select()
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
