import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useOrderFilters } from "../filters";

describe("useOrderFilters", () => {
    it("should initialize with default filters", () => {
        const setFilters = vi.fn();
        const setPage = vi.fn();
        const { result } = renderHook(() => useOrderFilters({ customer: "John" }, setFilters, setPage));

        expect(result.current.localCustomerName).toBe("John");
    });

    it("should allow clearing all filters", () => {
        const setFilters = vi.fn();
        const setPage = vi.fn();
        const { result } = renderHook(() => useOrderFilters({ customer: "John" } as any, setFilters, setPage));

        act(() => {
            result.current.clearFilters();
        });

        expect(setPage).toHaveBeenCalledWith(1);
        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));
        
        // Execute the function passed to setFilters and verify outcome
        const updater = setFilters.mock.calls[0][0];
        const resultFilters = updater({ customer: "John" });
        expect(resultFilters).toMatchObject({ customer: "", orderId: "", isUrgent: false });
        
        expect(result.current.localCustomerName).toBe("");
    });

    it("should preserve isUrgent: true when clearing filters on the urgent page", () => {
        const setFilters = vi.fn();
        const setPage = vi.fn();
        const { result } = renderHook(() => useOrderFilters({ customer: "John", isUrgent: true } as any, setFilters, setPage, "urgent"));

        act(() => {
            result.current.clearFilters();
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));
        const updater = setFilters.mock.calls[0][0];
        const resultFilters = updater({ isUrgent: true });
        expect(resultFilters.isUrgent).toBe(true);
        expect(result.current.localCustomerName).toBe("");
    });
});
