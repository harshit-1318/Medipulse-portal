import { describe, it, expect } from "vitest";
import {
    sortOrderId,
    sortOrderDate,
    sortStatus,
    sortCustomer,
    sortOrdersCount,
    sortProducts,
    getProductCount,
} from "../utils/orderSorting";
import type { OrderType } from "@/api/services/orders";

function mockRow(data: Partial<OrderType>) {
    return {
        original: data as OrderType,
        getValue: (key: string) => (data as any)[key],
    } as any;
}

describe("orderSorting utilities", () => {
    describe("sortOrderId (numeric/string ID sorting)", () => {
        it("sorts numeric IDs correctly regardless of # prefix", () => {
            const rowA = mockRow({ id: "#20" });
            const rowB = mockRow({ id: "#100" });
            expect(sortOrderId(rowA, rowB, "id")).toBeLessThan(0);
            expect(sortOrderId(rowB, rowA, "id")).toBeGreaterThan(0);
        });

        it("sorts alphanumeric IDs with natural order", () => {
            const rowA = mockRow({ id: "ORDER-2" });
            const rowB = mockRow({ id: "ORDER-10" });
            expect(sortOrderId(rowA, rowB, "id")).toBeLessThan(0);
        });

        it("handles equal IDs", () => {
            const rowA = mockRow({ id: "#500" });
            const rowB = mockRow({ id: "500" });
            expect(sortOrderId(rowA, rowB, "id")).toBe(0);
        });
    });

    describe("sortOrderDate (chronological date sorting)", () => {
        it("sorts earlier dates before later dates", () => {
            const rowA = mockRow({ date: "2024-01-15T00:00:00Z" });
            const rowB = mockRow({ date: "2024-06-20T00:00:00Z" });
            expect(sortOrderDate(rowA, rowB, "date")).toBeLessThan(0);
            expect(sortOrderDate(rowB, rowA, "date")).toBeGreaterThan(0);
        });

        it("handles createdAt fallback and invalid dates gracefully", () => {
            const rowA = mockRow({ createdAt: "invalid-date" });
            const rowB = mockRow({ date: "2024-01-01T00:00:00Z" });
            expect(sortOrderDate(rowA, rowB, "date")).toBeLessThan(0);
        });
    });

    describe("sortStatus (alphabetical status-value sorting)", () => {
        it("sorts status alphabetically", () => {
            const rowA = mockRow({ status: "cancelled" });
            const rowB = mockRow({ status: "fulfilled" });
            expect(sortStatus(rowA, rowB, "status")).toBeLessThan(0);
        });

        it("replaces underscores and uses fulfillment_status if available", () => {
            const rowA = mockRow({ fulfillment_status: "on_hold" });
            const rowB = mockRow({ status: "unfulfilled" });
            expect(sortStatus(rowA, rowB, "status")).toBeLessThan(0);
        });
    });

    describe("sortCustomer (alphabetical customer sorting)", () => {
        it("sorts by customer name alphabetically when customer is an object", () => {
            const rowA = mockRow({ customer: { first_name: "Alice", last_name: "Smith", email: "", id: 1 } });
            const rowB = mockRow({ customer: { first_name: "Bob", last_name: "Jones", email: "", id: 2 } });
            expect(sortCustomer(rowA, rowB)).toBeLessThan(0);
        });

        it("sorts by customer name when customer is a string", () => {
            const rowA = mockRow({ customer: "Charlie Brown" });
            const rowB = mockRow({ customer: "David Miller" });
            expect(sortCustomer(rowA, rowB)).toBeLessThan(0);
        });
    });

    describe("sortOrdersCount (numeric orders count sorting)", () => {
        it("sorts repeated orders numerically", () => {
            const rowA = mockRow({ repeatedOrders: 0 });
            const rowB = mockRow({ repeatedOrders: 3 });
            expect(sortOrdersCount(rowA, rowB, "repeatedOrders")).toBeLessThan(0);
            expect(sortOrdersCount(rowB, rowA, "repeatedOrders")).toBeGreaterThan(0);
        });

        it("handles missing or undefined values as 0", () => {
            const rowA = mockRow({});
            const rowB = mockRow({ repeatedOrders: 1 });
            expect(sortOrdersCount(rowA, rowB, "repeatedOrders")).toBeLessThan(0);
        });
    });

    describe("sortProducts and getProductCount (numeric products sorting)", () => {
        it("calculates product count from array with quantities", () => {
            const order = {
                products: [
                    { name: "Med A", quantity: 2 },
                    { name: "Med B", quantity: 3 },
                    { name: "Shipment Protection", quantity: 1 },
                ],
            } as any;
            // Ignores shipment protection, sums 2 + 3 = 5
            expect(getProductCount(order)).toBe(5);
        });

        it("handles numeric and string product counts", () => {
            expect(getProductCount({ products: 4 } as any)).toBe(4);
            expect(getProductCount({ products: "2" } as any)).toBe(2);
            expect(getProductCount(null)).toBe(0);
        });

        it("sorts orders by total product count", () => {
            const rowA = mockRow({ products: [{ name: "Med A", quantity: 1 }] });
            const rowB = mockRow({ products: [{ name: "Med A", quantity: 3 }] });
            expect(sortProducts(rowA, rowB)).toBeLessThan(0);
            expect(sortProducts(rowB, rowA)).toBeGreaterThan(0);
        });
    });
});
