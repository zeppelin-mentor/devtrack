'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { mockStore } from '@/lib/mockStore';

export default function TechStacksPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingStack, setEditingStack] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const allStacks = mockStore.getTechStacks();
  
  const filteredStacks = categoryFilter
    ? allStacks.filter(s => s.category === categoryFilter)
    : allStacks;

  const categories = Array.from(new Set(allStacks.map(s => s.category)));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const stackData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string || undefined,
    };

    if (editingStack) {
      mockStore.updateTechStack(editingStack.id, stackData);
    } else {
      mockStore.addTechStack(stackData);
    }

    setShowModal(false);
    setEditingStack(null);
    window.location.reload();
  };

  const handleEdit = (stack: any) => {
    setEditingStack(stack);
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      mockStore.deleteTechStack(id);
      window.location.reload();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStack(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tech Stacks</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              + Add Tech Stack
            </button>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tech Stacks Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stack Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects Using</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStacks.length > 0 ? (
                  filteredStacks.map((stack) => {
                    const projectCount = mockStore.getProjectsUsingTechStack(stack.id);
                    return (
                      <tr key={stack.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{stack.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {stack.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                            {projectCount} projects
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(stack)}
                              className="text-orange-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(stack.id, stack.name)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No tech stacks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">
                  {editingStack ? 'Edit Tech Stack' : 'Add Tech Stack'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingStack?.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Next.js"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      required
                      defaultValue={editingStack?.category}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Database</option>
                      <option>DevOps</option>
                      <option>Mobile</option>
                      <option>AI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={editingStack?.description}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                    >
                      {editingStack ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
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
  );
}
