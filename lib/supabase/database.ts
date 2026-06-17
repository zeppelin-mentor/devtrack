import { supabase } from './client';
import type { Project, GmailAccount, GitHubAccount, TechStack, Category, Role, Page } from '@/types';

// Projects
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Project[];
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Project;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Pages
export async function getPages(userId: string, options?: { query?: string; projectId?: string; status?: string }) {
  let request = supabase
    .from('pages')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (options?.projectId) {
    request = request.eq('project_id', options.projectId);
  }

  if (options?.status) {
    request = request.eq('status', options.status);
  }

  if (options?.query) {
    const escapedQuery = options.query.replace(/[%_]/g, '\\$&');
    request = request.or(`title.ilike.%${escapedQuery}%,content.ilike.%${escapedQuery}%`);
  }

  const { data, error } = await request;

  if (error) throw error;
  return data as Page[];
}

export async function getPage(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Page;
}

export async function createPage(page: Omit<Page, 'id' | 'created_at' | 'updated_at' | 'view_count'>) {
  const { data, error } = await supabase
    .from('pages')
    .insert([page])
    .select()
    .single();

  if (error) throw error;
  return data as Page;
}

export async function updatePage(id: string, updates: Partial<Omit<Page, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'view_count'>>) {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Page;
}

// Generate share token for a page
export async function generateShareToken(pageId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_share_token');
  
  if (error) throw error;
  
  const token = data as string;
  
  // Update the page with the share token
  const { error: updateError } = await supabase
    .from('pages')
    .update({ share_token: token, is_public: true })
    .eq('id', pageId);
  
  if (updateError) throw updateError;
  
  return token;
}

// Remove share token and make page private
export async function removeShareToken(pageId: string): Promise<void> {
  const { error } = await supabase
    .from('pages')
    .update({ share_token: null, is_public: false })
    .eq('id', pageId);
  
  if (error) throw error;
}

// Auto-generate slug from title
export async function generatePageSlug(title: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_slug', { page_title: title });
  
  if (error) throw error;
  
  return data as string;
}

export async function deletePage(id: string) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Gmail Accounts
export async function getGmailAccounts(userId: string) {
  const { data, error } = await supabase
    .from('gmail_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as GmailAccount[];
}

export async function createGmailAccount(account: Omit<GmailAccount, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gmail_accounts')
    .insert([account])
    .select()
    .single();
  
  if (error) throw error;
  return data as GmailAccount;
}

export async function updateGmailAccount(id: string, updates: Partial<GmailAccount>) {
  const { data, error } = await supabase
    .from('gmail_accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as GmailAccount;
}

export async function deleteGmailAccount(id: string) {
  const { error } = await supabase
    .from('gmail_accounts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// GitHub Accounts
export async function getGitHubAccounts(userId: string) {
  const { data, error } = await supabase
    .from('github_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as GitHubAccount[];
}

export async function createGitHubAccount(account: Omit<GitHubAccount, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('github_accounts')
    .insert([account])
    .select()
    .single();
  
  if (error) throw error;
  return data as GitHubAccount;
}

export async function updateGitHubAccount(id: string, updates: Partial<GitHubAccount>) {
  const { data, error } = await supabase
    .from('github_accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as GitHubAccount;
}

export async function deleteGitHubAccount(id: string) {
  const { error } = await supabase
    .from('github_accounts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Tech Stacks
export async function getTechStacks() {
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as TechStack[];
}

export async function createTechStack(stack: Omit<TechStack, 'id'>) {
  const { data, error } = await supabase
    .from('tech_stacks')
    .insert([stack])
    .select()
    .single();
  
  if (error) throw error;
  return data as TechStack;
}

export async function updateTechStack(id: string, updates: Partial<TechStack>) {
  const { data, error } = await supabase
    .from('tech_stacks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as TechStack;
}

export async function deleteTechStack(id: string) {
  const { error } = await supabase
    .from('tech_stacks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Category[];
}

// Roles
export async function getRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Role[];
}

// Project Tech Stack
export async function getProjectTechStacks(projectId: string) {
  const { data, error } = await supabase
    .from('project_tech_stack')
    .select('tech_stack_id')
    .eq('project_id', projectId);
  
  if (error) throw error;
  return data.map(item => item.tech_stack_id);
}

export async function setProjectTechStacks(projectId: string, techStackIds: string[]) {
  // Delete existing mappings
  await supabase
    .from('project_tech_stack')
    .delete()
    .eq('project_id', projectId);
  
  // Insert new mappings
  if (techStackIds.length > 0) {
    const mappings = techStackIds.map(techStackId => ({
      project_id: projectId,
      tech_stack_id: techStackId,
    }));
    
    const { error } = await supabase
      .from('project_tech_stack')
      .insert(mappings);
    
    if (error) throw error;
  }
  
  return true;
}

// Helper functions
export async function getProjectsUsingGmail(gmailId: string, userId: string) {
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('gmail_id', gmailId)
    .eq('user_id', userId);
  
  if (error) throw error;
  return count || 0;
}

export async function getProjectsUsingGitHub(githubId: string, userId: string) {
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('github_id', githubId)
    .eq('user_id', userId);
  
  if (error) throw error;
  return count || 0;
}

export async function getProjectsUsingTechStack(techStackId: string, userId: string) {
  const { data, error } = await supabase
    .from('project_tech_stack')
    .select('project_id')
    .eq('tech_stack_id', techStackId);
  
  if (error) throw error;
  
  if (data.length === 0) return 0;
  
  const projectIds = data.map(item => item.project_id);
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .in('id', projectIds)
    .eq('user_id', userId);
  
  return count || 0;
}

// Export helper function
export async function getProjectsWithDetails(userId: string, projectIds: string[]) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      categories(name),
      roles(name)
    `)
    .eq('user_id', userId)
    .in('id', projectIds);
  
  if (error) throw error;
  return data;
}

// User Profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function createUserProfile(profile: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profile])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Portfolio Projects
export async function getPortfolioProjects(userId: string) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select(`
      *,
      project:projects(*)
    `)
    .eq('user_id', userId)
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function addProjectToPortfolio(userId: string, projectId: string, displayOrder: number) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert([
      {
        user_id: userId,
        project_id: projectId,
        is_visible: true,
        display_order: displayOrder,
      },
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeProjectFromPortfolio(portfolioProjectId: string) {
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', portfolioProjectId);
  
  if (error) throw error;
  return true;
}

export async function updatePortfolioProjectOrder(portfolioProjectId: string, displayOrder: number) {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .update({ display_order: displayOrder })
    .eq('id', portfolioProjectId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
