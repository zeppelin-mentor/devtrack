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
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition flex flex-col"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    
                    {(project.category || project.role || project.project_type) && (
                      <div className="flex flex-wrap gap-2 text-sm">
                        {project.project_type && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            {project.project_type}
                          </span>
                        )}
                        {project.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                            📁 {project.category}
                          </span>
                        )}
                        {project.role && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                            👤 {project.role}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {project.project_description && (
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {project.project_description}
                      </p>
                    </div>
                  )}
                  
                  {project.project_highlights && (
                    <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <h4 className="text-xs font-semibold text-yellow-900 mb-1 uppercase tracking-wide">
                        ✨ Highlights
                      </h4>
                      <p className="text-sm text-yellow-900">
                        {project.project_highlights}
                      </p>
                    </div>
                  )}
                  
                  {project.responsibilities && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-900 mb-1 uppercase tracking-wide">
                        Responsibilities
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {project.responsibilities}
                      </p>
                    </div>
                  )}
                  
                  {project.tech_stacks && project.tech_stacks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stacks.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {((project.start_date || project.end_date) || project.team_size || project.client_name) && (
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
                      {(project.start_date || project.end_date) && (
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>
                            {project.start_date && new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            {project.start_date && project.end_date && ' - '}
                            {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : (project.start_date ? 'Present' : '')}
                          </span>
                        </div>
                      )}
                      {project.team_size && (
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span>{project.team_size} {project.team_size === 1 ? 'person' : 'people'}</span>
                        </div>
                      )}
                      {project.client_name && (
                        <div className="flex items-center gap-1">
                          <span>🏢</span>
                          <span>{project.client_name}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {project.repo_url && (
                    <div className="mt-auto">
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View Repository
                      </a>
                    </div>
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
