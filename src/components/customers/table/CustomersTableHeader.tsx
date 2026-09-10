import { useState, useEffect } from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, User, Mail, Hash, Calendar, FileText, Package } from "lucide-react";

interface Props { 
    table: Table<any>; 
    onSort: (columnId: string) => void;
}

const ICON_MAP: Record<string, any> = {
    name: User,
    email: Mail,
    customerId: Hash,
    totalPens: Package,
    createdAt: Calendar,
    actions: FileText
};

export default function CustomersTableHeader({ table, onSort }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <thead className="bg-[#f8fafc] text-slate-800 sticky top-0 z-20 border-b border-slate-100 shadow-sm font-montserrat">
            {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                    {hg.headers.map((h) => {
                        const canSort = h.column.getCanSort();
                        const sorted = mounted ? h.column.getIsSorted() : false;
                        const Icon = ICON_MAP[h.column.id] || ICON_MAP[(h.column.columnDef as any).accessorKey];

                        return (
                            <th key={h.id} className="px-5 py-4 font-bold whitespace-nowrap border-b border-slate-100 text-center group/th">
                                <button type="button"
                                    onClick={canSort ? () => onSort(h.column.id) : undefined}
                                    className="flex items-center gap-1 select-none hover:text-indigo-600 transition-colors justify-center w-full group cursor-pointer">
                                    <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                                        {Icon && <Icon size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />}
                                        <span className="text-[14px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80 uppercase">
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </span>
                                    </div>

                                    {canSort && (
                                        <span className="ml-1.5 flex items-center" suppressHydrationWarning>
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
