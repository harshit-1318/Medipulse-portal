import type { SortingState } from "@tanstack/react-table";
import { useEffect } from "react";

export function useOrderTableEffects({
    loading,
}: {
    loading: boolean;
    sorting?: SortingState;
    setPage?: (n: number) => void;
    setFilters?: (f: any) => void;
}) {
    // FULLSCREEN LOADER
    useEffect(() => {
        const loader = document.getElementById("fullScreenLoader");
        if (!loader) return;

        if (loading) loader.classList.remove("hidden");
        else loader.classList.add("hidden");
    }, [loading]);
}

