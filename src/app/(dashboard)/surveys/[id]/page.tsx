'use client';

import { use } from 'react';
import SurveyViewPage from '@/components/surveys/view/SurveyViewPage';

interface SurveyDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default function SurveyDetailRoute({ params }: SurveyDetailRouteProps) {
  const { id } = use(params);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <SurveyViewPage surveyId={id} />
    </div>
  );
}
