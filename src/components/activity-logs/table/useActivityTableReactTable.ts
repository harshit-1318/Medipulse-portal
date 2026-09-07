import { useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import type { ActivityLogType } from "@/api/services/log/logService";
import { useActivityColumns } from "./useActivityColumns";

export function useActivityTableReactTable(
    logs: ActivityLogType[],
    onSort?: (column: string) => void
) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const columns = useActivityColumns();

    const table = useReactTable({
        data: logs,
        columns,
        state: { sorting },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(nextSorting);
            if (nextSorting.length > 0) {
                onSort?.(nextSorting[0].id);
            }
        },
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return { table, columns };
}
