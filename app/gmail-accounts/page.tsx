'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getGmailAccounts, createGmailAccount, updateGmailAccount, deleteGmailAccount, getProjectsUsingGmail } from '@/lib/supabase/database';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import type { GmailAccount } from '@/types';

export default function GmailAccountsPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<GmailAccount | null>(null);
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const accountsData = await getGmailAccounts(user!.id);
      setAccounts(accountsData);

      const counts: Record<string, number> = {};
      for (const account of accountsData) {
        counts[account.id] = await getProjectsUsingGmail(account.id, user!.id);
      }
      setProjectCounts(counts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const accountData = {
      user_id: user!.id,
      email: formData.get('email') as string,
      recovery_email: formData.get('recovery_email') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    try {
      if (editingAccount) {
        await updateGmailAccount(editingAccount.id, accountData);
      } else {
        await createGmailAccount(accountData);
      }
      await loadData();
      setShowModal(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account');
    }
  };

  const handleEdit = (account: GmailAccount) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete "${email}"?`)) {
      try {
        await deleteGmailAccount(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
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
                <h1 className="text-3xl font-bold text-slate-900">Gmail Accounts</h1>
                <p className="text-slate-600 mt-1">Manage your Gmail accounts</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Gmail Account
              </button>
            </div>

            {/* Accounts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Recovery Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Projects Using</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{account.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{account.recovery_email || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {projectCounts[account.id] || 0} projects
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(account)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(account.id, account.email)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No Gmail accounts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add/Edit Account Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                  <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {editingAccount ? 'Edit Gmail Account' : 'Add Gmail Account'}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        defaultValue={editingAccount?.email}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        placeholder="dev@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Recovery Email
                      </label>
                      <input
                        type="email"
                        name="recovery_email"
                        defaultValue={editingAccount?.recovery_email}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        placeholder="backup@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        defaultValue={editingAccount?.notes}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        placeholder="Additional notes..."
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                      >
                        {editingAccount ? 'Update' : 'Add'} Account
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium"
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
    </ProtectedRoute>
  );
}
