import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const statusEnum = z.enum(['all', 'pending', 'worked']);
const mutationStatusEnum = z.enum(['pending', 'worked']);

type ProjectRow = Record<string, unknown> & {
  id?: string;
  name?: string;
  end_date?: string | null;
};

function normalizeProjectStatus(project: { end_date?: string | null }) {
  return project.end_date ? 'worked' : 'pending';
}

export function createProjectsMcpServerForUser(userId: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const server = new McpServer({
    name: 'devtrack-projects-mcp-http',
    version: '1.0.0',
  });

  server.registerTool(
    'list_projects',
    {
      title: 'List Projects',
      description: 'List your projects and filter by worked/pending status.',
      inputSchema: z.object({
        status: statusEnum.default('all'),
      }),
    },
    async ({ status }) => {
      const { data, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
      }

      const rows = (data || []) as ProjectRow[];
      const projects = rows.map((project) => ({
        ...project,
        status: normalizeProjectStatus(project),
      }));

      const filtered = status === 'all' ? projects : projects.filter((p) => p.status === status);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ total: filtered.length, status, projects: filtered }, null, 2),
          },
        ],
        structuredContent: {
          total: filtered.length,
          status,
          projects: filtered,
        },
      };
    },
  );

  server.registerTool(
    'add_project',
    {
      title: 'Add Project',
      description: 'Create a new project in your workspace.',
      inputSchema: z.object({
        name: z.string().min(1),
        project_type: z.string().optional(),
        category_id: z.string().optional(),
        role_id: z.string().optional(),
        project_description: z.string().optional(),
        responsibilities: z.string().optional(),
        project_highlights: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        team_size: z.number().int().positive().optional(),
        client_name: z.string().optional(),
        gmail_id: z.string().optional(),
        github_id: z.string().optional(),
        repo_url: z.string().url().optional(),
        hosting: z.string().optional(),
        domain: z.string().url().optional(),
        notes: z.string().optional(),
        status: mutationStatusEnum.default('pending'),
      }),
    },
    async ({ status, ...payload }) => {
      const insertPayload: Record<string, unknown> = {
        ...payload,
        user_id: userId,
      };

      if (status === 'worked' && !insertPayload.end_date) {
        insertPayload.end_date = new Date().toISOString().slice(0, 10);
      }

      if (status === 'pending') {
        insertPayload.end_date = null;
      }

      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert([insertPayload] as never[])
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to create project: ${error.message}`);
      }

      const row = (data || {}) as ProjectRow;
      const project = { ...row, status: normalizeProjectStatus(row) };

      return {
        content: [{ type: 'text', text: `Project created: ${project.name} (${project.status})` }],
        structuredContent: project,
      };
    },
  );

  server.registerTool(
    'edit_project',
    {
      title: 'Edit Project',
      description: 'Update one of your existing projects by id.',
      inputSchema: z.object({
        id: z.string().min(1),
        name: z.string().optional(),
        project_type: z.string().optional(),
        category_id: z.string().optional(),
        role_id: z.string().optional(),
        project_description: z.string().optional(),
        responsibilities: z.string().optional(),
        project_highlights: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        team_size: z.number().int().positive().optional(),
        client_name: z.string().optional(),
        gmail_id: z.string().optional(),
        github_id: z.string().optional(),
        repo_url: z.string().url().optional(),
        hosting: z.string().optional(),
        domain: z.string().url().optional(),
        notes: z.string().optional(),
        status: mutationStatusEnum.optional(),
      }),
    },
    async ({ id, status, ...updates }) => {
      const updatePayload: Record<string, unknown> = { ...updates };

      if (status === 'worked' && !updatePayload.end_date) {
        updatePayload.end_date = new Date().toISOString().slice(0, 10);
      }

      if (status === 'pending') {
        updatePayload.end_date = null;
      }

      if (Object.keys(updatePayload).length === 0) {
        throw new Error('No fields provided for update.');
      }

      const { data, error } = await supabaseAdmin
        .from('projects')
        .update(updatePayload as never)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to update project: ${error.message}`);
      }

      const row = (data || {}) as ProjectRow;
      const project = { ...row, status: normalizeProjectStatus(row) };

      return {
        content: [{ type: 'text', text: `Project updated: ${project.name} (${project.status})` }],
        structuredContent: project,
      };
    },
  );

  return server;
}
