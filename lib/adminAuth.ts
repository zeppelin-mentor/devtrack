import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getAuthenticatedUserFromBearer } from '@/lib/mcp/security';

export async function isAdminUser(userId: string): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin();
  
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.is_admin === true;
}

export async function requireAdmin(request: Request) {
  const user = await getAuthenticatedUserFromBearer(request);
  
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }

  const isAdmin = await isAdminUser(user.id);
  
  if (!isAdmin) {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }

  return { user, status: 200 };
}
