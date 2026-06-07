import type { SupabaseClient } from '@supabase/supabase-js';

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

export function normalizeProjectStatus(project: { end_date?: string | null }) {
  return project.end_date ? 'worked' : 'pending';
}

export async function getProjectTechStackIds(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase
    .from('project_tech_stack')
    .select('tech_stack_id')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Failed to fetch project tech stacks: ${error.message}`);
  }

  return ((data || []) as ProjectTechStackRow[]).map((item) => item.tech_stack_id);
}

export async function replaceProjectTechStacks(
  supabase: SupabaseClient,
  projectId: string,
  techStackIds: string[],
) {
  const { error: deleteError } = await supabase
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

  const { error: insertError } = await supabase
    .from('project_tech_stack')
    .insert(mappings as never[]);

  if (insertError) {
    throw new Error(`Failed to save project tech stacks: ${insertError.message}`);
  }
}

export function uniqueStrings(values: string[]) {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

export function escapeCsvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export async function findOrCreateTechStackId(
  supabase: SupabaseClient,
  name: string,
  category: string,
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await supabase
    .from('tech_stacks')
    .select('id')
    .ilike('name', normalizedName)
    .limit(1)
    .maybeSingle();

  const existingRow = (existing.data || null) as { id?: string } | null;

  if (existing.error) {
    throw new Error(`Failed to find tech stack "${normalizedName}": ${existing.error.message}`);
  }

  if (existingRow?.id) {
    return existingRow.id;
  }

  const created = await supabase
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
    throw new Error(`Failed to create tech stack "${normalizedName}": ${created.error.message}`);
  }

  return (created.data as { id: string }).id;
}

export async function resolveTechStackIds(
  supabase: SupabaseClient,
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
    const id = await findOrCreateTechStackId(supabase, name, options.defaultCategory || 'Other');
    if (id) {
      createdOrFoundIds.push(id);
    }
  }

  return uniqueStrings([...ids, ...createdOrFoundIds]);
}

export async function findOrCreateCategoryId(supabase: SupabaseClient, name: string) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await supabase
    .from('categories')
    .select('id')
    .ilike('name', normalizedName)
    .limit(1)
    .maybeSingle();

  const existingRow = (existing.data || null) as { id?: string } | null;

  if (existing.error) {
    throw new Error(`Failed to find category "${normalizedName}": ${existing.error.message}`);
  }

  if (existingRow?.id) {
    return existingRow.id;
  }

  const created = await supabase
    .from('categories')
    .insert([
      {
        name: normalizedName,
      },
    ] as never[])
    .select('id')
    .single();

  if (created.error) {
    throw new Error(`Failed to create category "${normalizedName}": ${created.error.message}`);
  }

  return (created.data as { id: string }).id;
}

export async function findOrCreateRoleId(supabase: SupabaseClient, name: string) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const existing = await supabase
    .from('roles')
    .select('id')
    .ilike('name', normalizedName)
    .limit(1)
    .maybeSingle();

  const existingRow = (existing.data || null) as { id?: string } | null;

  if (existing.error) {
    throw new Error(`Failed to find role "${normalizedName}": ${existing.error.message}`);
  }

  if (existingRow?.id) {
    return existingRow.id;
  }

  const created = await supabase
    .from('roles')
    .insert([
      {
        name: normalizedName,
      },
    ] as never[])
    .select('id')
    .single();

  if (created.error) {
    throw new Error(`Failed to create role "${normalizedName}": ${created.error.message}`);
  }

  return (created.data as { id: string }).id;
}

export async function buildProjectDetails(supabase: SupabaseClient, userId: string, row: ProjectRow) {
  if (!row.id) {
    throw new Error('Project not found.');
  }

  const techStackIds = await getProjectTechStackIds(supabase, row.id);
  const techStacksResult = techStackIds.length
    ? await supabase
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
    const categoryResult = await supabase
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
    const roleResult = await supabase
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
    const gmailResult = await supabase
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
    const githubResult = await supabase
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
