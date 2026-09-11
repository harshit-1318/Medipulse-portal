import { describe, expect, it } from "vitest";

import { ACTION_OPTIONS, ROLE_OPTIONS } from "../../utils/filterConstants";
import { getActionConfig } from "../../utils/actionConfig";

describe("activity log filter/action mappings", () => {
  it("includes Email Skipped in action dropdown options", () => {
    expect(ACTION_OPTIONS).toContainEqual({
      label: "Email Skipped",
      value: "email_skipped",
    });
  });

  it("renders Email Skipped chip label for email_skipped actions", () => {
    const config = getActionConfig("email_skipped");

    expect(config.label).toBe("Email Skipped");
  });

  it("includes all expected roles in ROLE_OPTIONS", () => {
    expect(ROLE_OPTIONS).toEqual(
      expect.arrayContaining([
        { label: "All Roles", value: "" },
        { label: "Super Admin", value: "super_admin" },
        { label: "Admin", value: "admin" },
        { label: "Prescriber", value: "prescriber" },
        { label: "Pharmacist", value: "pharmacist" },
        { label: "Customer Support", value: "customer_support" },
      ])
    );
  });
});
