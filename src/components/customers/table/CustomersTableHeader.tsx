import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, User, Mail, Hash, Calendar, FileText, Package } from "lucide-react";

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
                                    onClick={canSort ? () => onSort(h.column.id) : undefined}
                                    className="flex items-center gap-1 select-none hover:text-[#00a294] transition-colors justify-center w-full group cursor-pointer">
                                    <div className="flex items-center gap-2 group-hover:scale-102 transition-transform duration-300">
                                        {Icon && <Icon size={14} strokeWidth={2.5} className="text-slate-400 group-hover:text-[#00a294] transition-colors" />}
                                        <span className="text-[13px] font-extrabold font-montserrat tracking-widest text-[#003B73]/80 uppercase">
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </span>
                                    </div>

                                    {canSort && (
                                        <span className="ml-1.5 flex items-center">
                                            {sorted === "asc" ? (
                                                <ArrowUp size={14} className="text-[#00a294] animate-in slide-in-from-bottom-1 duration-300" />
                                            ) : sorted === "desc" ? (
                                                <ArrowDown size={14} className="text-[#00a294] animate-in slide-in-from-top-1 duration-300" />
                                            ) : null}
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
