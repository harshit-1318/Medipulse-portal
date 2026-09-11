import { describe, expect, it } from "vitest";
import { getActionConfig, getActionColor } from "../../utils/actionConfig";

describe("actionConfig", () => {
    it("returns correct config for email actions", () => {
        const config = getActionConfig("email_sent");
        expect(config.label).toBe("Email Sent");
        expect(config.color).toBe("#ec4899");
    });

    it("returns correct config for logout actions", () => {
        const config = getActionConfig("logout");
        expect(config.label).toBe("Logout");
        expect(config.color).toBe("#e11d48");
    });

    it("returns correct config for imported actions", () => {
        const config = getActionConfig("order_imported");
        expect(config.label).toBe("Imported");
        expect(config.color).toBe("#8b5cf6");
    });

    it("returns correct config for webhook actions", () => {
        const config = getActionConfig("webhook_received");
        expect(config.label).toBe("Webhook");
        expect(config.color).toBe("#64748b");
    });

    it("returns correct config for review actions", () => {
        const config = getActionConfig("scr_review");
        expect(config.label).toBe("Review");
        expect(config.color).toBe("#06b6d4");
    });

    it("returns correct color via getActionColor helper", () => {
        expect(getActionColor("email_sent")).toBe("#ec4899");
        expect(getActionColor("unknown_action")).toBe("#003B73");
    });

    it("returns safe defaults when action is empty or undefined", () => {
        const config = getActionConfig(undefined);
        expect(config.label).toBe("Activity");
        expect(config.color).toBe("#003B73");
    });
});
