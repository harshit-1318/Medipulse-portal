'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

const SurveyBuilderPage = dynamic(
  () => import('@/components/surveys/builder/SurveyBuilderPage'),
  { ssr: false }
);

interface EditSurveyRouteProps {
  params: Promise<{ id: string }>;
}

export default function EditSurveyRoute({ params }: EditSurveyRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)]">
      <SurveyBuilderPage surveyId={id} />
    </div>
  );
}
