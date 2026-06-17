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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-slate-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header with Glass Effect */}
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              DevTrack
            </a>
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl"
            >
              Create Your Portfolio
            </a>
          </div>
        </div>

        {/* Profile Section with Glass Morphism */}
        <div className="relative">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 p-12 text-center relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>
              
              <div className="relative z-10">
                {profile.profile_photo_url && (
                  <div className="relative inline-block mb-6">
                    <img
                      src={profile.profile_photo_url}
                      alt={profile.display_name}
                      className="w-40 h-40 rounded-full mx-auto object-cover ring-4 ring-white shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-orange-500/20"></div>
                  </div>
                )}
                
                <h1 className="text-5xl font-bold text-slate-900 mb-3">
                  {profile.display_name}
                </h1>
                
                {profile.location && (
                  <p className="text-gray-600 mb-4 flex items-center justify-center gap-2">
                    <span className="text-xl">📍</span>
                    <span className="text-lg">{profile.location}</span>
                  </p>
                )}
                
                {profile.available_for_work && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span>Available for Work</span>
                  </div>
                )}
                
                {profile.bio && (
                  <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-8 leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                )}
                
                {/* Social Links with Gradient Buttons */}
                <div className="flex justify-center gap-4 flex-wrap">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </span>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </span>
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </span>
                    </a>
                  )}
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Website
                      </span>
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="group px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-medium border border-gray-300"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="relative max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
              Featured Projects
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Explore my recent work and contributions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-orange-500/0 group-hover:from-indigo-500/5 group-hover:to-orange-500/5 transition-all duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                        {project.name}
                      </h3>
                      
                      {(project.category || project.role || project.project_type) && (
                        <div className="flex flex-wrap gap-2 text-sm">
                          {project.project_type && (
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-lg text-xs font-semibold shadow-sm">
                              {project.project_type}
                            </span>
                          )}
                          {project.category && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-lg text-xs font-semibold shadow-sm">
                              📁 {project.category}
                            </span>
                          )}
                          {project.role && (
                            <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-lg text-xs font-semibold shadow-sm">
                              👤 {project.role}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {project.project_description && (
                      <div className="mb-4">
                        <p className="text-gray-700 text-base leading-relaxed">
                          {project.project_description}
                        </p>
                      </div>
                    )}
                    
                    {project.project_highlights && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600 text-lg flex-shrink-0">✨</span>
                          <div>
                            <h4 className="text-xs font-bold text-yellow-900 mb-1 uppercase tracking-wider">
                              Highlights
                            </h4>
                            <p className="text-sm text-yellow-900 leading-relaxed">
                              {project.project_highlights}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {project.responsibilities && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                        <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-2">
                          <span>📋</span> Responsibilities
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {project.responsibilities}
                        </p>
                      </div>
                    )}
                    
                    {project.tech_stacks && project.tech_stacks.length > 0 && (
                      <div className="mb-5">
                        <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stacks.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {((project.start_date || project.end_date) || project.team_size || project.client_name) && (
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-5 pb-5 border-b border-gray-200">
                        {(project.start_date || project.end_date) && (
                          <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-lg">
                            <span className="text-base">📅</span>
                            <span className="font-medium">
                              {project.start_date && new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {project.start_date && project.end_date && ' - '}
                              {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : (project.start_date ? 'Present' : '')}
                            </span>
                          </div>
                        )}
                        {project.team_size && (
                          <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-lg">
                            <span className="text-base">👥</span>
                            <span className="font-medium">{project.team_size} {project.team_size === 1 ? 'person' : 'people'}</span>
                          </div>
                        )}
                        {project.client_name && (
                          <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-lg">
                            <span className="text-base">🏢</span>
                            <span className="font-medium">{project.client_name}</span>
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
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View Repository
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer with Glass Effect */}
        <div className="relative backdrop-blur-md bg-white/70 border-t border-white/20 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-10 text-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-indigo-600 mb-2">
                DevTrack
              </h3>
              <p className="text-gray-600">
                Build and showcase your professional portfolio
              </p>
            </div>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 font-medium"
            >
              Create Your Own Portfolio
            </a>
            <p className="text-gray-500 text-sm mt-6">
              © 2026 DevTrack. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
