'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/responses', label: 'Responses', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  useEffect(() => {
    if (pathname === '/mushy') {
      setAuthenticated(false);
      return;
    }
    fetch('/api/admin/check')
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) {
          router.push('/mushy');
        } else {
          setAuthenticated(true);
        }
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/mushy');
  };

  if (pathname === '/mushy') {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-black/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                THE GRID
              </h1>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/50 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-medium text-white/60">
              {navItems.find((i) => i.href === pathname)?.label || 'Admin'}
            </h2>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
