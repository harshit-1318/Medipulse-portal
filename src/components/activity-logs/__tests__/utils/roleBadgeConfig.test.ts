import { describe, expect, it } from "vitest";
import { getRoleBadgeConfig } from "../../utils/roleBadgeConfig";

describe("roleBadgeConfig utility", () => {
    it("returns correct styling for super_admin", () => {
        const config = getRoleBadgeConfig("super_admin");
        expect(config.label).toBe("Super Admin");
        expect(config.color).toBe("#7c3aed");
    });

    it("returns correct styling for admin", () => {
        const config = getRoleBadgeConfig("admin");
        expect(config.label).toBe("Admin");
        expect(config.color).toBe("#2563eb");
    });

    it("returns correct styling for prescriber", () => {
        const config = getRoleBadgeConfig("prescriber");
        expect(config.label).toBe("Prescriber");
        expect(config.color).toBe("#059669");
    });

    it("returns correct styling for pharmacist", () => {
        const config = getRoleBadgeConfig("pharmacist");
        expect(config.label).toBe("Pharmacist");
        expect(config.color).toBe("#d97706");
    });

    it("returns correct styling for customer_support", () => {
        const config = getRoleBadgeConfig("customer_support");
        expect(config.label).toBe("Support");
        expect(config.color).toBe("#0d9488");
    });

    it("formats arbitrary role or falls back gracefully", () => {
        const config = getRoleBadgeConfig("lead_nurse");
        expect(config.label).toBe("Lead Nurse");
        expect(config.color).toBe("#64748b");

        const emptyConfig = getRoleBadgeConfig("");
        expect(emptyConfig.label).toBe("Staff");
    });
});
