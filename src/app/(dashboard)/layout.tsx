'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar, Header } from '@/components/layout';
import IdleSessionManager from '@/components/auth/IdleSessionManager';
import { initializeSite } from '@/store';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize site domain headers and favicon on app mount
    initializeSite();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Session Inactivity Timeout Guard */}
      <IdleSessionManager />

      {/* Persistent App Sidebar */}
      <Sidebar initialPath={pathname ?? '/dashboard'} />

      {/* Main App Content Area */}
      <main className="relative z-0 flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Sticky Dashboard Header */}
        <Header />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative w-full px-4 py-2 md:px-6 md:py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
