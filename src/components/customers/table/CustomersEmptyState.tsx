import { SearchX } from 'lucide-react';

export default function CustomersEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-sm relative group">
                <SearchX size={42} strokeWidth={1.5} className="group-hover:scale-110 group-hover:text-amber-400 group-hover:rotate-6 transition-all duration-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm animate-bounce">!</div>
            </div>
            
            <h3 className="text-[20px] font-bold text-slate-800 tracking-tight mb-2">No Customers Found</h3>
            <p className="text-[14px] font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn't find any customers matching your current filters. 
                Try adjusting your search terms or clearing the filters to see more results.
            </p>
            
            <div className="mt-8 flex gap-3">
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[13.5px] hover:bg-slate-50 transition-all active:scale-95"
                >
                    Refresh List
                </button>
            </div>
        </div>
    );
}
