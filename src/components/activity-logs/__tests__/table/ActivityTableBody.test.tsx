import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityTableBody } from "../../table/ActivityTableBody";
import type { ActivityLogType } from "@/api/services/log/logService";

const makeLog = (overrides: Partial<ActivityLogType> = {}): ActivityLogType => ({
    id: overrides.id ?? "log-id",
    action: overrides.action ?? "order_viewed",
    page: overrides.page ?? "orders",
    userName: overrides.userName ?? "john",
    userEmail: overrides.userEmail ?? "john@clinic.com",
    orderId: overrides.orderId ?? "1001",
    target: overrides.target ?? "",
    details: overrides.details ?? "details",
    createdAt: overrides.createdAt ?? "2026-04-28T10:00:00.000Z",
    count: overrides.count ?? 1,
});

const makeTable = (logs: ActivityLogType[]) => ({
    getRowModel: () => ({
        rows: logs.map((log, idx) => ({ id: `row-${idx}`, original: log })),
    }),
});

describe("ActivityTableBody", () => {
    it("renders order subgroup headers and groups missing/zero order ids by user at the bottom", () => {
        const logs = [
            makeLog({ id: "1", orderId: "100" }),
            makeLog({ id: "2", orderId: "", userName: "wasim", userEmail: "wasim@example.com" }),
            makeLog({ id: "3", orderId: "100" }),
            makeLog({ id: "4", orderId: "200" }),
            makeLog({ id: "5", orderId: "0", userName: "wasim", userEmail: "wasim@example.com" }),
            makeLog({ id: "6", orderId: "   ", userName: "himani", userEmail: "himani@gmail.com" }),
        ];

        const table = makeTable(logs) as any;

        const { container } = render(
            <table>
                <ActivityTableBody table={table} columnsCount={5} enableOrderSubgrouping />
            </table>,
        );

        const order100Link = screen.getByRole("link", { name: "100" });
        const order200Link = screen.getByRole("link", { name: "200" });
        expect(order100Link).toBeInTheDocument();
        expect(order200Link).toBeInTheDocument();
        expect(screen.getByText("User wasim@example.com (2)")).toBeInTheDocument();
        expect(screen.getByText("User himani@gmail.com (1)")).toBeInTheDocument();

        expect(order100Link).toHaveAttribute("href", "/orders/view/100");
        expect(order100Link).toHaveAttribute("target", "_blank");
        expect(order100Link).toHaveAttribute("rel", "noopener noreferrer");
        expect(order200Link).toHaveAttribute("href", "/orders/view/200");

        const text = (container.textContent ?? "").replace(/\s+/g, " ").trim();
        expect(text.indexOf("Order #100 (2)")).toBeLessThan(text.indexOf("Order #200 (1)"));
        expect(text.indexOf("Order #200 (1)")).toBeLessThan(text.indexOf("User wasim@example.com (2)"));
        expect(text.indexOf("User wasim@example.com (2)")).toBeLessThan(text.indexOf("User himani@gmail.com (1)"));
    });

    it("renders regular flat rows when enableOrderSubgrouping is false", () => {
        const logs = [
            makeLog({ id: "1", orderId: "100", details: "viewed order 100" }),
            makeLog({ id: "2", orderId: "200", details: "viewed order 200" }),
        ];

        const table = makeTable(logs) as any;

        render(
            <table>
                <ActivityTableBody table={table} columnsCount={5} enableOrderSubgrouping={false} />
            </table>,
        );

        expect(screen.queryByText(/Order #100/)).not.toBeInTheDocument();
        expect(screen.queryByText(/User/)).not.toBeInTheDocument();
    });
});
