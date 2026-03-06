'use client';

import { use, useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getProject, updateProject, getCategories, getRoles, getTechStacks, getGmailAccounts, getGitHubAccounts, getProjectTechStacks, setProjectTechStacks } from '@/lib/supabase/database';
import type { Project, Category, Role, TechStack, GmailAccount, GitHubAccount } from '@/types';
import { Save, ArrowLeft } from 'lucide-react';
import Loader from '@/components/Loader';
import Link from 'next/link';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [gmailAccounts, setGmailAccounts] = useState<GmailAccount[]>([]);
  const [githubAccounts, setGithubAccounts] = useState<GitHubAccount[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, id]);

  const loadData = async () => {
    try {
      setDataLoading(true);
      const [projectData, categoriesData, rolesData, techStacksData, gmailData, githubData, projectTechStackIds] = await Promise.all([
        getProject(id),
        getCategories(),
        getRoles(),
        getTechStacks(),
        getGmailAccounts(user!.id),
        getGitHubAccounts(user!.id),
        getProjectTechStacks(id),
      ]);

      setProject(projectData);
      setCategories(categoriesData);
      setRoles(rolesData);
      setTechStacks(techStacksData);
      setGmailAccounts(gmailData);
      setGithubAccounts(githubData);
      setSelectedTechStacks(projectTechStackIds);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load project data');
      router.push('/projects');
    } finally {
      setDataLoading(false);
    }
  };

  const toggleTechStack = (id: string) => {
    setSelectedTechStacks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const updates: Partial<Project> = {
        name: formData.get('name') as string,
        project_type: formData.get('project_type') as string || undefined,
        category_id: formData.get('category') as string || undefined,
        role_id: formData.get('role') as string || undefined,
        project_description: formData.get('description') as string || undefined,
        responsibilities: formData.get('responsibilities') as string || undefined,
        project_highlights: formData.get('highlights') as string || undefined,
        start_date: formData.get('start_date') as string || undefined,
        end_date: formData.get('end_date') as string || undefined,
        hosting: formData.get('hosting') as string || undefined,
        repo_url: formData.get('repo_url') as string || undefined,
        domain: formData.get('domain') as string || undefined,
        gmail_id: formData.get('gmail_id') as string || undefined,
        github_id: formData.get('github_id') as string || undefined,
        team_size: formData.get('team_size') ? parseInt(formData.get('team_size') as string) : undefined,
        client_name: formData.get('client_name') as string || undefined,
        notes: formData.get('notes') as string || undefined,
      };

      await updateProject(id, updates);
      await setProjectTechStacks(id, selectedTechStacks);

      router.push('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <div className="flex-1">
            <Loader />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
              <Link href="/projects" className="text-orange-600 hover:underline">
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Edit Project</h1>
              <Link
                href="/projects"
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={project.name}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Type</label>
                    <input
                      type="text"
                      name="project_type"
                      defaultValue={project.project_type || ''}
                      placeholder="e.g., Web App, Mobile App, API"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Size</label>
                    <input
                      type="number"
                      name="team_size"
                      defaultValue={project.team_size || ''}
                      min="1"
                      placeholder="e.g., 5"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      defaultValue={project.category_id || ''}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      name="role"
                      defaultValue={project.role_id || ''}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description & Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Description & Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <textarea
                    name="description"
                    defaultValue={project.project_description || ''}
                    rows={4}
                    placeholder="Brief overview of the project..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Responsibilities</label>
                  <textarea
                    name="responsibilities"
                    defaultValue={project.responsibilities || ''}
                    rows={4}
                    placeholder="Your key responsibilities in this project..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Highlights</label>
                  <textarea
                    name="highlights"
                    defaultValue={project.project_highlights || ''}
                    rows={3}
                    placeholder="Key achievements and highlights..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Tech Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {techStacks.map(stack => (
                    <label
                      key={stack.id}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                        selectedTechStacks.includes(stack.id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTechStacks.includes(stack.id)}
                        onChange={() => toggleTechStack(stack.id)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium">{stack.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Timeline</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      defaultValue={project.start_date || ''}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      defaultValue={project.end_date || ''}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Links & Hosting */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Links & Hosting</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Repository URL</label>
                    <input
                      type="url"
                      name="repo_url"
                      defaultValue={project.repo_url || ''}
                      placeholder="https://github.com/username/repo"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Live Domain</label>
                    <input
                      type="url"
                      name="domain"
                      defaultValue={project.domain || ''}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hosting Platform</label>
                  <input
                    type="text"
                    name="hosting"
                    defaultValue={project.hosting || ''}
                    placeholder="e.g., Vercel, AWS, Heroku"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Accounts */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Associated Accounts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gmail Account</label>
                    <select
                      name="gmail_id"
                      defaultValue={project.gmail_id || ''}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">None</option>
                      {gmailAccounts.map(account => (
                        <option key={account.id} value={account.id}>{account.email}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Account</label>
                    <select
                      name="github_id"
                      defaultValue={project.github_id || ''}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">None</option>
                      {githubAccounts.map(account => (
                        <option key={account.id} value={account.id}>{account.username}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Additional Information</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name</label>
                  <input
                    type="text"
                    name="client_name"
                    defaultValue={project.client_name || ''}
                    placeholder="Client or company name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={project.notes || ''}
                    rows={3}
                    placeholder="Any additional notes..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
