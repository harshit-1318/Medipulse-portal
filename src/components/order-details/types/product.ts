import type { KVPair } from "./common";

export interface Product {
    name: string;
    quantity: number;
    price: string;
    product_id: number;
    sku?: string;
    categories?: string[];
    hasValidData: boolean;
    heightData: KVPair[];
    weightData: KVPair[];
    bmiData: KVPair[];
    // Snapshot of previous consultation measurements (present on re-orders only)
    prevHeightData?: KVPair[];
    prevWeightData?: KVPair[];
    prevBmiData?: KVPair[];
    consultationQuestions: KVPair[];
    lineItemsRaw?: Array<{
        properties: Array<{ name: string; value: any }>;
    }>;
}
