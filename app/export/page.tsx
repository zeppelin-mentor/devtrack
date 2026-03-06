'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getProjects, getCategories, getRoles, getProjectTechStacks, getTechStacks } from '@/lib/supabase/database';
import type { Project, Category, Role, TechStack } from '@/types';
import { Download } from 'lucide-react';
import Loader from '@/components/Loader';

export default function ExportPage() {
  const { user } = useAuth();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [projectTechStacks, setProjectTechStacks] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, categoriesData, rolesData, techStacksData] = await Promise.all([
        getProjects(user!.id),
        getCategories(),
        getRoles(),
        getTechStacks(),
      ]);
      
      setAllProjects(projectsData);
      setCategories(categoriesData);
      setRoles(rolesData);
      setTechStacks(techStacksData);

      // Load tech stacks for all projects
      const techStackMap: Record<string, string[]> = {};
      await Promise.all(
        projectsData.map(async (project) => {
          const stackIds = await getProjectTechStacks(project.id);
          techStackMap[project.id] = stackIds;
        })
      );
      setProjectTechStacks(techStackMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects
  const filteredProjects = allProjects.filter(project => {
    const matchesCategory = !categoryFilter || project.category_id === categoryFilter;
    const matchesRole = !roleFilter || project.role_id === roleFilter;
    return matchesCategory && matchesRole;
  });

  const toggleProject = (id: string) => {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedProjects(filteredProjects.map(p => p.id));
  };

  const clearAll = () => {
    setSelectedProjects([]);
  };

  const handleExport = () => {
    const projectsToExport = allProjects.filter(p => selectedProjects.includes(p.id));
    
    if (projectsToExport.length === 0) {
      alert('Please select at least one project to export');
      return;
    }

    // Generate CSV
    const headers = [
      'Project Name',
      'Role',
      'Category',
      'Description',
      'Responsibilities',
      'Tech Stack',
      'Start Date',
      'End Date',
      'Repository',
      'Domain',
      'Hosting',
      'Client',
      'Team Size',
    ];

    const rows = projectsToExport.map(project => {
      const stackIds = projectTechStacks[project.id] || [];
      const projectStacks = techStacks.filter(ts => stackIds.includes(ts.id));
      const techStackNames = projectStacks.map(t => t.name).join(', ');

      const role = roles.find(r => r.id === project.role_id);
      const category = categories.find(c => c.id === project.category_id);

      return [
        project.name,
        role?.name || '',
        category?.name || '',
        project.project_description || '',
        project.responsibilities || '',
        techStackNames,
        project.start_date || '',
        project.end_date || '',
        project.repo_url || '',
        project.domain || '',
        project.hosting || '',
        project.client_name || '',
        project.team_size?.toString() || '',
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `devtrack-projects-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-50">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Export Experience</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Projects Selection */}
            <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Projects</h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={clearAll}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => {
                    const stackIds = projectTechStacks[project.id] || [];
                    const projectStacks = techStacks.filter(ts => stackIds.includes(ts.id));
                    const techStackNames = projectStacks.slice(0, 3).map(t => t.name).join(', ');
                    const role = roles.find(r => r.id === project.role_id);
                    const category = categories.find(c => c.id === project.category_id);

                    return (
                      <label
                        key={project.id}
                        className="flex items-start p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => toggleProject(project.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-sm text-gray-600">
                            {role?.name || 'N/A'} • {category?.name || 'N/A'}
                          </div>
                          {techStackNames && (
                            <div className="text-xs text-gray-500 mt-1">
                              {techStackNames}{projectStacks.length > 3 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-8">No projects match the filters</p>
                )}
              </div>
            </div>

            {/* Filters & Export */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">All Roles</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Export</h2>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Selected: <span className="font-semibold">{selectedProjects.length}</span> projects</p>
                    <p>Format: CSV</p>
                  </div>
                  <button
                    onClick={handleExport}
                    disabled={selectedProjects.length === 0}
                    className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV ({selectedProjects.length})
                  </button>
                  <p className="text-xs text-gray-500">
                    CSV file will include project details, tech stacks, and dates for resume building.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
