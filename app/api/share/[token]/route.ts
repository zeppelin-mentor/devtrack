import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    // Fetch the public page by share token
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('share_token', token)
      .eq('is_public', true)
      .single();

    if (error || !page) {
      return NextResponse.json(
        { error: 'Page not found or not publicly shared' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from('pages')
      .update({
        view_count: page.view_count + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq('id', page.id);

    return NextResponse.json({ page: { ...page, view_count: page.view_count + 1 } });
  } catch (error) {
    console.error('Error fetching shared page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
