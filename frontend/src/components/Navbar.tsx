'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/store/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    // Call API (optional cleanup) then local logout
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-indigo-600">
          <BookOpen className="h-6 w-6" />
          <span>LMS Platform</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/courses" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${pathname === '/courses' ? 'text-indigo-600' : 'text-slate-600'}`}>
            Catalog
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600'}`}>
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
