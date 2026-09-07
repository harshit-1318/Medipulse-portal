import type { Product } from "../types";
import {
    WEIGHT_LOSS_SKUS,
    CLINICAL_CATEGORIES,
    CLINICAL_KEYWORDS,
} from "./orderClinicalConstants";

export function isWeightLossProduct(product: Product): boolean {
    if (product.categories && Array.isArray(product.categories)) {
        const isCategoryMatch = product.categories.some((cat) => {
            const c = cat.toLowerCase().trim();
            return c === "weight loss" || c === "weightloss" || c === "weight-loss";
        });
        if (isCategoryMatch) return true;
    }

    if (!product.sku) return false;
    const normalizedSku = product.sku.toLowerCase().trim();
    return WEIGHT_LOSS_SKUS.includes(normalizedSku);
}

export function isClinicalProduct(product: Product): boolean {
    if (product.categories && Array.isArray(product.categories)) {
        const isCategoryMatch = product.categories.some((cat) => {
            const c = cat.toLowerCase().trim();
            return CLINICAL_CATEGORIES.some((cc) => c.includes(cc));
        });
        if (isCategoryMatch) return true;
    }

    const name = product.name.toLowerCase();
    if (CLINICAL_KEYWORDS.some((kw) => name.includes(kw))) return true;

    return isWeightLossProduct(product);
}

export function isOrderWeightLoss(products: Product[]): boolean {
    if (!products || products.length === 0) return false;
    return products.some((p) => isWeightLossProduct(p));
}

export function isClinicalOrder(products: Product[]): boolean {
    if (!products || products.length === 0) return false;
    return products.some((p) => isClinicalProduct(p));
}

export function hasResyncTimestamp(resyncedAt: unknown): boolean {
    if (resyncedAt instanceof Date) {
        return !Number.isNaN(resyncedAt.getTime());
    }

    if (typeof resyncedAt === "number") {
        return Number.isFinite(resyncedAt) && resyncedAt > 0;
    }

    if (typeof resyncedAt === "string") {
        const value = resyncedAt.trim();
        return value.length > 0 && !Number.isNaN(Date.parse(value));
    }

    return false;
}

export function shouldAutoResyncOrder(resyncedAt: unknown): boolean {
    if (resyncedAt === undefined) {
        return false;
    }

    return !hasResyncTimestamp(resyncedAt);
}
