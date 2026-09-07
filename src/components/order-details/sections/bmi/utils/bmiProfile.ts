import type { Product } from "@/components/order-details/types";
import { extractConsultationData } from "@/components/order-details/utils";
import {
    ETHNICITY_QUESTION_HINTS,
    WEBSITE_ETHNICITY_OPTIONS_ADJUSTED,
    WEBSITE_ETHNICITY_OPTIONS_STANDARD,
    ADJUSTED_GROUP_HINTS,
} from "./bmiConstants";

export type BmiProfile = "standard" | "ethnicity-adjusted";

function normalize(value: unknown): string {
    return String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function containsAdjustedGroup(text: unknown): boolean {
    const normalized = normalize(text);

    if (WEBSITE_ETHNICITY_OPTIONS_ADJUSTED.some((option) => normalized === option)) {
        return true;
    }

    return ADJUSTED_GROUP_HINTS.some((group) => normalized.includes(group));
}

function isStandardWebsiteOption(text: unknown): boolean {
    const normalized = normalize(text);
    return WEBSITE_ETHNICITY_OPTIONS_STANDARD.some((option) => normalized === option);
}

function isEthnicityQuestionKey(text: unknown): boolean {
    const normalized = normalize(text);
    return ETHNICITY_QUESTION_HINTS.some((hint) => normalized.includes(hint));
}

function hasAnswerValue(text: unknown): boolean {
    return normalize(text).length > 0;
}

function isAffirmative(text: unknown): boolean {
    const normalized = normalize(text);
    return normalized === "yes" || normalized === "y" || normalized === "true" || normalized === "1" || normalized.startsWith("yes ");
}

export function getBmiProfileFromProduct(mainProduct?: Partial<Product>): BmiProfile {
    if (!mainProduct) return "standard";

    const consultation = extractConsultationData(mainProduct);

    for (const [question, answer] of Object.entries(consultation.questions)) {
        const questionIsEthnicity = isEthnicityQuestionKey(question);

        if (questionIsEthnicity && isStandardWebsiteOption(answer)) {
            return "standard";
        }

        if (questionIsEthnicity && containsAdjustedGroup(answer)) {
            return "ethnicity-adjusted";
        }

        if (containsAdjustedGroup(answer)) {
            return "ethnicity-adjusted";
        }

        if (containsAdjustedGroup(question) && isAffirmative(answer)) {
            return "ethnicity-adjusted";
        }
    }

    return "standard";
}

export function hasProvidedEthnicityAnswer(mainProduct?: Partial<Product>): boolean {
    if (!mainProduct) return false;

    const consultation = extractConsultationData(mainProduct);

    return Object.entries(consultation.questions).some(([question, answer]) => {
        if (!isEthnicityQuestionKey(question)) return false;
        return hasAnswerValue(answer);
    });
}
