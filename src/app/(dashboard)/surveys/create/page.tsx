'use client';

import dynamic from 'next/dynamic';

const SurveyBuilderPage = dynamic(
  () => import('@/components/surveys/builder/SurveyBuilderPage'),
  { ssr: false }
);

export default function CreateSurveyRoute() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)]">
      <SurveyBuilderPage surveyId={null} />
    </div>
  );
}
