import { useEffect } from 'react';
import type { SortingState } from "@tanstack/react-table";

export function useSortingStateSync(
    sorting: SortingState,
    sortBy: string,
    sort: string,
    setSortBy: (s: string) => void,
    setSort: (s: string) => void,
    setPage: (p: number) => void,
    defaultSortBy: string,
    defaultSortOrder: string,
) {
    useEffect(() => {
        const firstSort = sorting[0];
        if (firstSort) {
            const newSortBy = firstSort.id;
            const newSortOrder = firstSort.desc ? "desc" : "asc";
            if (sortBy !== newSortBy || sort !== newSortOrder) {
                setSortBy(newSortBy);
                setSort(newSortOrder);
                setPage(1);
            }
        } else {
            if (sortBy !== defaultSortBy || sort !== defaultSortOrder) {
                setSortBy(defaultSortBy);
                setSort(defaultSortOrder);
            }
        }
    }, [sorting, sortBy, sort, setSortBy, setSort, setPage, defaultSortBy, defaultSortOrder]);
}
