'use client';

import { useState, useEffect } from 'react';
import { LoginForm, ThemeToggle } from '@/components/auth/login';
import Logo from '@/components/common/Logo';

export default function LoginPage() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('medipulse-theme');
    const dark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(dark);
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('medipulse-theme', nextTheme ? 'dark' : 'light');
    if (typeof document !== 'undefined') {
      if (nextTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <main className={`min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none transition-colors duration-500 ${
      isDark 
        ? 'bg-[#060a12] text-slate-100' 
        : 'bg-linear-to-b from-slate-50 via-teal-50/20 to-slate-100 text-slate-800'
    }`}>
      {/* Top Bar with Brand Pill / Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        {mounted && <ThemeToggle isDark={isDark} onToggle={toggleTheme} />}
      </div>

      {/* Dynamic Ambient Background Elements */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full blur-3xl pointer-events-none animate-pulse [animation-duration:8000ms] transition-all duration-700 ${
        isDark ? 'bg-linear-to-br from-cyan-500/18 to-blue-600/18' : 'bg-linear-to-br from-teal-400/18 to-sky-400/18'
      }`} />
      <div className={`absolute -bottom-20 -left-20 w-105 h-105 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isDark ? 'bg-blue-600/10' : 'bg-sky-300/15'
      }`} />
      <div className={`absolute -top-20 -right-20 w-105 h-105 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isDark ? 'bg-cyan-500/12' : 'bg-teal-300/15'
      }`} />
      
      {/* Background Subtle Grid Pattern */}
      <div className={`absolute inset-0 bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#33415518_1px,transparent_1px),linear-gradient(to_bottom,#33415518_1px,transparent_1px)]'
          : 'bg-[linear-gradient(to_right,#cbd5e135_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e135_1px,transparent_1px)]'
      }`} />

      <div className="z-10 w-full max-w-105 flex flex-col items-center gap-5 my-auto">
        {/* Brand Identity */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-center py-1">
            <Logo size={210} isDark={isDark} />
          </div>
        </div>

        {/* Login Form Card */}
        <div className="w-full">
          <LoginForm isDark={isDark} />
        </div>

        {/* Minimal Clean Footer */}
        <div className="pt-1 text-center select-none transition-colors duration-300">
          <p className={`text-xs font-medium ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`}>
            © {new Date().getFullYear()} MediPulse. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}


