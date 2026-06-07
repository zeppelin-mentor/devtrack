import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  normalizeProjectStatus,
  getProjectTechStackIds,
  replaceProjectTechStacks,
  resolveTechStackIds,
  findOrCreateCategoryId,
  findOrCreateRoleId,
  buildProjectDetails,
  escapeCsvCell,
  uniqueStrings,
} from '../utils/projectHelpers';

const statusEnum = z.enum(['all', 'pending', 'worked']);
const mutationStatusEnum = z.enum(['pending', 'worked']);

export function registerProjectsTools(
  server: McpServer,
  supabase: SupabaseClient,
  userId: string,
) {
  // List Projects
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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
      }

      const rows = (data || []) as Array<Record<string, unknown>>;
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

  // Add Project
  server.registerTool(
    'add_project',
    {
      title: 'Add Project',
      description: 'Create a new project in your workspace.',
      inputSchema: z.object({
        name: z.string().min(1),
        project_type: z.string().optional(),
        category_id: z.string().optional(),
        category_name: z.string().min(1).optional(),
        role_id: z.string().optional(),
        role_name: z.string().min(1).optional(),
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
        tech_stack_ids: z.array(z.string().min(1)).optional(),
        tech_stack_names: z.array(z.string().min(1)).optional(),
        tech_stack_category: z.string().optional(),
        status: mutationStatusEnum.default('pending'),
      }),
    },
    async ({
      status,
      category_id,
      category_name,
      role_id,
      role_name,
      tech_stack_ids,
      tech_stack_names,
      tech_stack_category,
      ...payload
    }) => {
      const resolvedCategoryId =
        category_id || (category_name ? await findOrCreateCategoryId(supabase, category_name) : null);
      const resolvedRoleId = role_id || (role_name ? await findOrCreateRoleId(supabase, role_name) : null);

      if (!resolvedCategoryId || !resolvedRoleId) {
        throw new Error('add_project requires category_id/category_name and role_id/role_name.');
      }

      const insertPayload: Record<string, unknown> = {
        ...payload,
        user_id: userId,
        category_id: resolvedCategoryId,
        role_id: resolvedRoleId,
      };

      if (status === 'worked' && !insertPayload.end_date) {
        insertPayload.end_date = new Date().toISOString().slice(0, 10);
      }

      if (status === 'pending') {
        insertPayload.end_date = null;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([insertPayload] as never[])
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to create project: ${error.message}`);
      }

      const row = (data || {}) as Record<string, unknown>;
      const resolvedTechStackIds = await resolveTechStackIds(supabase, {
        techStackIds: tech_stack_ids,
        techStackNames: tech_stack_names,
        defaultCategory: tech_stack_category,
      });

      if (row.id && resolvedTechStackIds.length > 0) {
        await replaceProjectTechStacks(supabase, String(row.id), resolvedTechStackIds);
      }

      const projectTechStacks = row.id ? await getProjectTechStackIds(supabase, String(row.id)) : [];
      const projectStatus = normalizeProjectStatus(row);
      const project = { ...row, status: projectStatus };

      return {
        content: [{ type: 'text', text: `Project created: ${String(row.name || 'Unknown')} (${projectStatus})` }],
        structuredContent: {
          ...project,
          tech_stack_ids: projectTechStacks,
        },
      };
    },
  );

  // Edit Project
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
        category_name: z.string().min(1).optional(),
        role_id: z.string().optional(),
        role_name: z.string().min(1).optional(),
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
        tech_stack_ids: z.array(z.string().min(1)).optional(),
        tech_stack_names: z.array(z.string().min(1)).optional(),
        tech_stack_category: z.string().optional(),
        status: mutationStatusEnum.optional(),
      }),
    },
    async ({
      id,
      status,
      category_id,
      category_name,
      role_id,
      role_name,
      tech_stack_ids,
      tech_stack_names,
      tech_stack_category,
      ...updates
    }) => {
      const updatePayload: Record<string, unknown> = { ...updates };

      if (category_id) {
        updatePayload.category_id = category_id;
      } else if (category_name) {
        updatePayload.category_id = await findOrCreateCategoryId(supabase, category_name);
      }

      if (role_id) {
        updatePayload.role_id = role_id;
      } else if (role_name) {
        updatePayload.role_id = await findOrCreateRoleId(supabase, role_name);
      }

      if (status === 'worked' && !updatePayload.end_date) {
        updatePayload.end_date = new Date().toISOString().slice(0, 10);
      }

      if (status === 'pending') {
        updatePayload.end_date = null;
      }

      let data: unknown = null;

      if (Object.keys(updatePayload).length > 0) {
        const response = await supabase
          .from('projects')
          .update(updatePayload as never)
          .eq('id', id)
          .eq('user_id', userId)
          .select('*')
          .single();

        if (response.error) {
          throw new Error(`Failed to update project: ${response.error.message}`);
        }

        data = response.data;
      } else {
        const response = await supabase.from('projects').select('*').eq('id', id).eq('user_id', userId).single();

        if (response.error) {
          throw new Error(`Failed to load project for update: ${response.error.message}`);
        }

        data = response.data;
      }

      const row = (data || {}) as Record<string, unknown>;
      if (!row.id) {
        throw new Error('Project not found.');
      }

      const hasTechStackInput = Boolean(tech_stack_ids || tech_stack_names);
      if (hasTechStackInput) {
        const resolvedTechStackIds = await resolveTechStackIds(supabase, {
          techStackIds: tech_stack_ids,
          techStackNames: tech_stack_names,
          defaultCategory: tech_stack_category,
        });
        await replaceProjectTechStacks(supabase, String(row.id), resolvedTechStackIds);
      }

      const projectTechStacks = await getProjectTechStackIds(supabase, String(row.id));
      const projectStatus = normalizeProjectStatus(row);
      const project = { ...row, status: projectStatus };

      return {
        content: [{ type: 'text', text: `Project updated: ${String(row.name || 'Unknown')} (${projectStatus})` }],
        structuredContent: {
          ...project,
          tech_stack_ids: projectTechStacks,
        },
      };
    },
  );

  // Get Project Details
  server.registerTool(
    'get_project_details',
    {
      title: 'Get Project Details',
      description: 'Get full details of one project by id including tech stacks and linked accounts.',
      inputSchema: z.object({
        id: z.string().min(1),
      }),
    },
    async ({ id }) => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch project: ${error.message}`);
      }

      const project = await buildProjectDetails(supabase, userId, (data || {}) as Record<string, unknown>);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
        structuredContent: project,
      };
    },
  );

  // Export Projects
  server.registerTool(
    'export_projects',
    {
      title: 'Export Projects',
      description: 'Export your projects as CSV with all relevant details.',
      inputSchema: z.object({
        status: statusEnum.default('all'),
        category_id: z.string().optional(),
        role_id: z.string().optional(),
        project_ids: z.array(z.string().min(1)).optional(),
      }),
    },
    async ({ status, category_id, role_id, project_ids }) => {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (category_id) {
        query = query.eq('category_id', category_id);
      }

      if (role_id) {
        query = query.eq('role_id', role_id);
      }

      if (project_ids && project_ids.length > 0) {
        query = query.in('id', uniqueStrings(project_ids));
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch projects for export: ${error.message}`);
      }

      const rows = (data || []) as Array<Record<string, unknown>>;
      const filteredByStatus =
        status === 'all' ? rows : rows.filter((project) => normalizeProjectStatus(project) === status);

      const details = await Promise.all(filteredByStatus.map((row) => buildProjectDetails(supabase, userId, row)));

      const headers = [
        'id',
        'name',
        'status',
        'project_type',
        'role',
        'category',
        'project_description',
        'responsibilities',
        'project_highlights',
        'start_date',
        'end_date',
        'team_size',
        'client_name',
        'repo_url',
        'domain',
        'hosting',
        'gmail',
        'github_username',
        'github_email',
        'tech_stacks',
        'notes',
        'created_at',
      ];

      const csvRows = details.map((project) => {
        const techStacksText = (project.tech_stacks || []).map((stack: { name: string }) => stack.name).join(', ');
        return [
          project.id,
          project.name,
          project.status,
          project.project_type,
          project.role?.name || '',
          project.category?.name || '',
          project.project_description,
          project.responsibilities,
          project.project_highlights,
          project.start_date,
          project.end_date,
          project.team_size,
          project.client_name,
          project.repo_url,
          project.domain,
          project.hosting,
          project.gmail_account?.email || '',
          project.github_account?.username || '',
          project.github_account?.email || '',
          techStacksText,
          project.notes,
          project.created_at,
        ]
          .map(escapeCsvCell)
          .join(',');
      });

      const csv = [headers.map(escapeCsvCell).join(','), ...csvRows].join('\n');
      const filename = `devtrack-projects-${new Date().toISOString().slice(0, 10)}.csv`;

      return {
        content: [
          {
            type: 'text',
            text: `CSV generated: ${filename} (rows: ${details.length})\n\n${csv}`,
          },
        ],
        structuredContent: {
          filename,
          total: details.length,
          csv,
          projects: details,
        },
      };
    },
  );

  // Delete Project
  server.registerTool(
    'delete_project',
    {
      title: 'Delete Project',
      description: 'Delete one of your existing projects by id.',
      inputSchema: z.object({
        id: z.string().min(1),
      }),
    },
    async ({ id }) => {
      const { error: mappingDeleteError } = await supabase
        .from('project_tech_stack')
        .delete()
        .eq('project_id', id);

      if (mappingDeleteError) {
        throw new Error(`Failed to delete project tech stack mappings: ${mappingDeleteError.message}`);
      }

      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id,name')
        .single();

      if (error) {
        throw new Error(`Failed to delete project: ${error.message}`);
      }

      const deleted = (data || {}) as { id?: string; name?: string };

      return {
        content: [{ type: 'text', text: `Project deleted: ${deleted.name || id}` }],
        structuredContent: {
          id: deleted.id || id,
          name: deleted.name || null,
          deleted: true,
        },
      };
    },
  );
}
