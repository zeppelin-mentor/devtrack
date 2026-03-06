'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getTechStacks, createTechStack, updateTechStack, deleteTechStack, getProjectsUsingTechStack } from '@/lib/supabase/database';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import type { TechStack } from '@/types';

export default function TechStacksPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [allStacks, setAllStacks] = useState<TechStack[]>([]);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const stacksData = await getTechStacks();
      setAllStacks(stacksData);

      const counts: Record<string, number> = {};
      for (const stack of stacksData) {
        counts[stack.id] = await getProjectsUsingTechStack(stack.id, user!.id);
      }
      setProjectCounts(counts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStacks = categoryFilter
    ? allStacks.filter(s => s.category === categoryFilter)
    : allStacks;

  const categories = Array.from(new Set(allStacks.map(s => s.category)));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const stackData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string || undefined,
    };

    try {
      if (editingStack) {
        await updateTechStack(editingStack.id, stackData);
      } else {
        await createTechStack(stackData);
      }
      await loadData();
      setShowModal(false);
      setEditingStack(null);
    } catch (error) {
      console.error('Error saving tech stack:', error);
      alert('Failed to save tech stack');
    }
  };

  const handleEdit = (stack: TechStack) => {
    setEditingStack(stack);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteTechStack(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting tech stack:', error);
        alert('Failed to delete tech stack');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStack(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading...</p>
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
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Tech Stacks</h1>
                <p className="text-slate-600 mt-1">Manage your technology stack</p>
              </div>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-sm hover:shadow font-medium">
                <Plus className="w-4 h-4" />
                Add Tech Stack
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all">
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stack Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Projects Using</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStacks.length > 0 ? (
                    filteredStacks.map((stack) => (
                      <tr key={stack.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{stack.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {stack.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {projectCounts[stack.id] || 0} projects
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(stack)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(stack.id, stack.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No tech stacks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                  <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {editingStack ? 'Edit Tech Stack' : 'Add Tech Stack'}
                    </h2>
                    <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                      <input type="text" name="name" required defaultValue={editingStack?.name} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all" placeholder="Next.js" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                      <select name="category" required defaultValue={editingStack?.category} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all">
                        <option value="">Select Category</option>
                        <option>Frontend</option>
                        <option>Backend</option>
                        <option>Database</option>
                        <option>DevOps</option>
                        <option>Mobile</option>
                        <option>AI</option>
                        <option>Language</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <textarea name="description" rows={2} defaultValue={editingStack?.description} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all" placeholder="Brief description..." />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium">
                        {editingStack ? 'Update' : 'Add'}
                      </button>
                      <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
