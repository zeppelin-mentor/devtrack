import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const statusEnum = z.enum(['all', 'pending', 'worked']);
const mutationStatusEnum = z.enum(['pending', 'worked']);

type ProjectRow = Record<string, unknown> & {
  id?: string;
  name?: string;
  user_id?: string;
  project_type?: string;
  category_id?: string;
  role_id?: string;
  project_description?: string;
  responsibilities?: string;
  project_highlights?: string;
  start_date?: string;
  end_date?: string | null;
  team_size?: number;
  client_name?: string;
  gmail_id?: string;
  github_id?: string;
  repo_url?: string;
  hosting?: string;
  domain?: string;
  notes?: string;
  created_at?: string;
};

type ProjectTechStackRow = {
  tech_stack_id: string;
};

type TechStackRow = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
};

type GmailAccountRow = {
  id: string;
  email: string;
  recovery_email?: string | null;
  notes?: string | null;
};

type GitHubAccountRow = {
  id: string;
  username: string;
  email: string;
  gmail_id?: string | null;
  ssh_key?: string | null;
  notes?: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  description?: string | null;
};

type RoleRow = {
  id: string;
  name: string;
};

function normalizeProjectStatus(project: { end_date?: string | null }) {
  return project.end_date ? 'worked' : 'pending';
}

async function getProjectTechStackIds(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>, projectId: string) {
  const { data, error } = await supabaseAdmin
    .from('project_tech_stack')
    .select('tech_stack_id')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Failed to fetch project tech stacks: ${error.message}`);
  }

  return ((data || []) as ProjectTechStackRow[]).map((item) => item.tech_stack_id);
}

async function replaceProjectTechStacks(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  projectId: string,
  techStackIds: string[],
) {
  const { error: deleteError } = await supabaseAdmin
    .from('project_tech_stack')
    .delete()
    .eq('project_id', projectId);

  if (deleteError) {
    throw new Error(`Failed to clear project tech stacks: ${deleteError.message}`);
  }

  if (techStackIds.length === 0) {
    return;
  }

  const mappings = techStackIds.map((techStackId) => ({
    project_id: projectId,
    tech_stack_id: techStackId,
  }));

  const { error: insertError } = await supabaseAdmin
    .from('project_tech_stack')
    .insert(mappings as never[]);

  if (insertError) {
    throw new Error(`Failed to save project tech stacks: ${insertError.message}`);
  }
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function escapeCsvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

async function findOrCreateTechStackId(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  name: string,
  category: string,
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await supabaseAdmin
    .from('tech_stacks')
    .select('id')
    .ilike('name', normalizedName)
    .limit(1)
    .maybeSingle();

  const existingRow = (existing.data || null) as { id?: string } | null;

  if (existing.error) {
    throw new Error(`Failed to find tech stack \"${normalizedName}\": ${existing.error.message}`);
  }

  if (existingRow?.id) {
    return existingRow.id;
  }

  const created = await supabaseAdmin
    .from('tech_stacks')
    .insert([
      {
        name: normalizedName,
        category,
      },
    ] as never[])
    .select('id')
    .single();

  if (created.error) {
    throw new Error(`Failed to create tech stack \"${normalizedName}\": ${created.error.message}`);
  }

  return (created.data as { id: string }).id;
}

async function resolveTechStackIds(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  options: {
    techStackIds?: string[];
    techStackNames?: string[];
    defaultCategory?: string;
  },
) {
  const ids = uniqueStrings(options.techStackIds || []);
  const names = uniqueStrings((options.techStackNames || []).map((name) => name.trim()));
  const createdOrFoundIds: string[] = [];

  for (const name of names) {
    const id = await findOrCreateTechStackId(supabaseAdmin, name, options.defaultCategory || 'Other');
    if (id) {
      createdOrFoundIds.push(id);
    }
  }

  return uniqueStrings([...ids, ...createdOrFoundIds]);
}

async function findOrCreateCategoryId(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  name: string,
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await supabaseAdmin
    .from('categories')
    .select('id')
    .ilike('name', normalizedName)
    .limit(1)
    .maybeSingle();

  const existingRow = (existing.data || null) as { id?: string } | null;

  if (existing.error) {
    throw new Error(`Failed to find category \"${normalizedName}\": ${existing.error.message}`);
  }

  if (existingRow?.id) {
    return existingRow.id;
  }

  const created = await supabaseAdmin
    .from('categories')
    .insert([
      {
        name: normalizedName,
      },
    ] as never[])
    .select('id')
    .single();

  if (created.error) {
    throw new Error(`Failed to create category \"${normalizedName}\": ${created.error.message}`);
  }

  return (created.data as { id: string }).id;
}

