import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SupabaseClient } from '@supabase/supabase-js';

export function registerPagesTools(
  server: McpServer,
  supabase: SupabaseClient,
  userId: string,
) {
  // List Pages
  server.registerTool(
    'list_pages',
    {
      title: 'List Pages',
      description: 'List your pages with optional filtering by project, status, or search query.',
      inputSchema: z.object({
        query: z.string().optional(),
        project_id: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
      }),
    },
    async ({ query, project_id, status }) => {
      let pageQuery = supabase
        .from('pages')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (project_id) {
        pageQuery = pageQuery.eq('project_id', project_id);
      }

      if (status) {
        pageQuery = pageQuery.eq('status', status);
      }

      const { data, error } = await pageQuery;

      if (error) {
        throw new Error(`Failed to fetch pages: ${error.message}`);
      }

      let pages = (data || []) as Array<Record<string, unknown>>;

      if (query) {
        const searchLower = query.toLowerCase();
        pages = pages.filter(
          (page) =>
            String(page.title || '').toLowerCase().includes(searchLower) ||
            String(page.content || '').toLowerCase().includes(searchLower)
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ total: pages.length, pages }, null, 2),
          },
        ],
        structuredContent: {
          total: pages.length,
          pages,
        },
      };
    },
  );

  // Get Page
  server.registerTool(
    'get_page',
    {
      title: 'Get Page',
      description: 'Get full details of a page by id.',
      inputSchema: z.object({
        id: z.string().min(1),
      }),
    },
    async ({ id }) => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch page: ${error.message}`);
      }

      const page = (data || {}) as Record<string, unknown>;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(page, null, 2),
          },
        ],
        structuredContent: page,
      };
    },
  );

  // Add Page
  server.registerTool(
    'add_page',
    {
      title: 'Add Page',
      description: 'Create a new page with Markdown content.',
      inputSchema: z.object({
        title: z.string().min(1),
        content: z.string().default(''),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        project_id: z.string().optional(),
        slug: z.string().optional(),
        icon: z.string().optional(),
        cover_url: z.string().url().optional(),
        is_public: z.boolean().default(false),
      }),
    },
    async ({ title, content, status, project_id, slug, icon, cover_url, is_public }) => {
      let finalSlug = slug;

      // Auto-generate slug if not provided
      if (!finalSlug && title) {
        const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', {
          page_title: title,
        });

        if (slugError) {
          throw new Error(`Failed to generate slug: ${slugError.message}`);
        }

        finalSlug = String(slugData);
      }

      const { data, error } = await supabase
        .from('pages')
        .insert([
          {
            user_id: userId,
            title,
            content,
            status,
            project_id: project_id || null,
            slug: finalSlug || null,
            icon: icon || null,
            cover_url: cover_url || null,
            is_public,
            share_token: null,
            view_count: 0,
          },
        ] as never[])
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to create page: ${error.message}`);
      }

      const page = (data || {}) as Record<string, unknown>;

      return {
        content: [{ type: 'text', text: `Page created: ${page.title}` }],
        structuredContent: page,
      };
    },
  );

  // Edit Page
  server.registerTool(
    'edit_page',
    {
      title: 'Edit Page',
      description: 'Update an existing page by id.',
      inputSchema: z.object({
        id: z.string().min(1),
        title: z.string().optional(),
        content: z.string().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        project_id: z.string().nullable().optional(),
        slug: z.string().optional(),
        icon: z.string().nullable().optional(),
        cover_url: z.string().url().nullable().optional(),
        is_public: z.boolean().optional(),
      }),
    },
    async ({ id, ...updates }) => {
      const updatePayload: Record<string, unknown> = {};

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          updatePayload[key] = value;
        }
      });

      if (Object.keys(updatePayload).length === 0) {
        throw new Error('No updates provided');
      }

      const { data, error } = await supabase
        .from('pages')
        .update(updatePayload as never)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to update page: ${error.message}`);
      }

      const page = (data || {}) as Record<string, unknown>;

      return {
        content: [{ type: 'text', text: `Page updated: ${page.title}` }],
        structuredContent: page,
      };
    },
  );

  // Delete Page
  server.registerTool(
    'delete_page',
    {
      title: 'Delete Page',
      description: 'Delete a page by id.',
      inputSchema: z.object({
        id: z.string().min(1),
      }),
    },
    async ({ id }) => {
      const { data, error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id,title')
        .single();

      if (error) {
        throw new Error(`Failed to delete page: ${error.message}`);
      }

      const deleted = (data || {}) as { id?: string; title?: string };

      return {
        content: [{ type: 'text', text: `Page deleted: ${deleted.title || id}` }],
        structuredContent: {
          id: deleted.id || id,
          title: deleted.title || null,
          deleted: true,
        },
      };
    },
  );

  // Publish Page
  server.registerTool(
    'publish_page',
    {
      title: 'Publish Page',
      description: 'Make a page public and generate a shareable link.',
      inputSchema: z.object({
        id: z.string().min(1),
      }),
    },
    async ({ id }) => {
      // Check if page exists and belongs to user
      const { data: existingPage, error: fetchError } = await supabase
        .from('pages')
        .select('id,title,share_token,is_public')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch page: ${fetchError.message}`);
      }

      const page = existingPage as {
        id: string;
        title: string;
        share_token: string | null;
        is_public: boolean;
      };

      // If already public with token, return existing
      if (page.is_public && page.share_token) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        return {
          content: [
            {
              type: 'text',
              text: `Page is already public: ${page.title}\nShare link: ${baseUrl}/share/${page.share_token}`,
            },
          ],
          structuredContent: {
            id: page.id,
            title: page.title,
            share_token: page.share_token,
            share_url: `${baseUrl}/share/${page.share_token}`,
            is_public: true,
            already_public: true,
          },
        };
      }

      // Generate share token
      const { data: tokenData, error: tokenError } = await supabase.rpc('generate_share_token');

      if (tokenError) {
        throw new Error(`Failed to generate share token: ${tokenError.message}`);
      }

      const shareToken = String(tokenData);

      // Update page with token and public status
      const { data: updatedPage, error: updateError } = await supabase
        .from('pages')
        .update({
          share_token: shareToken,
          is_public: true,
        } as never)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (updateError) {
        throw new Error(`Failed to publish page: ${updateError.message}`);
      }

      const updated = (updatedPage || {}) as Record<string, unknown>;
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      return {
        content: [
          {
            type: 'text',
            text: `Page published: ${updated.title}\nShare link: ${baseUrl}/share/${shareToken}`,
          },
        ],
        structuredContent: {
          ...updated,
          share_url: `${baseUrl}/share/${shareToken}`,
        },
      };
    },
  );

  // Unpublish Page
  server.registerTool(
    'unpublish_page',
    {
      title: 'Unpublish Page',
      description: 'Make a page private and remove the shareable link.',
      inputSchema: z.object({
        id: z.string().min(1),
      }),
    },
    async ({ id }) => {
      const { data, error } = await supabase
        .from('pages')
        .update({
          share_token: null,
          is_public: false,
        } as never)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to unpublish page: ${error.message}`);
      }

      const page = (data || {}) as Record<string, unknown>;

      return {
        content: [{ type: 'text', text: `Page unpublished: ${page.title}` }],
        structuredContent: page,
      };
    },
  );
}
