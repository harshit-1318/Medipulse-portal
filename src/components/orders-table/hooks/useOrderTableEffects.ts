import type { SortingState } from "@tanstack/react-table";
import { useEffect } from "react";
import { normalizeSortBy } from "@/utils/url/urlBase";

export function useOrderTableEffects({
    loading,
    sorting,
    setFilters,
}: {
    loading: boolean;
    sorting: SortingState;
    setPage: (n: number) => void;
    setFilters: (f: any) => void;
}) {
    // FULLSCREEN LOADER
    useEffect(() => {
        const loader = document.getElementById("fullScreenLoader");
        if (!loader) return;

        if (loading) loader.classList.remove("hidden");
        else loader.classList.add("hidden");
    }, [loading]);

    // SORTING → BACKEND (Standardized to sortBy and sortDir)
    useEffect(() => {
        const s = sorting?.[0];
        const rawSortBy = s ? String(s.id || "").trim() : "createdAt";
        const newSortBy = normalizeSortBy(rawSortBy);
        const newSortDir = s ? (s.desc ? "desc" : "asc") : "asc";

        setFilters((prev: any) => {
            if (!prev) return prev;
            
            if (prev.sortBy === newSortBy && prev.sort === newSortDir) {
                return prev;
            }

            return { ...prev, sortBy: newSortBy, sort: newSortDir };
        });
    }, [sorting]);
}
