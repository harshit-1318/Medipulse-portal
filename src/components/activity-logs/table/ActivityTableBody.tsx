import { type Table } from "@tanstack/react-table";
import { Fragment } from "react";
import { ActivityTableRow } from "./ActivityTableRow";
import { TableSkeletonRows, TableEmptyState } from "./ActivityTablePlaceholders";
import { groupActivityRows } from "../utils";

interface Props {
    table: Table<any>;
    columnsCount: number;
    loading?: boolean;
    enableOrderSubgrouping?: boolean;
}

export function ActivityTableBody({ table, columnsCount, loading, enableOrderSubgrouping = false }: Props) {
    const finalColumnsCount = columnsCount + 1;

    if (loading) return <TableSkeletonRows />;

    const rows = table.getRowModel().rows;
    if (rows.length === 0) return <TableEmptyState columnsCount={finalColumnsCount} />;

    if (!enableOrderSubgrouping) {
        return (
            <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row) => (
                    <ActivityTableRow key={row.id} log={row.original} />
                ))}
            </tbody>
        );
    }

    const { groupedRows, noOrderRowsByUser } = groupActivityRows(rows);

    return (
        <tbody className="divide-y divide-slate-100 bg-[#ffffff]">
            {Array.from(groupedRows.entries()).map(([orderId, orderRows]) => (
                <Fragment key={`group-${orderId}`}>
                    <tr className="bg-slate-50/90 border-y border-slate-100">
                        <td colSpan={finalColumnsCount} className="px-5 py-2.5">
                            <div className="text-xs font-extrabold tracking-wide uppercase text-[#003B73]">
                                <span>Order #</span>
                                <a
                                    href={`/orders/view/${encodeURIComponent(orderId)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 decoration-indigo-300 hover:text-indigo-700 transition-colors"
                                >
                                    {orderId}
                                </a>
                                <span>{` (${orderRows.length})`}</span>
                            </div>
                        </td>
                    </tr>
                    {orderRows.map((row) => (
                        <ActivityTableRow key={row.id} log={row.original} />
                    ))}
                </Fragment>
            ))}
            {Array.from(noOrderRowsByUser.entries()).map(([userKey, userGroup]) => (
                <Fragment key={`user-${userKey}`}>
                    <tr className="bg-slate-50/90 border-y border-slate-100">
                        <td colSpan={finalColumnsCount} className="px-5 py-2.5">
                            <div className="text-[#64748b] text-xs font-extrabold tracking-wide uppercase">
                                {`User ${userGroup.label} (${userGroup.rows.length})`}
                            </div>
                        </td>
                    </tr>
                    {userGroup.rows.map((row) => (
                        <ActivityTableRow key={row.id} log={row.original} />
                    ))}
                </Fragment>
            ))}
        </tbody>
    );
}

