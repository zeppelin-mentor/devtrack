import { supabase } from './client';
import type { Project, GmailAccount, GitHubAccount, TechStack, Category, Role } from '@/types';

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
