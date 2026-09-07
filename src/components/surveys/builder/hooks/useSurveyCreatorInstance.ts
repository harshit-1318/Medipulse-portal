import { useEffect, useMemo } from 'react';
import { SurveyCreator } from 'survey-creator-react';
import type { Survey } from '@/types/survey';

export function useSurveyCreatorInstance(
    survey: Survey | null | undefined,
    setIsDirty: (dirty: boolean) => void
) {
    const creator = useMemo(() => {
        const options = {
            showLogicTab: true,
            showTranslationTab: false,
            showThemeTab: false,
            isAutoSave: false,
        };
        const newCreator = new SurveyCreator(options);
        
        newCreator.onModified.add(() => {
            setTimeout(() => setIsDirty(true), 0);
        });
        
        return newCreator;
    }, [setIsDirty]);

    useEffect(() => {
        const schema = survey?.draftSchema ?? survey?.schema;
        if (schema && Object.keys(schema).length > 0) {
            creator.JSON = schema;
        }
    }, [survey, creator]);

    return creator;
}
