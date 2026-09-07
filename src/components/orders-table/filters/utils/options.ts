import type { PageType } from "../../types";
import { 
    CATEGORY_PRODUCTS_MAP, PRODUCT_CATEGORIES, STATUS_OPTIONS, 
    ORDER_TYPE_OPTIONS, DOCUMENT_OPTIONS, ALL_PRODUCT_TYPES,
    FULFILLMENT_STATUS_OPTIONS
} from "./filterConstants";

export function getStatusOptions(pageType: PageType) {
    if (pageType === "on_hold") return [{ label: "On Hold", value: "On Hold" }];
    if (pageType === "unfulfilled") return [{ label: "Unfulfilled", value: "Unfulfilled" }];
    if (pageType === "fulfilled") return [{ label: "Fulfilled", value: "Fulfilled" }];
    if (pageType === "cancelled") return [{ label: "Cancelled", value: "Cancelled" }];
    return STATUS_OPTIONS;
}

export function getFulfillmentStatusOptions() {
    return FULFILLMENT_STATUS_OPTIONS;
}

export function getCustomerOrderOptions(pageType: PageType) {
    if (pageType === "single" || pageType === "first") return [{ label: "First Order", value: "first" }];
    if (pageType === "repeat") return [{ label: "Repeat Orders", value: "repeat" }];
    return ORDER_TYPE_OPTIONS;
}

export function getDocumentOptions(pageType: PageType) {
    if (pageType === "uploaded") return [{ label: "Uploaded", value: "Uploaded" }];
    if (pageType === "Not uploaded") return [{ label: "Not Uploaded", value: "Not Uploaded" }];
    return DOCUMENT_OPTIONS;
}

export function getProductCategoryOptions() {
    return PRODUCT_CATEGORIES;
}

export function getProductNameOptions(category: string) {
    const products = CATEGORY_PRODUCTS_MAP[category] || [];
    return [
        { label: "All Products", value: "" },
        ...products.map(p => ({ label: p, value: p }))
    ];
}

export function getProductTypeOptions(pageType: PageType, category?: string) {
    if (pageType === "injectable") return [{ label: "Injectable", value: "injectable" }];
    if (pageType === "oral") return [{ label: "Oral", value: "oral" }];

    const defaultOptions = [{ label: "All", value: "" }];

    if (category) {
        switch (category) {
            case "weight-loss": return [...defaultOptions, { label: "Injectable", value: "injectable" }, { label: "Oral", value: "oral" }];
            case "ed":
            case "migraine":
            case "jet-lag-treatment":
            case "period-delay":
            case "joint-pain": return [...defaultOptions, { label: "Tablet", value: "tablet", disabled: true }];
            case "acne": return [...defaultOptions, { label: "Gel", value: "gel", disabled: true }, { label: "Cream", value: "cream", disabled: true }, { label: "Lotion", value: "lotion", disabled: true }];
            case "asthma": return [...defaultOptions, { label: "Inhaler", value: "inhaler", disabled: true }];
            case "eczema-dermatitis": return [...defaultOptions, { label: "Cream", value: "cream", disabled: true }, { label: "Ointment", value: "ointment", disabled: true }];
            case "mens-hair-loss": return [...defaultOptions, { label: "Solution", value: "solution", disabled: true }, { label: "Foam", value: "foam", disabled: true }, { label: "Tablet", value: "tablet", disabled: true }];
            case "acid-reflux": return [...defaultOptions, { label: "Tablet", value: "tablet", disabled: true }, { label: "Capsules", value: "capsules", disabled: true }];
            case "bacterial-vaginosis": return [...defaultOptions, { label: "Cream", value: "cream", disabled: true }, { label: "Gel", value: "gel", disabled: true }, { label: "Tablet", value: "tablet", disabled: true }];
            default: break;
        }
    }

    if (pageType === "overview") return [...defaultOptions, { label: "Injectable", value: "injectable" }, { label: "Oral", value: "oral" }];
    return ALL_PRODUCT_TYPES;
}
