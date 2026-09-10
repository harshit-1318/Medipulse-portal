import { Building2, Globe2, Eye, Pencil } from "lucide-react";
import { ActionButton } from "@/components/common";

export const NameCell = ({ name, logo }: { name: string, logo?: string }) => (
    <div className="flex items-center justify-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
                <img src={logo} alt={name} className="w-full h-full object-contain p-0.5" />
            ) : (
                <Building2 size={18} className="text-slate-400" />
            )}
        </div>
        <div className="flex flex-col items-start text-left">
            <span className="text-[14px] font-semibold text-slate-900 leading-none">{name}</span>
            <span className="text-[12px] text-slate-500 mt-1">Instance Name</span>
        </div>
    </div>
);

export const UrlCell = ({ url }: { url: string }) => (
    <div className="flex items-center justify-center gap-2 group cursor-pointer">
        <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Globe2 size={14} />
        </div>
        <span className="text-[13px] font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
            {url || "—"}
        </span>
    </div>
);

export const StatusCell = ({ active }: { active: boolean }) => (
    <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide ${
        active 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
            : "bg-slate-50 text-slate-600 border border-slate-200/50"
    }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
        {active ? "Active" : "Paused"}
    </span>
);

export const ActionsCell = ({ id }: { id: string }) => (
    <div className="flex items-center justify-center gap-2">
        <ActionButton
            icon={Eye}
            label="View"
            variant="cyan"
            href={`/sites/${id}`}
        />
        <ActionButton
            icon={Pencil}
            label="Edit"
            variant="slate"
            href={`/sites/${id}/edit`}
        />
    </div>
);
