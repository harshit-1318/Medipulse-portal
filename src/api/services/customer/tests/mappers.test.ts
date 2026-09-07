import { describe, it, expect } from "vitest";
import { normalizeCustomer } from "../mappers";

describe("normalizeCustomer", () => {
    it("should normalize raw customer data correctly", () => {
        const raw = {
            customerId: 12345,
            name: "  John Doe  ",
            email: "john@example.com",
            totalOrders: "5",
            totalPens: 10,
            createdAt: "2024-01-01",
        };

        const result = normalizeCustomer(raw);

        expect(result).toEqual({
            customerId: "12345",
            name: "John Doe",
            email: "john@example.com",
            totalOrders: 5,
            totalPens: 10,
            createdAt: "2024-01-01",
        });
    });

    it("should handle BIGINT customerId with low/high properties", () => {
        const raw = {
            customerId: { low: 98765, high: 0 },
            name: "Jane Smith",
        };

        const result = normalizeCustomer(raw);
        expect(result.customerId).toBe("98765");
    });

    it("should provide defaults for missing fields", () => {
        const result = normalizeCustomer({});
        expect(result).toEqual({
            customerId: "",
            name: "N/A",
            email: "N/A",
            totalOrders: 0,
            totalPens: 0,
            createdAt: "",
        });
    });
});
