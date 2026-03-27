import { createHash, randomBytes } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const DEFAULT_DAILY_LIMIT = 100;

type McpApiKeyRow = {
  id: string;
  user_id: string;
  name: string | null;
  key_hash: string;
  key_prefix: string;
  is_active: boolean;
  requests_today: number | null;
  requests_date: string | null;
  last_used_at: string | null;
};

function getPepper() {
  return process.env.MCP_API_KEY_PEPPER || '';
}

export function hashApiKey(rawKey: string) {
  return createHash('sha256').update(`${getPepper()}${rawKey}`).digest('hex');
}

export function generateApiKey() {
  const random = randomBytes(24).toString('hex');
  return `mcp_${random}`;
}

export function extractApiKey(request: Request) {
  const xApiKey = request.headers.get('x-api-key');
  if (xApiKey) return xApiKey.trim();

  const authHeader = request.headers.get('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  return null;
}

export async function getAuthenticatedUserFromBearer(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.toLowerCase().startsWith('bearer ')) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user;
}

export async function findActiveApiKey(rawApiKey: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const keyHash = hashApiKey(rawApiKey);
  const { data, error } = await supabaseAdmin
    .from('mcp_api_keys')
    .select('*')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate API key: ${error.message}`);
  }

  return (data as McpApiKeyRow | null) || null;
}

export async function consumeDailyQuota(apiKeyRow: McpApiKeyRow, dailyLimit = DEFAULT_DAILY_LIMIT) {
  const supabaseAdmin = getSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const currentUsed = apiKeyRow.requests_date === today ? apiKeyRow.requests_today || 0 : 0;

  if (currentUsed >= dailyLimit) {
    return {
      allowed: false,
      used: currentUsed,
      remaining: 0,
      limit: dailyLimit,
      resetDate: today,
    };
  }

  const nextUsed = currentUsed + 1;

  const { error } = await supabaseAdmin
    .from('mcp_api_keys')
    .update({
      requests_today: nextUsed,
      requests_date: today,
      last_used_at: new Date().toISOString(),
    } as never)
    .eq('id', apiKeyRow.id);

  if (error) {
    throw new Error(`Failed to update request quota: ${error.message}`);
  }

  return {
    allowed: true,
    used: nextUsed,
    remaining: Math.max(0, dailyLimit - nextUsed),
    limit: dailyLimit,
    resetDate: today,
  };
}
