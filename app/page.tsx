import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            DevTrack
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Developer Project & Experience Manager
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Track your projects, accounts, tech stacks, and export professional experience for resumes and portfolios.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            >
              Sign Up
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
              <p className="text-gray-600">
                Manage all your projects with detailed information and tech stacks
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Account Management</h3>
              <p className="text-gray-600">
                Track Gmail and GitHub accounts used across projects
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Export Experience</h3>
              <p className="text-gray-600">
                Generate CSV exports for resumes and job applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
