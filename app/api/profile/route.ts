import { NextResponse } from 'next/server';
import { getAuthenticatedUserFromBearer } from '@/lib/mcp/security';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { UserProfile } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/profile - Get current user's profile
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data as UserProfile | null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/profile - Create user profile
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Partial<UserProfile>;

    // Validate required fields
    if (!body.username || !body.display_name) {
      return NextResponse.json(
        { error: 'Username and display name are required' },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(body.username)) {
      return NextResponse.json(
        { error: 'Username must be 3-30 characters long and contain only lowercase letters, numbers, hyphens, and underscores' },
        { status: 400 }
      );
    }

    // Validate bio length
    if (body.bio && body.bio.length > 1000) {
      return NextResponse.json(
        { error: 'Bio must be 1000 characters or less' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check if profile already exists
    const { data: existing } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 409 }
      );
    }

    // Create profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert([
        {
          user_id: user.id,
          username: body.username.toLowerCase(),
          display_name: body.display_name,
          bio: body.bio || null,
          location: body.location || null,
          profile_photo_url: body.profile_photo_url || null,
          is_public: body.is_public ?? false,
          available_for_work: body.available_for_work ?? false,
          show_email: body.show_email ?? false,
          github_url: body.github_url || null,
          linkedin_url: body.linkedin_url || null,
          twitter_url: body.twitter_url || null,
          website_url: body.website_url || null,
          show_github: body.show_github ?? true,
          show_linkedin: body.show_linkedin ?? true,
          show_twitter: body.show_twitter ?? true,
          show_website: body.show_website ?? true,
        },
      ] as never[])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.message.includes('username')) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 409 }
          );
        }
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data as UserProfile }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Partial<UserProfile>;

    // Validate username format if provided
    if (body.username) {
      const usernameRegex = /^[a-z0-9_-]{3,30}$/;
      if (!usernameRegex.test(body.username)) {
        return NextResponse.json(
          { error: 'Username must be 3-30 characters long and contain only lowercase letters, numbers, hyphens, and underscores' },
          { status: 400 }
        );
      }
    }

    // Validate bio length if provided
    if (body.bio && body.bio.length > 1000) {
      return NextResponse.json(
        { error: 'Bio must be 1000 characters or less' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Build update object
    const updates: Partial<UserProfile> = {};
    if (body.username) updates.username = body.username.toLowerCase();
    if (body.display_name !== undefined) updates.display_name = body.display_name;
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.location !== undefined) updates.location = body.location;
    if (body.profile_photo_url !== undefined) updates.profile_photo_url = body.profile_photo_url;
    if (body.is_public !== undefined) updates.is_public = body.is_public;
    if (body.available_for_work !== undefined) updates.available_for_work = body.available_for_work;
    if (body.show_email !== undefined) updates.show_email = body.show_email;
    if (body.github_url !== undefined) updates.github_url = body.github_url;
    if (body.linkedin_url !== undefined) updates.linkedin_url = body.linkedin_url;
    if (body.twitter_url !== undefined) updates.twitter_url = body.twitter_url;
    if (body.website_url !== undefined) updates.website_url = body.website_url;
    if (body.show_github !== undefined) updates.show_github = body.show_github;
    if (body.show_linkedin !== undefined) updates.show_linkedin = body.show_linkedin;
    if (body.show_twitter !== undefined) updates.show_twitter = body.show_twitter;
    if (body.show_website !== undefined) updates.show_website = body.show_website;

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(updates as never)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.message.includes('username')) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 409 }
          );
        }
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data as UserProfile });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/profile - Delete user profile
export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUserFromBearer(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .delete()
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
