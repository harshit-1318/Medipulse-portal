import type { Product } from "../types/product";

export interface StructuredConsultation {
    height: string;
    weight: string;
    bmi: string;
    consultationType: string;
    questions: Record<string, string>;
}

/**
 * Normalizes a value that can be a string or an array of strings.
 */
function normalizeValue(value: any): string {
    if (Array.isArray(value)) {
        return value.filter(v => typeof v === "string").join(", ");
    }
    return typeof value === "string" ? value : String(value ?? "");
}

/**
 * Normalizes a key to a standard format for identification.
 */
function normalizeKeyForMatching(key: string): string {
    return (key || "").toLowerCase().trim();
}

/**
 * Extracts consultation data from a product, falling back to lineItemsRaw properties if consultationQuestions is empty.
 */
export function extractConsultationData(product: Partial<Product>): StructuredConsultation {
    const result: StructuredConsultation = {
        height: "",
        weight: "",
        bmi: "",
        consultationType: "",
        questions: {}
    };

    const dataSources: Array<{ name: string; value: any }[]> = [];

    // 1. Primary source: consultationQuestions
    if (product.consultationQuestions && product.consultationQuestions.length > 0) {
        dataSources.push(product.consultationQuestions);
    } 
    // 2. Fallback source: lineItemsRaw properties
    else if (product.lineItemsRaw && product.lineItemsRaw.length > 0) {
        product.lineItemsRaw.forEach(item => {
            if (item.properties && item.properties.length > 0) {
                dataSources.push(item.properties);
            }
        });
    }

    // Process sources
    dataSources.forEach(source => {
        source.forEach(prop => {
            const rawKey = prop.name || "";
            const normKey = normalizeKeyForMatching(rawKey);
            const value = normalizeValue(prop.value);

            if (!value) return;

            // Use exact case-insensitive equality so "prev height (cm)" never
            // accidentally matches the height slot.
            if (normKey === "height" || normKey === "height (cm)") {
                if (!result.height) result.height = value;
            } else if (normKey === "weight" || normKey === "weight (kg)") {
                if (!result.weight) result.weight = value;
            } else if (normKey === "bmi" || normKey === "body mass index") {
                if (!result.bmi) result.bmi = value;
            } else if (normKey === "consultation type" || normKey === "consultation") {
                if (!result.consultationType) result.consultationType = value;
            }

            // Always add to general questions to allow components to decide filtering
            if (!result.questions[rawKey]) {
                result.questions[rawKey] = value;
            }
        });
    });

    return result;
}
