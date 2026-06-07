import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { registerProjectsTools } from './tools/projects';
import { registerPagesTools } from './tools/pages';
import { registerAccountsTools } from './tools/accounts';
import { registerTechStacksTools } from './tools/techStacks';

export function createProjectsMcpServerForUser(userId: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const server = new McpServer({
    name: 'devtrack-projects-mcp-http',
    version: '1.0.0',
  });

  // Register all modular tools
  registerProjectsTools(server, supabaseAdmin, userId);
  registerPagesTools(server, supabaseAdmin, userId);
  registerAccountsTools(server, supabaseAdmin, userId);
  registerTechStacksTools(server, supabaseAdmin);

  return server;
}
