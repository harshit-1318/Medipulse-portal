'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SurveysErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Surveys Module Error:', error);
  }, [error]);

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
          <p className="text-sm text-slate-500 mt-1">
            {error?.message || 'An error occurred while loading this survey view.'}
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
