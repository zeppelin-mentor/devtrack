'use client';

import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { mockStore } from '@/lib/mockStore';

export default function DashboardPage() {
  const projects = mockStore.getProjects();
  const gmailAccounts = mockStore.getGmailAccounts();
  const githubAccounts = mockStore.getGitHubAccounts();
  const techStacks = mockStore.getTechStacks();

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: '📁', color: 'bg-blue-500' },
    { label: 'Gmail Accounts', value: gmailAccounts.length, icon: '📧', color: 'bg-green-500' },
    { label: 'GitHub Accounts', value: githubAccounts.length, icon: '🐙', color: 'bg-purple-500' },
    { label: 'Tech Stacks', value: techStacks.length, icon: '⚙️', color: 'bg-orange-500' },
  ];

  const recentProjects = projects.slice(0, 3).map(p => ({
    id: p.id,
    name: p.name,
    role: mockStore.getRoleName(p.role_id),
    category: mockStore.getCategoryName(p.category_id),
  }));

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/projects/create"
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center"
              >
                + Add Project
              </Link>
              <Link
                href="/gmail-accounts"
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
              >
                + Add Gmail
              </Link>
              <Link
                href="/github-accounts"
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
              >
                + Add GitHub
              </Link>
              <Link
                href="/export"
                className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-center"
              >
                Export Data
              </Link>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
            <div className="space-y-3">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.role}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {project.category}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No projects yet</p>
              )}
            </div>
            <Link
              href="/projects"
              className="block text-center mt-4 text-indigo-600 hover:underline"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
