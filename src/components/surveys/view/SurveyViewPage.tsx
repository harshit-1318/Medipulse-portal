import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Model } from 'survey-core';
import { Survey as SurveyComponent } from 'survey-react-ui';
import { QueryProvider } from '@/components/common/QueryProvider';
import { getSurvey } from '@/api/services/survey/surveyService';
import { SurveyViewHeader } from './SurveyViewHeader';

interface SurveyViewPageProps {
    surveyId: string | null;
}

function SurveyViewContent({ surveyId }: SurveyViewPageProps) {
    const { data: survey, isLoading, error } = useQuery({
        queryKey: ['survey', surveyId],
        queryFn: () => {
            if (!surveyId) throw new Error('No survey ID provided');
            return getSurvey(surveyId);
        },
        enabled: !!surveyId,
        retry: 1,
    });

    const surveyModel = useMemo(() => {
        if (!survey) return null;
        const schema = survey.schema || survey.draftSchema || {};
        const model = new Model(schema);
        model.mode = 'display';
        return model;
    }, [survey]);

    if (!surveyId) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <AlertCircle className="h-10 w-10 text-rose-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Survey Route</h2>
                <p className="text-gray-500">The requested survey route is malformed or missing.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                <p className="text-sm font-medium text-gray-400">Loading survey data...</p>
            </div>
        );
    }

    if (error || !survey) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Survey Not Found</h2>
                    <p className="text-slate-500 mb-6">
                        The survey you are looking for does not exist, has been deleted, or you don't have permission to view it.
                    </p>
                    <a href="/surveys" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors focus:ring-4 focus:ring-teal-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Surveys
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden relative">
            <SurveyViewHeader survey={survey} />

            <div className="flex-1 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto py-8 px-4 w-full h-full"> 
                    {surveyModel && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] overflow-hidden drop-shadow-sm">
                            <SurveyComponent model={surveyModel} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SurveyViewPage({ surveyId }: SurveyViewPageProps) {
    return (
        <QueryProvider>
            <SurveyViewContent surveyId={surveyId} />
        </QueryProvider>
    );
}
