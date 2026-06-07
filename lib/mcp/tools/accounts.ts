import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SupabaseClient } from '@supabase/supabase-js';

export function registerAccountsTools(
  server: McpServer,
  supabase: SupabaseClient,
  userId: string,
) {
  // Add Gmail Account
  server.registerTool(
    'add_gmail_account',
    {
      title: 'Add Gmail Account',
      description: 'Create a Gmail account for the current user.',
      inputSchema: z.object({
        email: z.string().email(),
        recovery_email: z.string().email().optional(),
        notes: z.string().optional(),
      }),
    },
    async ({ email, recovery_email, notes }) => {
      const { data, error } = await supabase
        .from('gmail_accounts')
        .insert([
          {
            user_id: userId,
            email,
            recovery_email,
            notes,
          },
        ] as never[])
        .select('id,email,recovery_email,notes')
        .single();

      if (error) {
        throw new Error(`Failed to create Gmail account: ${error.message}`);
      }

      const account = (data || {}) as Record<string, unknown>;
      return {
        content: [{ type: 'text', text: `Gmail account created: ${account.email}` }],
        structuredContent: account,
      };
    },
  );

  // Add GitHub Account
  server.registerTool(
    'add_github_account',
    {
      title: 'Add GitHub Account',
      description: 'Create a GitHub account for the current user, linked to Gmail if provided.',
      inputSchema: z.object({
        username: z.string().min(1),
        gmail_id: z.string().optional(),
        email: z.string().email().optional(),
        ssh_key: z.string().optional(),
        notes: z.string().optional(),
      }),
    },
    async ({ username, gmail_id, email, ssh_key, notes }) => {
      let resolvedEmail = email;

      if (gmail_id && !resolvedEmail) {
        const gmailResult = await supabase
          .from('gmail_accounts')
          .select('email')
          .eq('id', gmail_id)
          .eq('user_id', userId)
          .limit(1)
          .maybeSingle();

        const gmailRow = (gmailResult.data || null) as { email?: string } | null;

        if (gmailResult.error) {
          throw new Error(`Failed to read Gmail account: ${gmailResult.error.message}`);
        }

        if (!gmailRow?.email) {
          throw new Error('Provided gmail_id was not found for this user.');
        }

        resolvedEmail = String(gmailRow.email);
      }

      if (!resolvedEmail) {
        throw new Error('Either email or gmail_id is required to create a GitHub account.');
      }

      const { data, error } = await supabase
        .from('github_accounts')
        .insert([
          {
            user_id: userId,
            username,
            email: resolvedEmail,
            gmail_id,
            ssh_key,
            notes,
          },
        ] as never[])
        .select('id,username,email,gmail_id,ssh_key,notes')
        .single();

      if (error) {
        throw new Error(`Failed to create GitHub account: ${error.message}`);
      }

      const account = (data || {}) as Record<string, unknown>;
      return {
        content: [{ type: 'text', text: `GitHub account created: ${account.username}` }],
        structuredContent: account,
      };
    },
  );
}
