'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Projects', href: '/projects', icon: '📁' },
  { name: 'Gmail Accounts', href: '/gmail-accounts', icon: '📧' },
  { name: 'GitHub Accounts', href: '/github-accounts', icon: '🐙' },
  { name: 'Tech Stacks', href: '/tech-stacks', icon: '⚙️' },
  { name: 'Export', href: '/export', icon: '📤' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">DevTrack</h1>
        <p className="text-gray-400 text-sm">Project Manager</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
          Logout
        </button>
      </div>
    </div>
  );
}
