import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, User, FileText, Clock, Users, Layers, Package, ExternalLink } from "lucide-react";

interface Props {
    table: Table<any>;
}

const ICON_MAP: Record<string, any> = { 
    id: ExternalLink, 
    shopify_order_id: ExternalLink,
    date: Clock, 
    createdAt: Clock,
    status: Layers,
    customer: User, 
    customerName: User,
    repeatedOrders: Users,
    products: Package,
    documentsUploaded: FileText,
    docs: FileText,
    actions: FileText 
};

/**
 * Renders the table header with sorting controls for Order Table.
 */
export function OrderTableHeader({ table }: Props) {
    return (
        <thead className="bg-[#f8fafc] text-slate-800 sticky top-0 z-20 border-b border-slate-100 shadow-sm font-montserrat">
            {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                    {hg.headers.map((h) => {
                        const canSort = h.column.getCanSort();
                        const sorted = h.column.getIsSorted();
                        const Icon = ICON_MAP[h.column.id] || ICON_MAP[(h.column.columnDef as any).accessorKey];

                        return (
                            <th key={h.id} className="px-5 py-4 font-bold whitespace-nowrap border-b border-slate-100 text-center group/th">
                                <button type="button" 
                                    onClick={canSort ? () => {
                                    const isSorted = h.column.getIsSorted();
                                    if (!isSorted) h.column.toggleSorting(false);
                                    else if (isSorted === "asc") h.column.toggleSorting(true);
                                    else h.column.toggleSorting(undefined);
                                } : undefined} 
                                    className="flex items-center gap-1 select-none hover:text-indigo-600 transition-colors justify-center w-full group">
                                    <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                                        {Icon && <Icon size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />}
                                        <span className="text-[14px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80 uppercase">
                                            {typeof h.column.columnDef.header === 'function' 
                                                ? flexRender(h.column.columnDef.header, h.getContext())
                                                : h.column.columnDef.header}
                                        </span>
                                    </div>
                                    {canSort && (
                                        <span className="ml-1.5 flex items-center">
                                            {sorted === "asc" ? (
                                                <ArrowUp size={14} className="text-indigo-600 animate-in slide-in-from-bottom-1 duration-300" />
                                            ) : sorted === "desc" ? (
                                                <ArrowDown size={14} className="text-indigo-600 animate-in slide-in-from-top-1 duration-300" />
                                            ) : (
                                                <ArrowUpDown size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                            )}
                                        </span>
                                    )}
                                </button>
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
}
