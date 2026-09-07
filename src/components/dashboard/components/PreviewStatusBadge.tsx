
export const renderStatus = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'ON HOLD') return <span className="text-[12px] font-bold text-[#EAB308] border border-[#FDE047] bg-[#FEFCE8] px-3.5 py-1 rounded-full tracking-wide">{s}</span>;
    if (s === 'COMPLETED') return <span className="text-[12px] font-bold text-[#10B981] border border-[#6EE7B7] bg-[#ECFDF5] px-3.5 py-1 rounded-full tracking-wide">{s}</span>;
    if (s === 'PROCESSING') return <span className="text-[12px] font-bold text-[#3B82F6] border border-[#93C5FD] bg-[#EFF6FF] px-3.5 py-1 rounded-full tracking-wide">{s}</span>;
    if (s === 'FULFILLED') return <span className="text-[12px] font-bold text-emerald-700 border border-emerald-200/80 bg-emerald-50 px-3.5 py-1 rounded-full tracking-wide">{s}</span>;
    if (s === 'UNFULFILLED') return <span className="text-[12px] font-bold text-red-600 border border-red-200/80 bg-red-50 px-3.5 py-1 rounded-full tracking-wide">{s}</span>;
    return <span className="text-[12px] font-bold text-slate-500 border border-slate-200 bg-slate-50 px-3.5 py-1 rounded-full tracking-wide">{s || 'UNKNOWN'}</span>;
};

export const renderDocs = (docs: string | null) => {
    if (docs && docs.toLowerCase() === 'uploaded') {
        return <span className="text-[12px] font-bold text-[#10B981] border border-[#D1FAE5] bg-white px-3.5 py-1 rounded-full tracking-wide">Uploaded</span>;
    }
    return <span className="text-[12px] font-bold text-red-500 border border-red-100 bg-white px-3.5 py-1 rounded-full tracking-wide">Missing</span>;
};
