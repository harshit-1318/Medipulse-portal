import { FileSearch } from 'lucide-react';

interface DocmanJobsHeaderProps {
}

export default function DocmanJobsHeader({}: DocmanJobsHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-1 animate-in fade-in duration-500">
            <div className="p-2.5 bg-teal-50 text-[#00a294] rounded-xl border border-teal-100/60 shadow-sm transition-transform duration-300 hover:rotate-3">
                <FileSearch size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
                Docman Jobs
            </h1>
        </div>
    );
}
