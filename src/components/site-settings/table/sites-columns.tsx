import { createColumnHelper } from "@tanstack/react-table";
import type { Site } from "@/types/site";
import { NameCell, UrlCell, StatusCell, ActionsCell } from "./SiteTableCells";

const columnHelper = createColumnHelper<Site>();

export const getSiteColumns = () => [
    columnHelper.accessor("name", {
        header: "Instance Name",
        cell: (info) => <NameCell name={info.getValue()} logo={info.row.original.logo} />,
    }),
    columnHelper.accessor("url", {
        header: "Primary Domain",
        cell: (info) => <UrlCell url={info.getValue()} />,
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusCell active={info.getValue() === "active"} />,
    }),
    columnHelper.accessor("totalUsers", {
        header: "Total Users",
        cell: (info) => <span className="font-mono">{info.getValue()?.toLocaleString()}</span>,
    }),
    columnHelper.accessor("totalOrders", {
        header: "Total Orders",
        cell: (info) => <span className="font-mono">{info.getValue()?.toLocaleString()}</span>,
    }),
    columnHelper.accessor("id", {
        header: "Actions",
        cell: (info) => <ActionsCell id={info.getValue()} />,
        enableSorting: false,
    }),
];
