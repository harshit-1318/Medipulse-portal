import { createColumnHelper } from "@tanstack/react-table";
import type { ActivityLogType } from "@/api/services/log/logService";

const columnHelper = createColumnHelper<ActivityLogType>();

export const useActivityColumns = () => {
    return [
        columnHelper.accessor("action", {
            header: "Action",
            size: 180,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("userName", {
            header: "User",
            size: 240,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("orderId", {
            header: "Subject",
            size: 160,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("page", {
            header: "Page",
            size: 140,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("createdAt", {
            header: "Date",
            size: 180,
            cell: (info) => info.getValue(),
        }),
    ];
};
