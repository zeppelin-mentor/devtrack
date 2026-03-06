'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { mockStore } from '@/lib/mockStore';

export default function GmailAccountsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const accounts = mockStore.getGmailAccounts();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const accountData = {
      user_id: 'user1',
      email: formData.get('email') as string,
      recovery_email: formData.get('recovery_email') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    if (editingAccount) {
      mockStore.updateGmailAccount(editingAccount.id, accountData);
    } else {
      mockStore.addGmailAccount(accountData);
    }

    setShowModal(false);
    setEditingAccount(null);
    window.location.reload();
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDelete = (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete "${email}"?`)) {
      mockStore.deleteGmailAccount(id);
      window.location.reload();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gmail Accounts</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              + Add Gmail Account
            </button>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recovery Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects Using</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.length > 0 ? (
                  accounts.map((account) => {
                    const projectCount = mockStore.getProjectsUsingGmail(account.id);
                    return (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{account.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{account.recovery_email || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {projectCount} projects
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(account)}
                              className="text-green-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(account.id, account.email)}
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
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">
                  {editingAccount ? 'Edit Gmail Account' : 'Add Gmail Account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      defaultValue={editingAccount?.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="dev@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recovery Email
                    </label>
                    <input
                      type="email"
                      name="recovery_email"
                      defaultValue={editingAccount?.recovery_email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="backup@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      defaultValue={editingAccount?.notes}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      {editingAccount ? 'Update' : 'Add'} Account
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
