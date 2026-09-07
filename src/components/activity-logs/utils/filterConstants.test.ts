import { describe, expect, it } from "vitest";

import { ACTION_OPTIONS } from "./filterConstants";
import { getActionConfig } from "./actionConfig";

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
});
