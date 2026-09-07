import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCustomers, filterCustomers } from "../service";

vi.mock("@/api/apiClient", () => ({
    default: { get: vi.fn() },
}));

import apiClient from "@/api/apiClient";

describe("Customer Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getCustomers", () => {
        it("calls /orders/customers/list on initial default load without filters or sort", async () => {
            (apiClient.get as any).mockResolvedValue({
                customers: [
                    {
                        customerId: "123",
                        name: "Alice",
                        email: "alice@example.com",
                        totalOrders: 2,
                        totalPens: 4,
                        createdAt: "2025-01-01",
                    },
                ],
                total: 1,
            });

            const result = await getCustomers({ page: 1, limit: 20 });

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: "/orders/customers/list",
                    params: expect.objectContaining({ page: 1, limit: 20 }),
                }),
            );
            expect(result.customers).toHaveLength(1);
            expect(result.customers[0].name).toBe("Alice");
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(20);
        });

        it("calls /orders/search with type=customers when active filters exist", async () => {
            (apiClient.get as any).mockResolvedValue({
                customers: [],
                total: 0,
            });

            await getCustomers({ search: "john" });

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: "/orders/search",
                    params: expect.objectContaining({
                        customer: "john",
                        type: "customers",
                    }),
                }),
            );
        });

        it("calls /orders/search when sortBy is set", async () => {
            (apiClient.get as any).mockResolvedValue({
                customers: [],
                total: 0,
            });

            await getCustomers({ sortBy: "name", sort: "asc" });

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: "/orders/search",
                    params: expect.objectContaining({
                        sortBy: "name",
                        type: "customers",
                    }),
                }),
            );
        });

        it("handles raw array response correctly", async () => {
            (apiClient.get as any).mockResolvedValue([
                {
                    customerId: "789",
                    name: "Bob",
                    email: "bob@example.com",
                },
            ]);

            const result = await getCustomers();

            expect(result.customers).toHaveLength(1);
            expect(result.customers[0].customerId).toBe("789");
            expect(result.total).toBe(1);
        });

        it("returns safe fallback on API error", async () => {
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            (apiClient.get as any).mockRejectedValue(new Error("Network Error"));

            const result = await getCustomers({ page: 3, limit: 10 });

            expect(result).toEqual({
                customers: [],
                total: 0,
                page: 3,
                limit: 10,
            });
            consoleSpy.mockRestore();
        });
    });

    describe("filterCustomers", () => {
        it("always calls /orders/search with type=customers", async () => {
            (apiClient.get as any).mockResolvedValue({
                customers: [
                    { customerId: "999", name: "Charlie" },
                ],
                total: 1,
            });

            const result = await filterCustomers({ search: "Charlie", page: 2, limit: 10 });

            expect(apiClient.get).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: "/orders/search",
                    params: expect.objectContaining({
                        customer: "Charlie",
                        type: "customers",
                        page: 2,
                        limit: 10,
                    }),
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

            expect(result).toEqual({
                customers: [],
                total: 0,
                page: 1,
                limit: 20,
            });
            consoleSpy.mockRestore();
        });
    });
});
