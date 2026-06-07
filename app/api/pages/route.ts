import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAuthedClient(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const supabase = getAuthedClient(request);

  if (!supabase) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const projectId = searchParams.get('project_id');
  const status = searchParams.get('status');

  let pagesQuery = supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (query) {
    const escapedQuery = query.replace(/[%_]/g, '\\$&');
    pagesQuery = pagesQuery.or(`title.ilike.%${escapedQuery}%,content.ilike.%${escapedQuery}%`);
  }

  if (projectId) {
    pagesQuery = pagesQuery.eq('project_id', projectId);
  }

  if (status) {
    pagesQuery = pagesQuery.eq('status', status);
  }

  const { data, error } = await pagesQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ pages: data });
}

export async function POST(request: NextRequest) {
  const supabase = getAuthedClient(request);

  if (!supabase) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from('pages')
    .insert([
      {
        user_id: user.id,
        title: body.title || 'Untitled',
        content: body.content || '',
        status: body.status || 'draft',
        project_id: body.project_id || null,
        parent_id: body.parent_id || null,
        slug: body.slug || null,
        icon: body.icon || null,
        cover_url: body.cover_url || null,
        is_public: body.is_public || false,
        share_token: null,
        view_count: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ page: data }, { status: 201 });
}
