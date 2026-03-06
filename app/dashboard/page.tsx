'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getProjects, getGmailAccounts, getGitHubAccounts, getTechStacks, getCategories, getRoles } from '@/lib/supabase/database';
import { FolderKanban, Mail, Github, Layers, Plus, ArrowRight } from 'lucide-react';
import type { Project, Category, Role } from '@/types';

import Loader from '@/components/Loader';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [gmailCount, setGmailCount] = useState(0);
  const [githubCount, setGithubCount] = useState(0);
  const [techStackCount, setTechStackCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [projectsData, gmailData, githubData, techStacksData, categoriesData, rolesData] = await Promise.all([
        getProjects(user!.id),
        getGmailAccounts(user!.id),
        getGitHubAccounts(user!.id),
        getTechStacks(),
        getCategories(),
        getRoles(),
      ]);

      setProjects(projectsData);
      setGmailCount(gmailData.length);
      setGithubCount(githubData.length);
      setTechStackCount(techStacksData.length);
      setCategories(categoriesData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id?: string) => {
    return categories.find(c => c.id === id)?.name || '';
  };

  const getRoleName = (id?: string) => {
    return roles.find(r => r.id === id)?.name || '';
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Gmail Accounts', value: gmailCount, icon: Mail, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'GitHub Accounts', value: githubCount, icon: Github, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Tech Stacks', value: techStackCount, icon: Layers, color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  const recentProjects = projects.slice(0, 3).map(p => ({
    id: p.id,
    name: p.name,
    role: getRoleName(p.role_id),
    category: getCategoryName(p.category_id),
  }));

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
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's your project overview.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2 text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.lightColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-slate-900">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/projects/create"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </Link>
                <Link
                  href="/gmail-accounts"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Gmail
                </Link>
                <Link
                  href="/github-accounts"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add GitHub
                </Link>
                <Link
                  href="/export"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-sm hover:shadow font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  Export Data
                </Link>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-900">Recent Projects</h2>
              <div className="space-y-3">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">{project.name}</h3>
                        <p className="text-sm text-slate-600">{project.role}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">No projects yet</p>
                )}
              </div>
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
