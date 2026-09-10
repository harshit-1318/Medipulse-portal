import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { DateCell } from "../cells";

describe("DateCell", () => {
  const baseTime = new Date("2026-09-10T12:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders primary date and relative subtext correctly", () => {
    const fiveMinsAgo = new Date("2026-09-10T11:55:00Z").toISOString();
    render(<DateCell dateStr={fiveMinsAgo} />);

    expect(screen.getByText("10 Sept 26")).toBeInTheDocument();
    expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
  });

  it("updates relative time as time advances via interval", () => {
    const orderTime = new Date("2026-09-10T11:59:02Z").toISOString();
    render(<DateCell dateStr={orderTime} />);

    expect(screen.getByText("Just now")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(35000);
    });

    expect(screen.getByText("1 minute ago")).toBeInTheDocument();
  });

  it("renders single date when subtext is empty", () => {
    render(<DateCell dateStr="" />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText(/ago/)).not.toBeInTheDocument();
  });
});
