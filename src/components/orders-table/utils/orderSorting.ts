import type { Row } from "@tanstack/react-table";
import type { OrderType } from "@/api/services/orders";
import { normalizeCustomer } from "@/utils/helpers";

/**
 * Extracts total product count / quantity from products field.
 */
export function getProductCount(order?: Partial<OrderType> | null): number {
    if (!order) return 0;
    const raw = order.products;
    if (typeof raw === "number") return isNaN(raw) ? 0 : raw;
    if (Array.isArray(raw)) {
        const filtered = raw.filter((p) => p && p.name && !String(p.name).toLowerCase().includes("shipment"));
        const targetList = filtered.length > 0 ? filtered : raw;
        return targetList.reduce((sum: number, p: any) => sum + (Number(p?.quantity) || 1), 0);
    }
    if (typeof raw === "string") {
        const num = Number(raw.trim());
        if (!isNaN(num) && String(num) === raw.trim()) return num;
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.reduce((sum: number, p: any) => sum + (Number(p?.quantity) || 1), 0);
            }
        } catch {
            return raw.trim() !== "" && raw.toUpperCase() !== "N/A" ? 1 : 0;
        }
    }
    return 0;
}

/**
 * 1. Order ID: numeric/string ID sorting.
 */
export function sortOrderId(rowA: Row<OrderType>, rowB: Row<OrderType>, columnId: string): number {
    const rawA = rowA.getValue(columnId) ?? rowA.original?.id ?? rowA.original?.shopify_order_id ?? "";
    const rawB = rowB.getValue(columnId) ?? rowB.original?.id ?? rowB.original?.shopify_order_id ?? "";
    const strA = String(rawA).trim();
    const strB = String(rawB).trim();
    const cleanA = strA.replace(/^[#\s]+/, "");
    const cleanB = strB.replace(/^[#\s]+/, "");
    const numA = Number(cleanA);
    const numB = Number(cleanB);
    const isNumA = !isNaN(numA) && cleanA !== "";
    const isNumB = !isNaN(numB) && cleanB !== "";
    if (isNumA && isNumB) return numA - numB;
    return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * 2. Order Date: chronological date sorting.
 */
export function sortOrderDate(rowA: Row<OrderType>, rowB: Row<OrderType>, columnId: string): number {
    const rawA = rowA.getValue(columnId) ?? rowA.original?.date ?? rowA.original?.createdAt ?? "";
    const rawB = rowB.getValue(columnId) ?? rowB.original?.date ?? rowB.original?.createdAt ?? "";
    const timeA = rawA ? new Date(rawA as string).getTime() : 0;
    const timeB = rawB ? new Date(rawB as string).getTime() : 0;
    return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
}

/**
 * 3. Status: alphabetical/status-value sorting.
 */
export function sortStatus(rowA: Row<OrderType>, rowB: Row<OrderType>, columnId: string): number {
    const sA = String(rowA.original?.fulfillment_status || rowA.original?.status || rowA.getValue(columnId) || "").replace(/_/g, " ").trim();
    const sB = String(rowB.original?.fulfillment_status || rowB.original?.status || rowB.getValue(columnId) || "").replace(/_/g, " ").trim();
    return sA.localeCompare(sB, undefined, { sensitivity: "base" });
}

/**
 * 4. Customer: alphabetical sorting.
 */
export function sortCustomer(rowA: Row<OrderType>, rowB: Row<OrderType>): number {
    const custA = (normalizeCustomer(rowA.original || {}).name || "").trim();
    const custB = (normalizeCustomer(rowB.original || {}).name || "").trim();
    return custA.localeCompare(custB, undefined, { sensitivity: "base" });
}

/**
 * 5. Orders: numeric sorting.
 */
export function sortOrdersCount(rowA: Row<OrderType>, rowB: Row<OrderType>, columnId: string): number {
    const countA = Number(rowA.original?.repeatedOrders ?? rowA.getValue(columnId) ?? 0);
    const countB = Number(rowB.original?.repeatedOrders ?? rowB.getValue(columnId) ?? 0);
    return (isNaN(countA) ? 0 : countA) - (isNaN(countB) ? 0 : countB);
}

/**
 * 6. Products: numeric sorting (count / quantity).
 */
export function sortProducts(rowA: Row<OrderType>, rowB: Row<OrderType>): number {
    const countA = getProductCount(rowA.original);
    const countB = getProductCount(rowB.original);
    if (countA !== countB) return countA - countB;
    const nameA = Array.isArray(rowA.original?.products) ? (rowA.original.products[0]?.name || "") : String(rowA.original?.products || "");
    const nameB = Array.isArray(rowB.original?.products) ? (rowB.original.products[0]?.name || "") : String(rowB.original?.products || "");
    return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
}
