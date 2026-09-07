import { ClipboardList } from './TableIcons';

export default function PrescriptionsEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center p-20 bg-white min-h-[450px] font-montserrat">
            <div className="relative mb-6">
                <div className="h-24 w-24 rounded-4xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 rotate-6" />
                <div className="absolute inset-0 h-24 w-24 rounded-4xl bg-white border border-slate-200 shadow-xl flex items-center justify-center text-brand-cyan -rotate-6 transition-transform hover:rotate-0 duration-500">
                    <ClipboardList size={40} strokeWidth={1.5} />
                </div>
            </div>
            <h3 className="text-[20px] font-extrabold text-[#003B73] tracking-tight">No Prescriptions Found</h3>
            <p className="text-slate-400 font-medium text-[14px] mt-2 max-w-sm text-center leading-relaxed">
                We couldn't find any prescriptions matching your current filters. <br/>
                Try adjusting your search or clearing all filters.
            </p>
        </div>
    );
}
