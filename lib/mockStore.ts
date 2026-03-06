'use client';

import { Project, GmailAccount, GitHubAccount, TechStack } from '@/types';
import {
  mockProjects,
  mockGmailAccounts,
  mockGitHubAccounts,
  mockTechStacks,
  mockCategories,
  mockRoles,
  mockProjectTechStacks,
} from './mockData';

// In-memory store (resets on page refresh)
class MockStore {
  private projects: Project[] = [...mockProjects];
  private gmailAccounts: GmailAccount[] = [...mockGmailAccounts];
  private githubAccounts: GitHubAccount[] = [...mockGitHubAccounts];
  private techStacks: TechStack[] = [...mockTechStacks];
  private projectTechStacks: Record<string, string[]> = { ...mockProjectTechStacks };

  // Projects
  getProjects() {
    return this.projects;
  }

  getProject(id: string) {
    return this.projects.find(p => p.id === id);
  }

  addProject(project: Omit<Project, 'id' | 'created_at'>) {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    this.projects.unshift(newProject);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      return this.projects[index];
    }
    return null;
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    delete this.projectTechStacks[id];
    return true;
  }

  // Gmail Accounts
  getGmailAccounts() {
    return this.gmailAccounts;
  }

  addGmailAccount(account: Omit<GmailAccount, 'id' | 'created_at'>) {
    const newAccount: GmailAccount = {
      ...account,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    this.gmailAccounts.unshift(newAccount);
    return newAccount;
  }

  updateGmailAccount(id: string, updates: Partial<GmailAccount>) {
    const index = this.gmailAccounts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.gmailAccounts[index] = { ...this.gmailAccounts[index], ...updates };
      return this.gmailAccounts[index];
    }
    return null;
  }

  deleteGmailAccount(id: string) {
    this.gmailAccounts = this.gmailAccounts.filter(a => a.id !== id);
    return true;
  }

  // GitHub Accounts
  getGitHubAccounts() {
    return this.githubAccounts;
  }

  addGitHubAccount(account: Omit<GitHubAccount, 'id' | 'created_at'>) {
    const newAccount: GitHubAccount = {
      ...account,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    this.githubAccounts.unshift(newAccount);
    return newAccount;
  }

  updateGitHubAccount(id: string, updates: Partial<GitHubAccount>) {
    const index = this.githubAccounts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.githubAccounts[index] = { ...this.githubAccounts[index], ...updates };
      return this.githubAccounts[index];
    }
    return null;
  }

  deleteGitHubAccount(id: string) {
    this.githubAccounts = this.githubAccounts.filter(a => a.id !== id);
    return true;
  }

  // Tech Stacks
  getTechStacks() {
    return this.techStacks;
  }

  addTechStack(stack: Omit<TechStack, 'id'>) {
    const newStack: TechStack = {
      ...stack,
      id: Date.now().toString(),
    };
    this.techStacks.unshift(newStack);
    return newStack;
  }

  updateTechStack(id: string, updates: Partial<TechStack>) {
    const index = this.techStacks.findIndex(s => s.id === id);
    if (index !== -1) {
      this.techStacks[index] = { ...this.techStacks[index], ...updates };
      return this.techStacks[index];
    }
    return null;
  }

  deleteTechStack(id: string) {
    this.techStacks = this.techStacks.filter(s => s.id !== id);
    return true;
  }

  // Project Tech Stacks
  getProjectTechStacks(projectId: string) {
    return this.projectTechStacks[projectId] || [];
  }

  setProjectTechStacks(projectId: string, techStackIds: string[]) {
    this.projectTechStacks[projectId] = techStackIds;
  }

  // Categories & Roles
  getCategories() {
    return mockCategories;
  }

  getRoles() {
    return mockRoles;
  }

  // Helper methods
  getCategoryName(id?: string) {
    return mockCategories.find(c => c.id === id)?.name || '';
  }

  getRoleName(id?: string) {
    return mockRoles.find(r => r.id === id)?.name || '';
  }

  getTechStacksByIds(ids: string[]) {
    return this.techStacks.filter(s => ids.includes(s.id));
  }

  getProjectsUsingGmail(gmailId: string) {
    return this.projects.filter(p => p.gmail_id === gmailId).length;
  }

  getProjectsUsingGitHub(githubId: string) {
    return this.projects.filter(p => p.github_id === githubId).length;
  }

  getProjectsUsingTechStack(techStackId: string) {
    return Object.entries(this.projectTechStacks)
      .filter(([_, stacks]) => stacks.includes(techStackId))
      .length;
  }
}

// Singleton instance
export const mockStore = new MockStore();
