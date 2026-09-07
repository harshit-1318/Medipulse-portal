'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

const PublicSurveyPage = dynamic(
  () => import('@/components/surveys/public/PublicSurveyPage'),
  { ssr: false }
);

interface PublicSurveyRouteProps {
  params: Promise<{ token: string }>;
}

export default function PublicSurveyRoute({ params }: PublicSurveyRouteProps) {
  const { token } = use(params);

  return (
    <main className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center py-6 px-4">
      <div className="w-full max-w-4xl">
        <PublicSurveyPage token={token ?? ''} />
      </div>
    </main>
  );
}
