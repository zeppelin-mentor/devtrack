import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SupabaseClient } from '@supabase/supabase-js';

export function registerTechStacksTools(server: McpServer, supabase: SupabaseClient) {
  // Add Tech Stack
  server.registerTool(
    'add_tech_stack',
    {
      title: 'Add Tech Stack',
      description: 'Create a tech stack if it does not already exist.',
      inputSchema: z.object({
        name: z.string().min(1),
        category: z.string().default('Other'),
        description: z.string().optional(),
      }),
    },
    async ({ name, category, description }) => {
      const trimmedName = name.trim();
      const existing = await supabase
        .from('tech_stacks')
        .select('id,name,category,description')
        .ilike('name', trimmedName)
        .limit(1)
        .maybeSingle();

      if (existing.error) {
        throw new Error(`Failed to check existing tech stack: ${existing.error.message}`);
      }

      if (existing.data) {
        const stack = existing.data as Record<string, unknown>;
        return {
          content: [{ type: 'text', text: `Tech stack already exists: ${stack.name}` }],
          structuredContent: { ...stack, created: false },
        };
      }

      const { data, error } = await supabase
        .from('tech_stacks')
        .insert([
          {
            name: trimmedName,
            category,
            description,
          },
        ] as never[])
        .select('id,name,category,description')
        .single();

      if (error) {
        throw new Error(`Failed to create tech stack: ${error.message}`);
      }

      const stack = (data || {}) as Record<string, unknown>;
      return {
        content: [{ type: 'text', text: `Tech stack created: ${stack.name}` }],
        structuredContent: { ...stack, created: true },
      };
    },
  );
}
