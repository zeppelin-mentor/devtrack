import Link from 'next/link';
import { FolderKanban, Link2, FileDown, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              DevTrack
            </h1>
            <p className="text-2xl text-slate-700 mb-4 font-medium">
              Developer Project & Experience Manager
            </p>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
              Track your projects, accounts, tech stacks, and export professional experience for resumes and portfolios.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FolderKanban className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Project Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Manage all your projects with detailed information and tech stacks
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Link2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Account Management</h3>
              <p className="text-slate-600 leading-relaxed">
                Track Gmail and GitHub accounts used across projects
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <FileDown className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Export Experience</h3>
              <p className="text-slate-600 leading-relaxed">
                Generate CSV exports for resumes and job applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
