import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterCustomers } from "../service";

vi.mock("@/api/apiClient", () => ({
    default: { get: vi.fn() },
}));

import apiClient from "@/api/apiClient";

describe("Customer Service - filterCustomers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("always calls /orders/search with type=customers", async () => {
        (apiClient.get as any).mockResolvedValue({
            customers: [{ customerId: "999", name: "Charlie" }],
            total: 1,
        });

        const result = await filterCustomers({ search: "Charlie", page: 2, limit: 10 });
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: "/orders/search",
                params: expect.objectContaining({ customer: "Charlie", type: "customers", page: 2, limit: 10 }),
            }),
        );
        expect(result.customers).toHaveLength(1);
        expect(result.customers[0].name).toBe("Charlie");
        expect(result.page).toBe(2);
        expect(result.limit).toBe(10);
    });

    it("returns safe fallback on filter error", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        (apiClient.get as any).mockRejectedValue(new Error("API Timeout"));

        const result = await filterCustomers({ page: 1, limit: 20 });
        expect(result).toEqual({ customers: [], total: 0, page: 1, limit: 20 });
        consoleSpy.mockRestore();
    });
});
