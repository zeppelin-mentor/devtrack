'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loader from '@/components/Loader';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { deletePage, getPages, getProjects } from '@/lib/supabase/database';
import type { Page, Project } from '@/types';
import { Edit, FileText, Plus, Search, Trash2, Globe, Lock } from 'lucide-react';

export default function PagesPage() {
  const { user } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const [pagesData, projectsData] = await Promise.all([
        getPages(user.id),
        getProjects(user.id),
      ]);

      setPages(pagesData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredPages = pages.filter((page) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      page.title.toLowerCase().includes(query) ||
      page.content.toLowerCase().includes(query);
    const matchesProject = !projectFilter || page.project_id === projectFilter;
    const matchesStatus = !statusFilter || page.status === statusFilter;

    return matchesSearch && matchesProject && matchesStatus;
  });

  const getProjectName = (projectId?: string | null) => {
    return projects.find((project) => project.id === projectId)?.name || 'No project';
  };

  const handleDelete = async (page: Page) => {
    if (!confirm(`Delete "${page.title}"?`)) {
      return;
    }

    try {
      await deletePage(page.id);
      setPages((currentPages) => currentPages.filter((item) => item.id !== page.id));
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  if (loading) {
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
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Pages</h1>
                <p className="mt-1 text-slate-600">Write project docs, notes, and portfolio-ready articles.</p>
              </div>
              <Link
                href="/pages/create"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow"
              >
                <Plus className="h-4 w-4" />
                New Page
              </Link>
            </div>

            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div className="relative min-w-64 flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={projectFilter}
                  onChange={(event) => setProjectFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Page</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Updated</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPages.length > 0 ? (
                    filteredPages.map((page) => (
                      <tr key={page.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              {page.icon || <FileText className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <Link href={`/pages/${page.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                                  {page.title}
                                </Link>
                                {page.is_public && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700" title="Public page">
                                    <Globe className="h-3 w-3" />
                                    Public
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 line-clamp-1 max-w-xl text-sm text-slate-500">
                                {page.content || 'Empty page'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{getProjectName(page.project_id)}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium capitalize text-indigo-700">
                            {page.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(page.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/pages/${page.id}`}
                              className="rounded-lg p-2 text-orange-600 transition-colors hover:bg-orange-50"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(page)}
                              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No pages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
