'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loader from '@/components/Loader';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { createPage, createProject, generatePageSlug, getProjects } from '@/lib/supabase/database';
import { pageTemplates } from '@/lib/pageTemplates';
import type { Project } from '@/types';
import { ArrowLeft, FileText, Plus } from 'lucide-react';

export default function CreatePagePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [templateId, setTemplateId] = useState('blank');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [customSlug, setCustomSlug] = useState('');

  const loadProjects = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const projectsData = await getProjects(user.id);
      setProjects(projectsData);
      const requestedProjectId = new URLSearchParams(window.location.search).get('projectId');
      if (requestedProjectId && projectsData.some((project) => project.id === requestedProjectId)) {
        setProjectId(requestedProjectId);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    try {
      const project = await createProject({
        user_id: user!.id,
        name: newProjectName.trim(),
      });
      
      setProjects([project, ...projects]);
      setProjectId(project.id);
      setNewProjectName('');
      setShowNewProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const template = pageTemplates.find((item) => item.id === templateId) || pageTemplates[0];
      
      // Generate slug if auto-generate is enabled
      let slug = customSlug.trim() || null;
      if (autoGenerateSlug && title.trim()) {
        slug = await generatePageSlug(title.trim());
      }
      
      const page = await createPage({
        user_id: user!.id,
        title: title.trim() || 'Untitled',
        content: template.content,
        status: 'draft',
        project_id: projectId || null,
        parent_id: null,
        slug,
        icon: null,
        cover_url: null,
        is_public: false,
        share_token: null,
        last_viewed_at: null,
      });

      router.push(`/pages/${page.id}`);
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page');
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

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">New Page</h1>
                <p className="mt-1 text-slate-600">Start a note, article, or project document.</p>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Project launch notes"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Project</label>
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(true)}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create New
                  </button>
                </div>
                <select
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No linked project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={autoGenerateSlug}
                    onChange={(e) => setAutoGenerateSlug(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  Auto-generate URL slug from title
                </label>
                {!autoGenerateSlug && (
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="custom-url-slug"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
                <p className="mt-1 text-xs text-slate-500">
                  The URL slug helps create a friendly shareable link
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Template</label>
                <div className="grid gap-3 md:grid-cols-2">
                  {pageTemplates.map((template) => (
                    <label
                      key={template.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        templateId === template.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="template"
                        value={template.id}
                        checked={templateId === template.id}
                        onChange={(event) => setTemplateId(event.target.value)}
                        className="sr-only"
                      />
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-indigo-600">
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="font-medium text-slate-900">{template.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Page'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-lg bg-slate-200 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Create New Project</h2>
            <div className="mb-6">
              <label className="mb-1 block text-sm font-medium text-slate-700">Project Name *</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Project"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateProject();
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateProject}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="flex-1 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
