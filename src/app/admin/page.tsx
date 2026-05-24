'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/check')
      .then(r => r.json())
      .then(d => {
        router.push(d.authenticated ? '/admin/dashboard' : '/admin/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );
}
