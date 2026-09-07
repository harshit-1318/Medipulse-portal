import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.min.css';
import {
    LoadingScreen,
    CompletedScreen,
    AlreadySubmittedScreen,
    ExpiredScreen,
    ErrorScreen,
} from './PublicSurveyScreens';
import { usePublicSurveySession } from './usePublicSurveySession';

interface PublicSurveyPageProps {
    token: string;
}

export default function PublicSurveyPage({ token }: PublicSurveyPageProps) {
    const {
        pageState,
        sessionData,
        saveNotice,
        surveyModel,
        handleManualSave,
    } = usePublicSurveySession(token);

    if (pageState === 'loading') return <LoadingScreen />;
    if (pageState === 'completed') return <CompletedScreen />;
    if (pageState === 'already_submitted') return <AlreadySubmittedScreen />;
    if (pageState === 'expired') return <ExpiredScreen />;
    if (pageState === 'error') return <ErrorScreen />;

    return (
        <div className="min-h-screen bg-slate-50">
            {sessionData && (
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">{sessionData.surveyTitle}</h1>
                    <button
                        onClick={handleManualSave}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                    >
                        Save & Continue Later
                    </button>
                </div>
            )}

            {saveNotice && (
                <div className="text-center py-2 text-sm text-teal-700 bg-teal-50 border-b border-teal-100">
                    {saveNotice}
                </div>
            )}

            <div className="max-w-3xl mx-auto py-8 px-4">
                {surveyModel && <Survey model={surveyModel} />}
            </div>
        </div>
    );
}
