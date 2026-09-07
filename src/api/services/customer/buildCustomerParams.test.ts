import { describe, it, expect, vi } from "vitest";
import { buildCustomerParams } from "./utils";

vi.mock("@/utils/url/urlBase", () => ({
    normalizeSortOrder: (order: string) => order.toLowerCase()
}));

describe("buildCustomerParams", () => {
    it("should build default params", () => {
        const result = buildCustomerParams();
        expect(result).toEqual({
            page: 1,
            limit: 20
        });
    });

    it("should include pagination and sorting", () => {
        const result = buildCustomerParams({
            page: 2,
            limit: 50,
            sortBy: "name",
            sort: "desc"
        });

        expect(result).toEqual({
            page: 2,
            limit: 50,
            sortBy: "name",
            sort: "desc"
        });
    });

    it("should map sortBy keys correctly", () => {
        const result = buildCustomerParams({
            sortBy: "createdAt"
        });
        expect(result.sortBy).toBe("createdAt");
    });

    it("should handle filter fields", () => {
        const result = buildCustomerParams({
            search: "test",
            totalPens: "5",
            customerEmail: "test@example.com"
        });

        expect(result.customer).toBe("test");
        expect(result.totalPens).toBe("5");
        expect(result.customerEmail).toBe("test@example.com");
    });
});
