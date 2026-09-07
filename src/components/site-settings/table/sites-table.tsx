import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { SitesTableProps } from "@/types/site";
import { SitesTableHeader } from "./SitesTableHeader";
import { SitesTableEmpty } from "./SitesTableEmpty";
import { Pagination } from "@/components/common/Pagination";

export default function SitesTable({
    data, loading, total, page, setPage, sorting, setSorting, columns 
}: SitesTableProps & { columns: any[] }) {
    const table = useReactTable({
        data, columns, state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
    });

    const totalPages = Math.max(1, Math.ceil(total / 10));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-montserrat flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                            Sites List
                        </h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {total}
                        </span>
                    </div>
                    <div className="w-12 h-[3px] bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1.5 rounded-full shadow-sm" />
                </div>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full">
                    <SitesTableHeader table={table} />
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded-md w-full" /></td>
                                    ))}
                                </tr>
                            ))
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100 last:border-0">
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <td key={cell.id} className="px-5 py-4 align-middle text-[14px] text-slate-700 whitespace-nowrap text-center">
                                                <div className="flex w-full items-center justify-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={columns.length}><SitesTableEmpty /></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-5 py-3 bg-white border-t border-slate-200">
                <Pagination 
                    currentPage={page} totalPages={totalPages} 
                    onPageChange={setPage} 
                />
            </div>
        </div>
    );
}
