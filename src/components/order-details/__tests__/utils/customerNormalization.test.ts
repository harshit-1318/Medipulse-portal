import { describe, expect, it } from "vitest";
import { normalizeCustomerInfo } from "../../utils/customerNormalization";

describe("normalizeCustomerInfo", () => {
    it("prefers DOB from customerInfo when present", () => {
        const result = normalizeCustomerInfo({
            customerInfo: {
                id: 12,
                name: "Jane Doe",
                email: "jane@example.com",
                address: "1 Main St",
                totalOrders: 2,
                dob: "1988-04-03",
            },
            products: [
                {
                    consultationQuestions: [
                        { name: "date of birth", value: "1990-01-01" },
                    ],
                },
            ],
        });

        expect(result.dob).toBe("1988-04-03");
    });

    it("falls back to consultation question DOB when customerInfo DOB is missing", () => {
        const result = normalizeCustomerInfo({
            customerInfo: {
                id: 12,
                name: "Jane Doe",
                email: "jane@example.com",
                address: "1 Main St",
                totalOrders: 2,
            },
            products: [
                {
                    consultationQuestions: [
                        { name: "Date of Birth", value: "1990-01-01" },
                    ],
                },
            ],
        });

        expect(result.dob).toBe("1990-01-01");
    });
});
