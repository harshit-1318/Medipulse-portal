'use client';

import { use } from 'react';
import SurveyResponsesPage from '@/components/surveys/responses/SurveyResponsesPage';

interface SurveyResponsesRouteProps {
  params: Promise<{ id: string }>;
}

export default function SurveyResponsesRoute({ params }: SurveyResponsesRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <SurveyResponsesPage surveyId={id} />
    </div>
  );
}
