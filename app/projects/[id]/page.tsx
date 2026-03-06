'use client';

import { use } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { mockStore } from '@/lib/mockStore';
import { useRouter } from 'next/navigation';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const project = mockStore.getProject(id);

  if (!project) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Link href="/projects" className="text-indigo-600 hover:underline">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const techStackIds = mockStore.getProjectTechStacks(project.id);
  const techStacks = mockStore.getTechStacksByIds(techStackIds);
  const category = mockStore.getCategoryName(project.category_id);
  const role = mockStore.getRoleName(project.role_id);
  const gmailAccount = project.gmail_id ? mockStore.getGmailAccounts().find(a => a.id === project.gmail_id) : null;
  const githubAccount = project.github_id ? mockStore.getGitHubAccounts().find(a => a.id === project.github_id) : null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="flex gap-2">
              <Link
                href={`/projects/edit/${project.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Edit
              </Link>
              <Link
                href="/projects"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="mt-1 text-gray-900">{category || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="mt-1 text-gray-900">{role || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Project Type</label>
                <p className="mt-1 text-gray-900">{project.project_type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Team Size</label>
                <p className="mt-1 text-gray-900">{project.team_size || 'N/A'}</p>
              </div>
            </div>

            {/* Description */}
            {project.project_description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900">{project.project_description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {project.responsibilities && (
              <div>
                <label className="text-sm font-medium text-gray-500">Responsibilities</label>
                <p className="mt-1 text-gray-900">{project.responsibilities}</p>
              </div>
            )}

            {/* Highlights */}
            {project.project_highlights && (
              <div>
                <label className="text-sm font-medium text-gray-500">Highlights</label>
                <p className="mt-1 text-gray-900">{project.project_highlights}</p>
              </div>
            )}

            {/* Tech Stack */}
            {techStacks.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tech Stack</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {techStacks.map(stack => (
                    <span
                      key={stack.id}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {stack.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="mt-1 text-gray-900">{project.start_date || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="mt-1 text-gray-900">{project.end_date || 'Ongoing'}</p>
              </div>
            </div>

            {/* Links */}
            <div className="grid md:grid-cols-2 gap-6">
              {project.domain && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Domain</label>
                  <p className="mt-1">
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {project.domain}
                    </a>
                  </p>
                </div>
              )}
              {project.repo_url && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Repository</label>
                  <p className="mt-1">
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {project.repo_url}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Hosting & Client */}
            <div className="grid md:grid-cols-2 gap-6">
              {project.hosting && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Hosting</label>
                  <p className="mt-1 text-gray-900">{project.hosting}</p>
                </div>
              )}
              {project.client_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Client</label>
                  <p className="mt-1 text-gray-900">{project.client_name}</p>
                </div>
              )}
            </div>

            {/* Accounts */}
            <div className="grid md:grid-cols-2 gap-6">
              {gmailAccount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Gmail Account</label>
                  <p className="mt-1 text-gray-900">{gmailAccount.email}</p>
                </div>
              )}
              {githubAccount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">GitHub Account</label>
                  <p className="mt-1 text-gray-900">{githubAccount.username}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            {project.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-gray-900">{project.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
