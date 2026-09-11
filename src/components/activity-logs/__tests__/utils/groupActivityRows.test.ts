import { describe, expect, it } from "vitest";
import { groupActivityRows, hasUsableOrderId } from "../../utils/groupActivityRows";

describe("groupActivityRows & hasUsableOrderId", () => {
    it("recognizes empty, zero, null, undefined, and dash as non-usable order IDs", () => {
        expect(hasUsableOrderId("")).toBe(false);
        expect(hasUsableOrderId("0")).toBe(false);
        expect(hasUsableOrderId("null")).toBe(false);
        expect(hasUsableOrderId("undefined")).toBe(false);
        expect(hasUsableOrderId("-")).toBe(false);
        expect(hasUsableOrderId("10042")).toBe(true);
    });

    it("groups logs without usable order ID under user groups", () => {
        const rows = [
            { id: "r1", original: { orderId: "-", userEmail: "admin@medipulse.io", userName: "Admin Harshit" } },
            { id: "r2", original: { orderId: "10042", userEmail: "dr@medipulse.io", userName: "Dr. Sarah" } },
        ];

        const { groupedRows, noOrderRowsByUser } = groupActivityRows(rows);

        expect(groupedRows.has("10042")).toBe(true);
        expect(groupedRows.has("-")).toBe(false);
        expect(noOrderRowsByUser.has("admin@medipulse.io")).toBe(true);
        expect(noOrderRowsByUser.get("admin@medipulse.io")?.rows.length).toBe(1);
    });
});