async function findOrCreateRoleId(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  name: string,
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await supabaseAdmin
    .from('roles')
    .select('id')
    .ilike('name', normalizedName)
    .limit(1)
    .maybeSingle();

  const existingRow = (existing.data || null) as { id?: string } | null;

  if (existing.error) {
    throw new Error(`Failed to find role \"${normalizedName}\": ${existing.error.message}`);
  }

  if (existingRow?.id) {
    return existingRow.id;
  }

  const created = await supabaseAdmin
    .from('roles')
    .insert([
      {
        name: normalizedName,
      },
    ] as never[])
    .select('id')
    .single();

  if (created.error) {
    throw new Error(`Failed to create role \"${normalizedName}\": ${created.error.message}`);
  }

  return (created.data as { id: string }).id;
}

async function buildProjectDetails(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  row: ProjectRow,
) {
  if (!row.id) {
    throw new Error('Project not found.');
  }

  const techStackIds = await getProjectTechStackIds(supabaseAdmin, row.id);
  const techStacksResult = techStackIds.length
    ? await supabaseAdmin
        .from('tech_stacks')
        .select('id,name,category,description')
        .in('id', techStackIds)
        .order('name')
    : { data: [], error: null };

  if (techStacksResult.error) {
    throw new Error(`Failed to fetch tech stack details: ${techStacksResult.error.message}`);
  }

  let category: CategoryRow | null = null;
  if (row.category_id) {
    const categoryResult = await supabaseAdmin
      .from('categories')
      .select('id,name,description')
      .eq('id', String(row.category_id))
      .limit(1)
      .maybeSingle();

    if (categoryResult.error) {
      throw new Error(`Failed to fetch category details: ${categoryResult.error.message}`);
    }

    category = (categoryResult.data || null) as CategoryRow | null;
  }

  let role: RoleRow | null = null;
  if (row.role_id) {
    const roleResult = await supabaseAdmin
      .from('roles')
      .select('id,name')
      .eq('id', String(row.role_id))
      .limit(1)
      .maybeSingle();

    if (roleResult.error) {
      throw new Error(`Failed to fetch role details: ${roleResult.error.message}`);
    }

    role = (roleResult.data || null) as RoleRow | null;
  }

  let gmailAccount: GmailAccountRow | null = null;
  if (row.gmail_id) {
    const gmailResult = await supabaseAdmin
      .from('gmail_accounts')
      .select('id,email,recovery_email,notes')
      .eq('id', String(row.gmail_id))
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (gmailResult.error) {
      throw new Error(`Failed to fetch Gmail account details: ${gmailResult.error.message}`);
    }

    gmailAccount = (gmailResult.data || null) as GmailAccountRow | null;
  }

  let githubAccount: GitHubAccountRow | null = null;
  if (row.github_id) {
    const githubResult = await supabaseAdmin
      .from('github_accounts')
      .select('id,username,email,gmail_id,ssh_key,notes')
      .eq('id', String(row.github_id))
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (githubResult.error) {
      throw new Error(`Failed to fetch GitHub account details: ${githubResult.error.message}`);
    }

    githubAccount = (githubResult.data || null) as GitHubAccountRow | null;
  }

  const project = { ...row, status: normalizeProjectStatus(row) };
  return {
    ...project,
    tech_stack_ids: techStackIds,
    tech_stacks: (techStacksResult.data || []) as TechStackRow[],
    category,
    role,
    gmail_account: gmailAccount,
    github_account: githubAccount,
  };
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
      const resolvedCategoryId = category_id || (category_name
        ? await findOrCreateCategoryId(supabaseAdmin, category_name)
        : null);
      const resolvedRoleId = role_id || (role_name ? await findOrCreateRoleId(supabaseAdmin, role_name) : null);

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

      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert([insertPayload] as never[])
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to create project: ${error.message}`);
      }

      const row = (data || {}) as ProjectRow;
      const resolvedTechStackIds = await resolveTechStackIds(supabaseAdmin, {
        techStackIds: tech_stack_ids,
        techStackNames: tech_stack_names,
        defaultCategory: tech_stack_category,
      });

      if (row.id && resolvedTechStackIds.length > 0) {
        await replaceProjectTechStacks(supabaseAdmin, row.id, resolvedTechStackIds);
      }

      const projectTechStacks = row.id ? await getProjectTechStackIds(supabaseAdmin, row.id) : [];
      const project = { ...row, status: normalizeProjectStatus(row) };

      return {
        content: [{ type: 'text', text: `Project created: ${project.name} (${project.status})` }],
        structuredContent: {
          ...project,
          tech_stack_ids: projectTechStacks,
        },
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
        updatePayload.category_id = await findOrCreateCategoryId(supabaseAdmin, category_name);
      }

      if (role_id) {
        updatePayload.role_id = role_id;
      } else if (role_name) {
        updatePayload.role_id = await findOrCreateRoleId(supabaseAdmin, role_name);
      }

      if (status === 'worked' && !updatePayload.end_date) {
        updatePayload.end_date = new Date().toISOString().slice(0, 10);
      }

      if (status === 'pending') {
        updatePayload.end_date = null;
      }

      let data: unknown = null;

      if (Object.keys(updatePayload).length > 0) {
        const response = await supabaseAdmin
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
        const response = await supabaseAdmin
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (response.error) {
          throw new Error(`Failed to load project for update: ${response.error.message}`);
        }

        data = response.data;
      }

      const row = (data || {}) as ProjectRow;
      if (!row.id) {
        throw new Error('Project not found.');
      }

      const hasTechStackInput = Boolean(tech_stack_ids || tech_stack_names);
      if (hasTechStackInput) {
        const resolvedTechStackIds = await resolveTechStackIds(supabaseAdmin, {
          techStackIds: tech_stack_ids,
          techStackNames: tech_stack_names,
          defaultCategory: tech_stack_category,
        });
        await replaceProjectTechStacks(supabaseAdmin, row.id, resolvedTechStackIds);
      }

      const projectTechStacks = await getProjectTechStackIds(supabaseAdmin, row.id);
      const project = { ...row, status: normalizeProjectStatus(row) };

      return {
        content: [{ type: 'text', text: `Project updated: ${project.name} (${project.status})` }],
        structuredContent: {
          ...project,
          tech_stack_ids: projectTechStacks,
        },
      };
    },
  );

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
      const { data, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch project: ${error.message}`);
      }

      const project = await buildProjectDetails(supabaseAdmin, userId, (data || {}) as ProjectRow);

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
      let query = supabaseAdmin
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

      const rows = (data || []) as ProjectRow[];
      const filteredByStatus = status === 'all'
        ? rows
        : rows.filter((project) => normalizeProjectStatus(project) === status);

      const details = await Promise.all(
        filteredByStatus.map((row) => buildProjectDetails(supabaseAdmin, userId, row)),
      );

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
        const techStacksText = project.tech_stacks.map((stack) => stack.name).join(', ');
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
        ].map(escapeCsvCell).join(',');
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
      const existing = await supabaseAdmin
        .from('tech_stacks')
        .select('id,name,category,description')
        .ilike('name', trimmedName)
        .limit(1)
        .maybeSingle();

      if (existing.error) {
        throw new Error(`Failed to check existing tech stack: ${existing.error.message}`);
      }

      if (existing.data) {
        const stack = existing.data as TechStackRow;
        return {
          content: [{ type: 'text', text: `Tech stack already exists: ${stack.name}` }],
          structuredContent: { ...stack, created: false },
        };
      }

      const { data, error } = await supabaseAdmin
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

      const stack = (data || {}) as TechStackRow;
      return {
        content: [{ type: 'text', text: `Tech stack created: ${stack.name}` }],
        structuredContent: { ...stack, created: true },
      };
    },
  );

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
      const { data, error } = await supabaseAdmin
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

      const account = (data || {}) as GmailAccountRow;
      return {
        content: [{ type: 'text', text: `Gmail account created: ${account.email}` }],
        structuredContent: account,
      };
    },
  );

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
        const gmailResult = await supabaseAdmin
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

      const { data, error } = await supabaseAdmin
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

      const account = (data || {}) as GitHubAccountRow;
      return {
        content: [{ type: 'text', text: `GitHub account created: ${account.username}` }],
        structuredContent: account,
      };
    },
  );

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
      const { error: mappingDeleteError } = await supabaseAdmin
        .from('project_tech_stack')
        .delete()
        .eq('project_id', id);

      if (mappingDeleteError) {
        throw new Error(`Failed to delete project tech stack mappings: ${mappingDeleteError.message}`);
      }

      const { data, error } = await supabaseAdmin
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

  return server;
}
