/**
 * @experimental
 * Tests for getActivityDashboard — not 100% validated against production
 * edge cases yet. Treat as a regression safety net.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getActivityDashboard, type ActivityDashboard } from "./superAdminService";

vi.mock("@/api/apiClient", () => ({
    default: { get: vi.fn() },
}));
import apiClient from "@/api/apiClient";

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;

function makeDashboard(overrides: Partial<ActivityDashboard> = {}): ActivityDashboard {
    return {
        period: { days: 30, from: "2026-04-01T00:00:00.000Z", to: "2026-05-01T00:00:00.000Z" },
        totals: { events: 250, uniqueStaff: 8, userEvents: 90, systemEvents: 60, legacyEvents: 100, failedLogins: 2, commActionsSent: 15 },
        byDay: [{ date: "2026-04-29", count: 30 }, { date: "2026-04-30", count: 45 }],
        byActionType: [{ action: "order_viewed", count: 80 }],
        bySource: [{ source: "user", count: 90 }, { source: "system", count: 60 }],
        byHour: [{ hour: 9, count: 50 }],
        bySite: [{ siteName: "Clinic A", count: 150 }],
        commActions: [{ action: "prescription_reminder_sent", count: 10 }],
        byBrowser: [{ browser: "Chrome", count: 180 }],
        byOS: [{ os: "Windows", count: 200 }],
        byDevice: [{ device: "desktop", count: 230 }],
        topUsers: [{ email: "alice@clinic.com", count: 45 }],
        recentLogins: [{ email: "alice@clinic.com", ip: "1.2.3.4", browser: "Chrome", os: "Windows", createdAt: "2026-04-30T10:00:00.000Z" }],
        recentFailedLogins: [{ email: "bad@actor.com", ip: "9.9.9.9", createdAt: "2026-04-30T08:00:00.000Z" }],
        ...overrides,
    };
}

describe("getActivityDashboard", () => {
    beforeEach(() => vi.clearAllMocks());

    it("calls the correct URL with days param", async () => {
        mockGet.mockResolvedValue(makeDashboard());
        await getActivityDashboard(7);
        expect(mockGet).toHaveBeenCalledWith("/super-admin/activity-dashboard?days=7");
    });

    it("defaults to 30 days when called without arguments", async () => {
        mockGet.mockResolvedValue(makeDashboard());
        await getActivityDashboard();
        expect(mockGet).toHaveBeenCalledWith("/super-admin/activity-dashboard?days=30");
    });

    it("returns the API response with all fields", async () => {
        mockGet.mockResolvedValue(makeDashboard());
        const result = await getActivityDashboard(30);

        expect(result.totals.events).toBe(250);
        expect(result.totals.uniqueStaff).toBe(8);
        expect(result.totals.legacyEvents).toBe(100);
        expect(result.totals.commActionsSent).toBe(15);
        expect(result.bySource).toEqual([{ source: "user", count: 90 }, { source: "system", count: 60 }]);
        expect(result.bySite).toEqual([{ siteName: "Clinic A", count: 150 }]);
        expect(result.byHour).toHaveLength(1);
        expect(result.commActions).toHaveLength(1);
    });

    it("returns EMPTY_DASHBOARD on API error", async () => {
        mockGet.mockRejectedValue(new Error("Network error"));
        const result = await getActivityDashboard(30);

        expect(result.totals.events).toBe(0);
        expect(result.totals.uniqueStaff).toBe(0);
        expect(result.totals.legacyEvents).toBe(0);
        expect(result.totals.commActionsSent).toBe(0);
        expect(result.byDay).toEqual([]);
        expect(result.byHour).toEqual([]);
        expect(result.bySite).toEqual([]);
        expect(result.commActions).toEqual([]);
        expect(result.recentLogins).toEqual([]);
    });

    it("returns EMPTY_DASHBOARD when API returns null", async () => {
        mockGet.mockResolvedValue(null);
        const result = await getActivityDashboard(30);
        expect(result.totals.events).toBe(0);
        expect(result.byDay).toEqual([]);
    });
});
