import React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
interface Props {
    table: Table<any>;
    columnsCount: number;
    loading?: boolean;
}
/**
 * Renders the table body for Order Table, including empty states.
 */
export function OrderTableBody({ table, columnsCount, loading }: Props) {
    return (
        <tbody>
            {loading ? (
                <tr>
                    <td colSpan={columnsCount} className="py-12 text-center">
                        <div className="flex justify-center items-center space-x-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-[#00B3CC]"></div>
                            <span className="text-[#003B73] font-medium animate-pulse text-sm">Loading data...</span>
                        </div>
                    </td>
                </tr>
            ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                    <td colSpan={columnsCount} className="py-6 text-center text-gray-500">
                        No results
                    </td>
                </tr>
            ) : (
                table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                        <tr className={`group transition-colors last:border-0 hover:bg-slate-50/50 ${(row.original.isParked && row.original.internalNotes?.length > 0) ? "" : "border-b border-slate-100"}`}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-5 py-3.5 whitespace-nowrap align-middle text-center"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                        {row.original.isParked && row.original.internalNotes?.length > 0 && (
                            <tr className="border-b border-amber-100/40 bg-amber-50/10">
                                <td colSpan={5} className="px-5 pb-2.5 pt-0 text-left">
                                    <div className="flex items-start gap-1.5">
                                        <svg className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <span className="text-[13px] font-montserrat text-slate-500 font-medium leading-snug">
                                            <span className="text-amber-600 font-bold mr-1">Note:</span>
                                            {row.original.internalNotes[0].note.length > 100
                                                ? <>{row.original.internalNotes[0].note.slice(0, 100)}&hellip;<a href={`/orders/view/${row.original.shopify_order_id}`} className="text-amber-600 underline font-semibold ml-1 hover:text-amber-700">Read more</a></>
                                                : row.original.internalNotes[0].note
                                            }
                                        </span>
                                    </div>
                                </td>
                                <td colSpan={columnsCount - 5} />
                            </tr>
                        )}
                    </React.Fragment>
                ))
            )}
        </tbody>
    );
}
