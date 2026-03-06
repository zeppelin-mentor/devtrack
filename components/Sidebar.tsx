'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Mail, Github, Layers, Download, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/supabase/AuthProvider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Gmail Accounts', href: '/gmail-accounts', icon: Mail },
  { name: 'GitHub Accounts', href: '/github-accounts', icon: Github },
  { name: 'Tech Stacks', href: '/tech-stacks', icon: Layers },
  { name: 'Export', href: '/export', icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Image
          src="/horizantal-logo-devtrack.png"
          alt="DevTrack"
          width={150}
          height={40}
          className="h-8 w-auto brightness-0 invert"
        />
        <p className="text-slate-400 text-sm mt-2">Project Manager</p>
      </div>

      {/* User Profile Section */}
      <Link href="/profile" className="p-4 border-b border-slate-800 hover:bg-slate-800 transition-all">
        <div className="flex items-center gap-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold border-2 border-orange-500">
              {user?.email?.[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-slate-400 truncate">View Profile</p>
          </div>
        </div>
      </Link>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/profile"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            pathname === '/profile'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </Link>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
