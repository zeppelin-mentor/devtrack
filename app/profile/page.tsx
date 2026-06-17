'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/AuthProvider';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';
import type { UserProfile, PortfolioProjectWithDetails, Project } from '@/types';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProjectWithDetails[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    location: '',
    profile_photo_url: '',
    is_public: false,
    available_for_work: false,
    show_email: false,
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    show_github: true,
    show_linkedin: true,
    show_twitter: true,
    show_website: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const token = (await (user as any)?.getIdToken()) || '';

      // Load profile
      const profileRes = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();

      if (profileData.profile) {
        setProfile(profileData.profile);
        setFormData({
          username: profileData.profile.username,
          display_name: profileData.profile.display_name,
          bio: profileData.profile.bio || '',
          location: profileData.profile.location || '',
          profile_photo_url: profileData.profile.profile_photo_url || '',
          is_public: profileData.profile.is_public,
          available_for_work: profileData.profile.available_for_work,
          show_email: profileData.profile.show_email,
          github_url: profileData.profile.github_url || '',
          linkedin_url: profileData.profile.linkedin_url || '',
          twitter_url: profileData.profile.twitter_url || '',
          website_url: profileData.profile.website_url || '',
          show_github: profileData.profile.show_github,
          show_linkedin: profileData.profile.show_linkedin,
          show_twitter: profileData.profile.show_twitter,
          show_website: profileData.profile.show_website,
        });
      }

      // Load portfolio projects
      const portfolioRes = await fetch('/api/portfolio/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const portfolioData = await portfolioRes.json();
      if (portfolioData.projects) {
        setPortfolioProjects(portfolioData.projects);
      }

      // Load all projects
      const projectsRes = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: 'tools/call',
          params: {
            name: 'list_projects',
            arguments: { status: 'all' },
          },
        }),
      });
      const projectsData = await projectsRes.json();
      if (projectsData.content?.[0]?.text) {
        const parsed = JSON.parse(projectsData.content[0].text);
        setAllProjects(parsed.projects || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = (await (user as any)?.getIdToken()) || '';

      const method = profile ? 'PUT' : 'POST';
      const res = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      setProfile(data.profile);
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProjectToPortfolio = async (projectId: string) => {
    try {
      const token = (await (user as any)?.getIdToken()) || '';

      const res = await fetch('/api/portfolio/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: projectId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add project');
      }

      await loadData();
      setSuccess('Project added to portfolio!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    }
  };

  const handleRemoveProjectFromPortfolio = async (portfolioProjectId: string) => {
    try {
      const token = (await (user as any)?.getIdToken()) || '';

      const res = await fetch(`/api/portfolio/projects/${portfolioProjectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove project');
      }

      await loadData();
      setSuccess('Project removed from portfolio!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove project');
    }
  };

  const copyPortfolioLink = () => {
    if (profile) {
      const url = `${window.location.origin}/portfolio/${profile.username}`;
      navigator.clipboard.writeText(url);
      setSuccess('Portfolio link copied!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  const portfolioProjectIds = new Set(portfolioProjects.map(pp => pp.project_id));
  const availableProjects = allProjects.filter(p => !portfolioProjectIds.has(p.id));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            {profile && (
              <a
                href={`/portfolio/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Preview Portfolio
              </a>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="john-doe"
                  pattern="[a-z0-9_-]{3,30}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-30 characters, lowercase letters, numbers, hyphens, and underscores only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/1000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Visibility Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Make portfolio public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available_for_work}
                  onChange={(e) => setFormData({ ...formData, available_for_work: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Available for work</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.show_email}
                  onChange={(e) => setFormData({ ...formData, show_email: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Show email address</span>
              </label>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-4">
              {[
                { key: 'github_url', label: 'GitHub', show: 'show_github' },
                { key: 'linkedin_url', label: 'LinkedIn', show: 'show_linkedin' },
                { key: 'twitter_url', label: 'Twitter', show: 'show_twitter' },
                { key: 'website_url', label: 'Website', show: 'show_website' },
              ].map(({ key, label, show }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="url"
                      value={formData[key as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`https://${label.toLowerCase()}.com/...`}
                    />
                  </div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={formData[show as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({ ...formData, [show]: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Projects */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio Projects</h2>
            
            {portfolioProjects.length > 0 && (
              <div className="space-y-2 mb-4">
                {portfolioProjects.map((pp) => (
                  <div
                    key={pp.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{pp.project.name}</span>
                    <button
                      onClick={() => handleRemoveProjectFromPortfolio(pp.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {availableProjects.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Available Projects</h3>
                <div className="space-y-2">
                  {availableProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <span>{project.name}</span>
                      <button
                        onClick={() => handleAddProjectToPortfolio(project.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio URL */}
          {profile && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio URL</h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={`${window.location.origin}/portfolio/${profile.username}`}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={copyPortfolioLink}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* Analytics */}
          {profile && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Total Views:</span> {profile.view_count}
                </p>
                {profile.last_viewed_at && (
                  <p className="text-gray-700">
                    <span className="font-medium">Last Viewed:</span>{' '}
                    {new Date(profile.last_viewed_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
