import React from 'react';

export const DocmanJobsEmptyState: React.FC = () => (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in zoom-in duration-700">
        <div className="mx-auto w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 group ring-1 ring-slate-100 hover:ring-indigo-100 transition-all duration-500">
            <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">No Results Found</h3>
        <p className="text-slate-400 text-[15px] max-w-sm mx-auto font-medium">
            We couldn't find any jobs matching your search or filters. Try adjusting your criteria.
        </p>
        <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-[13px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
        >
            Refresh Dashboard
        </button>
    </div>
);
