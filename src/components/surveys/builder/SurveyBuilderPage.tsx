import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { QueryProvider } from '@/components/common/QueryProvider';
import { useSurveyBuilder } from './hooks/useSurveyBuilder';
import SurveyBuilderToolbar from './SurveyBuilderToolbar';
import SurveyVersionHistory from './SurveyVersionHistory';
import { IsolatedSurveyCreator } from './IsolatedSurveyCreator';
import { useSurveyCreatorInstance } from './hooks/useSurveyCreatorInstance';

interface SurveyBuilderContentProps {
    surveyId: string | null;
}

function BuilderCore({ surveyId }: SurveyBuilderContentProps) {
    const {
        survey, isLoading,
        title, setTitle,
        isDirty, setIsDirty,
        versions, showVersionHistory, setShowVersionHistory,
        handleSave,
        isSaving, isPublishing,
        handleUnpublish, handleRollback,
    } = useSurveyBuilder({ surveyId });

    const creator = useSurveyCreatorInstance(survey, setIsDirty);

    const getCreatorSchema = (): Record<string, any> => {
        return creator?.JSON ?? {};
    };

    const onSaveDraft = useCallback(() => {
        handleSave('draft', getCreatorSchema());
    }, [handleSave, creator]);

    const onPublish = useCallback(() => {
        handleSave('published', getCreatorSchema());
    }, [handleSave, creator]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <SurveyBuilderToolbar
                title={title}
                onTitleChange={setTitle}
                status={survey?.status}
                onSaveDraft={onSaveDraft}
                onPublish={onPublish}
                onUnpublish={handleUnpublish}
                onShowVersionHistory={() => setShowVersionHistory(true)}
                isSaving={isSaving}
                isPublishing={isPublishing}
                isDirty={isDirty}
                surveyId={surveyId}
            />

            <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
                {creator && (
                    <div className="w-full h-full">
                        <IsolatedSurveyCreator creator={creator} />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showVersionHistory && (
                    <SurveyVersionHistory
                        versions={versions}
                        currentVersion={survey?.currentVersion ?? 1}
                        onRollback={handleRollback}
                        onClose={() => setShowVersionHistory(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SurveyBuilderPage({ surveyId }: { surveyId: string | null }) {
    return (
        <QueryProvider>
            <BuilderCore surveyId={surveyId} />
        </QueryProvider>
    );
}

