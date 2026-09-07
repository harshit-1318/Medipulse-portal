import type { OrderProduct } from "../types";
import { detectCategory } from "./categoryDetection";

export { detectCategory };

export function parseProducts(o: any): OrderProduct[] {
    if (!o) return [];
    try {
        let foundArray: any[] | null = null;
        const targetFields = ["line_items", "lineItems", "products", "items", "line_item", "order_items", "items_list", "skus", "packages", "details", "cart", "cart_items", "order_data", "shopify_order_data", "metadata", "meta_data", "attributes"];

        function findArray(obj: any, seen: Set<any> = new Set()): any[] | null {
            if (!obj || typeof obj !== 'object' || seen.has(obj)) return null;
            seen.add(obj);
            for (const field of targetFields) {
                const arr = obj[field];
                if (Array.isArray(arr) && arr.length > 0) {
                    if (arr.length === 1 && typeof arr[0] === "string") {
                        const val = arr[0].toUpperCase();
                        if (val === "N/A" || val === "NULL" || val === "UNDEFINED") continue;
                    }
                    return arr;
                }
            }
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (['customer', 'activityLogs', 'shipping_address', 'billing_address', 'logs', 'history'].includes(key)) continue;
                    const result = findArray(obj[key], seen);
                    if (result) return result;
                }
            }
            return null;
        }

        foundArray = findArray(o);
        let products: OrderProduct[] = [];

        if (foundArray) {
            products = foundArray.map((it: any) => ({
                name: (typeof it === "string" ? it : (it.name || it.title || it.productName || it.product_title || it.product_name || it.productTitle || it.item_title || it.item_name || it.variant_title || it.label || "Unknown Product")),
                quantity: it.quantity || it.qty || 1,
                price: it.price || it.total_price || 0,
            }));
        } else {
            function findSingular(obj: any, seen: Set<any> = new Set()): any | null {
                if (!obj || typeof obj !== 'object' || seen.has(obj)) return null;
                seen.add(obj);
                const fields = ["product", "productName", "product_name", "title", "name", "products", "item", "productTitle", "item_title", "item_name", "label", "variant_title"];
                for (const field of fields) {
                    const val = obj[field];
                    if (!val) continue;
                    if (typeof val === "string" && val.trim() !== "" && val.toUpperCase() !== "N/A" && !["UNKNOWN", "NULL", "UNDEFINED"].includes(val.toUpperCase())) return val;
                    if (typeof val === "object") {
                        const innerName = val.name || val.title || val.productName || val.product_name || val.item_name;
                        if (typeof innerName === "string" && innerName.trim() !== "") return { name: innerName, quantity: val.quantity || val.qty || 1 };
                    }
                }
                for (const key in obj) {
                    if (['customer', 'activityLogs', 'shipping_address'].includes(key)) continue;
                    const result = findSingular(obj[key], seen);
                    if (result) return result;
                }
                return null;
            }
            const singularResult = findSingular(o);
            if (singularResult) products = typeof singularResult === "string" ? [{ name: singularResult, quantity: 1 }] : [singularResult];
        }

        if (products.length > 0) {
            return products.filter((p) =>
                p.name && typeof p.name === "string" && p.name.toUpperCase() !== "N/A" && p.name.toUpperCase() !== "NULL" && !p.name.toLowerCase().includes('shipment')
            );
        }
    } catch (err) { /* Ignored */ }
    return [];
}
