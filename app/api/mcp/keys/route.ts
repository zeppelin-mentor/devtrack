import { NextResponse } from 'next/server';
import { generateApiKey, getAuthenticatedUserFromBearer, hashApiKey } from '@/lib/mcp/security';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('mcp_api_keys')
      .select('id, name, key_prefix, is_active, requests_today, requests_date, last_used_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ keys: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { name?: string };
    const keyName = body.name?.trim() || 'Default MCP Key';

    const rawKey = generateApiKey();
    const keyPrefix = rawKey.slice(0, 12);
    const keyHash = hashApiKey(rawKey);

    const { data, error } = await supabaseAdmin
      .from('mcp_api_keys')
      .insert([
        {
          user_id: user.id,
          name: keyName,
          key_prefix: keyPrefix,
          key_hash: keyHash,
          is_active: true,
          requests_today: 0,
          requests_date: new Date().toISOString().slice(0, 10),
        },
      ] as never[])
      .select('id, name, key_prefix, is_active, requests_today, requests_date, last_used_at, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ key: data, rawKey }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: 'Key id is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('mcp_api_keys')
      .update({ is_active: false } as never)
      .eq('id', body.id)
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
