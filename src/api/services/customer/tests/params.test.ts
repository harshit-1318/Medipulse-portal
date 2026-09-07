import { describe, it, expect, vi } from "vitest";
import { buildCustomerParams } from "../params";

vi.mock("@/utils/url/urlBase", () => ({
    normalizeSortOrder: (order: string) => (order.toLowerCase() === "desc" ? "desc" : "asc"),
}));

describe("buildCustomerParams", () => {
    it("should build default params", () => {
        const result = buildCustomerParams();
        expect(result).toEqual({
            page: 1,
            limit: 20,
        });
    });

    it("should include pagination and sorting", () => {
        const result = buildCustomerParams({
            page: 2,
            limit: 50,
            sortBy: "name",
            sort: "desc",
        });

        expect(result).toEqual({
            page: 2,
            limit: 50,
            sortBy: "name",
            sort: "desc",
        });
    });

    it("should map sortBy keys correctly", () => {
        const result = buildCustomerParams({
            sortBy: "createdAt",
        });
        expect(result.sortBy).toBe("createdAt");
    });

    it("should handle filter fields", () => {
        const result = buildCustomerParams({
            search: "test",
            totalPens: "5",
            customerId: "cust-101",
            customerEmail: "test@example.com",
            customerName: "Jane Doe",
        });

        expect(result.customer).toBe("test");
        expect(result.totalPens).toBe("5");
        expect(result.customerId).toBe("cust-101");
        expect(result.customerEmail).toBe("test@example.com");
        expect(result.customerName).toBe("Jane Doe");
    });

    it("should format customer_start_date as UTC midnight ISO string", () => {
        const result = buildCustomerParams({
            customer_start_date: "2025-05-15",
        });

        expect(result.customer_start_date).toBe(
            new Date(Date.UTC(2025, 4, 15, 0, 0, 0, 0)).toISOString(),
        );
    });
});
