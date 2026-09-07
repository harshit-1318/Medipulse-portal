import React from 'react';
import 'survey-core/survey-core.min.css';
import 'survey-creator-core/survey-creator-core.min.css';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';

export const IsolatedSurveyCreator = React.memo(({ creator }: { creator: SurveyCreator }) => {
    return <SurveyCreatorComponent creator={creator} />;
}, () => true);
