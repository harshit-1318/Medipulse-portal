import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, Globe2, Activity, Users, ShoppingCart, Settings } from "lucide-react";

interface Props {
    table: Table<any>;
}

export const SitesTableHeader: React.FC<Props> = ({ table }) => {
    return (
        <thead className="bg-[#f8fafc] border-b border-slate-200 font-montserrat">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        const HeaderIcon = () => {
                            const iconProps = { size: 14, className: "text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" };
                            switch (header.column.id) {
                                case 'name': return <Building2 {...iconProps} />;
                                case 'url': return <Globe2 {...iconProps} />;
                                case 'status': return <Activity {...iconProps} />;
                                case 'totalUsers': return <Users {...iconProps} />;
                                case 'totalOrders': return <ShoppingCart {...iconProps} />;
                                case 'id': return <Settings {...iconProps} />;
                                default: return null;
                            }
                        };
                        
                        return (
                            <th
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                className="px-5 py-4 text-[14px] font-extrabold text-[#003B73]/80 uppercase tracking-widest cursor-pointer group hover:bg-slate-100/50 transition-colors whitespace-nowrap text-center"
                            >
                                <div className={`flex w-full items-center justify-center gap-2`}>
                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                        <HeaderIcon />
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </div>
                                    {header.column.getCanSort() && (
                                        <span className="transition-colors flex shrink-0">
                                            {{
                                                asc: <ArrowUp size={14} className="text-indigo-600" />,
                                                desc: <ArrowDown size={14} className="text-indigo-600" />,
                                            }[header.column.getIsSorted() as string] ?? (
                                                <ArrowUpDown size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
};
