import { useEffect, useState } from 'react';
import { getSurveySession, saveProgress, submitSurvey } from '@/api/services/publicSurvey/publicSurveyService';
import type { PublicSurveySessionData } from '@/types/survey';
import { Model } from 'survey-core';

export type PageState = 'loading' | 'active' | 'completed' | 'already_submitted' | 'expired' | 'error';

export function usePublicSurveySession(token: string) {
    const [pageState, setPageState] = useState<PageState>('loading');
    const [sessionData, setSessionData] = useState<PublicSurveySessionData | null>(null);
    const [saveNotice, setSaveNotice] = useState('');
    const [surveyModel, setSurveyModel] = useState<Model | null>(null);

    useEffect(() => {
        getSurveySession(token)
            .then(data => {
                if (data.alreadySubmitted) { setPageState('already_submitted'); return; }
                if (data.expired) { setPageState('expired'); return; }
                setSessionData(data);
                
                const model = new Model(data.schema);
                if (data.partialResponse) {
                    model.data = data.partialResponse;
                }
                if (typeof data.currentPage === 'number') {
                    try { model.currentPageNo = data.currentPage; } catch (_) {}
                }

                model.onCurrentPageChanged.add(async (s: Model) => {
                    try {
                        await saveProgress(token, { partialResponse: s.data, currentPage: s.currentPageNo });
                        setSaveNotice('Progress auto-saved');
                        setTimeout(() => setSaveNotice(''), 3000);
                    } catch (_) {}
                });

                model.onComplete.add(async (s: Model) => {
                    try {
                        await submitSurvey(token, {
                            submittedResponse: s.data,
                            metadata: {
                                userAgent: navigator.userAgent,
                                submittedFrom: window.location.href,
                            },
                        });
                        setPageState('completed');
                    } catch (err: any) {
                        const status = err?.response?.status;
                        if (status === 410) { setPageState('already_submitted'); return; }
                        console.error('Submission failed', err);
                    }
                });

                setSurveyModel(model);
                setPageState('active');
            })
            .catch(err => {
                const status = err?.response?.status;
                if (status === 410) {
                    const data = err?.response?.data;
                    if (data?.alreadySubmitted) { setPageState('already_submitted'); return; }
                    if (data?.expired) { setPageState('expired'); return; }
                }
                setPageState('error');
            });
    }, [token]);

    const handleManualSave = async () => {
        if (!surveyModel) return;
        try {
            await saveProgress(token, { partialResponse: surveyModel.data, currentPage: surveyModel.currentPageNo });
            setSaveNotice('Progress saved — you can return to this link anytime');
            setTimeout(() => setSaveNotice(''), 5000);
        } catch (_) {
            setSaveNotice('Save failed — please try again');
            setTimeout(() => setSaveNotice(''), 4000);
        }
    };

    return {
        pageState,
        sessionData,
        saveNotice,
        surveyModel,
        handleManualSave,
    };
}
