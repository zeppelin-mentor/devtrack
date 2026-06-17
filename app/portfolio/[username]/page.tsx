'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Loader from '@/components/Loader';
import type { PublicPortfolio } from '@/types';

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params.username as string;
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, [username]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`/api/portfolio/${username}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('Portfolio not found or not public');
        } else {
          setError('Failed to load portfolio');
        }
        return;
      }

      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Portfolio not found'}
          </h1>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  const { profile, projects } = portfolio;

  return (
    <>
      <Head>
        <title>{profile.display_name} - Portfolio | DevTrack</title>
        <meta name="description" content={profile.bio || `${profile.display_name}'s project portfolio`} />
        <meta property="og:title" content={`${profile.display_name} - Portfolio`} />
        <meta property="og:description" content={profile.bio || `${profile.display_name}'s project portfolio`} />
        <meta property="og:type" content="profile" />
        {profile.profile_photo_url && (
          <meta property="og:image" content={profile.profile_photo_url} />
        )}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${profile.display_name} - Portfolio`} />
        <meta name="twitter:description" content={profile.bio || `${profile.display_name}'s project portfolio`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <a href="/" className="text-xl font-bold text-gray-900">
              DevTrack
            </a>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-12 text-center">
            {profile.profile_photo_url && (
              <img
                src={profile.profile_photo_url}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {profile.display_name}
            </h1>
            
            {profile.location && (
              <p className="text-gray-600 mb-4">📍 {profile.location}</p>
            )}
            
            {profile.available_for_work && (
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                💼 Available for Work
              </div>
            )}
            
            {profile.bio && (
              <p className="text-gray-700 max-w-2xl mx-auto mb-6 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}
            
            {/* Social Links */}
            <div className="flex justify-center gap-4 flex-wrap">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  LinkedIn
                </a>
              )}
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  Twitter
                </a>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                >
                  Website
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  
                  {(project.category || project.role) && (
                    <div className="flex gap-2 mb-3 text-sm text-gray-600">
                      {project.category && <span>📁 {project.category}</span>}
                      {project.role && <span>• 👤 {project.role}</span>}
                    </div>
                  )}
                  
                  {project.project_description && (
                    <p className="text-gray-700 mb-4">
                      {project.project_description}
                    </p>
                  )}
                  
                  {project.responsibilities && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Responsibilities:
                      </h4>
                      <p className="text-sm text-gray-700">
                        {project.responsibilities}
                      </p>
                    </div>
                  )}
                  
                  {project.project_highlights && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Highlights:
                      </h4>
                      <p className="text-sm text-gray-700">
                        {project.project_highlights}
                      </p>
                    </div>
                  )}
                  
                  {project.tech_stacks && project.tech_stacks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stacks.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {(project.start_date || project.end_date) && (
                      <div>
                        📅{' '}
                        {project.start_date && new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {project.start_date && project.end_date && ' - '}
                        {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </div>
                    )}
                    {project.team_size && (
                      <div>👥 Team Size: {project.team_size}</div>
                    )}
                    {project.client_name && (
                      <div>🏢 Client: {project.client_name}</div>
                    )}
                  </div>
                  
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                    >
                      View Repository
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-5xl mx-auto px-6 py-8 text-center text-gray-600">
            <p className="mb-2">Powered by DevTrack</p>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Create your own portfolio
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
