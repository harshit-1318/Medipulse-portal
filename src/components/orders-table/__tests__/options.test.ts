import { describe, expect, it } from "vitest";
import { getStatusOptions, getCustomerOrderOptions } from "../filters";
import type { PageType } from "../types";

describe("Filter Options UI Helpers", () => {
    it("getStatusOptions should respond to page types", () => {
        expect(getStatusOptions("on_hold")).toEqual([{ label: "On Hold", value: "On Hold" }]);
        expect(getStatusOptions("fulfilled").length).toBe(1);
        expect(getStatusOptions("dashboard" as PageType).length).toBeGreaterThan(3);
    });

    it("getCustomerOrderOptions should respond to page types", () => {
        expect(getCustomerOrderOptions("single")).toEqual([{ label: "First Order", value: "first" }]);
        expect(getCustomerOrderOptions("dashboard" as PageType).length).toBe(3);
    });
});
