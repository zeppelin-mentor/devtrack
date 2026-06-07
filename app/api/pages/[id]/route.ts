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

async function authorize(request: NextRequest) {
  const supabase = getAuthedClient(request);

  if (!supabase) {
    return { supabase: null, response: NextResponse.json({ error: 'Missing bearer token' }, { status: 401 }) };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { supabase, response: null };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await authorize(request);

  if (response) {
    return response;
  }

  const { id } = await params;
  const { data, error } = await supabase!
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ page: data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await authorize(request);

  if (response) {
    return response;
  }

  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabase!
    .from('pages')
    .update({
      title: body.title,
      content: body.content,
      status: body.status,
      project_id: body.project_id || null,
      parent_id: body.parent_id || null,
      slug: body.slug || null,
      icon: body.icon || null,
      cover_url: body.cover_url || null,
      is_public: body.is_public !== undefined ? body.is_public : undefined,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ page: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await authorize(request);

  if (response) {
    return response;
  }

  const { id } = await params;
  const { error } = await supabase!
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
