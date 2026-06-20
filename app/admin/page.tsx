'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { AdminDashboardStats, PlatformAnalytics, Announcement } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'announcements'>('overview');

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', session.user.id)
        .single();

      if (!profile?.is_admin) {
        setError('Access denied: Admin privileges required');
        setLoading(false);
        return;
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats');
      }

      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch announcements
      const announcementsResponse = await fetch('/api/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!announcementsResponse.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const announcementsData = await announcementsResponse.json();
      setAnnouncements(announcementsData);

      setLoading(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin data');
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        alert('Analytics updated successfully!');
        checkAdminAndFetchData();
      }
    } catch (err) {
      console.error('Error refreshing analytics:', err);
      alert('Failed to refresh analytics');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="text-red-600 text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage platform settings and view analytics</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'analytics'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'announcements'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Announcements
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && stats && (
                <OverviewTab stats={stats} onRefresh={checkAdminAndFetchData} />
              )}
              {activeTab === 'analytics' && stats && (
                <AnalyticsTab 
                  analytics={stats.weeklyAnalytics} 
                  onRefresh={refreshAnalytics} 
                />
              )}
              {activeTab === 'announcements' && (
                <AnnouncementsTab 
                  announcements={announcements} 
                  onRefresh={checkAdminAndFetchData} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function OverviewTab({ stats, onRefresh }: { stats: AdminDashboardStats; onRefresh: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Platform Statistics</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon="📁"
          color="green"
        />
        <StatCard
          title="Total Pages"
          value={stats.totalPages}
          icon="📄"
          color="purple"
        />
        <StatCard
          title="Portfolio Projects"
          value={stats.totalPortfolioProjects}
          icon="⭐"
          color="yellow"
        />
      </div>

      {/* Weekly Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Last 7 Days Summary</h3>
        {stats.weeklyAnalytics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.weeklyAnalytics.reduce((sum, day) => sum + (day.new_users || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">New Projects</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.weeklyAnalytics.reduce((sum, day) => sum + (day.new_projects || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">New Pages</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.weeklyAnalytics.reduce((sum, day) => sum + (day.new_pages || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Announcements</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.activeAnnouncements}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No analytics data available</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}

function AnalyticsTab({ analytics, onRefresh }: { analytics: PlatformAnalytics[]; onRefresh: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Analytics Data</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Analytics
        </button>
      </div>

      {analytics.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Pages
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.map((day) => (
                <tr key={day.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.new_users || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.active_users || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.new_projects || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.new_pages || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No analytics data available. Click "Update Analytics" to generate data.</p>
      )}
    </div>
  );
}

function AnnouncementsTab({ announcements, onRefresh }: { announcements: Announcement[]; onRefresh: () => void }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Announcements</h2>
        <button
          onClick={() => router.push('/admin/announcements/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Announcement
        </button>
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No announcements yet. Create your first announcement!</p>
      )}
    </div>
  );
}

function AnnouncementCard({ announcement, onRefresh }: { announcement: Announcement; onRefresh: () => void }) {
  const router = useRouter();

  const typeColors = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  const toggleActive = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !announcement.is_active }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error toggling announcement:', err);
    }
  };

  const deleteAnnouncement = async () => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[announcement.type]}`}>
              {announcement.type.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {announcement.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs text-gray-500">
              Priority: {announcement.priority}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-1">{announcement.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
            {announcement.expires_at && (
              <span>Expires: {new Date(announcement.expires_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={toggleActive}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {announcement.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => router.push(`/admin/announcements/edit/${announcement.id}`)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded"
          >
            Edit
          </button>
          <button
            onClick={deleteAnnouncement}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
