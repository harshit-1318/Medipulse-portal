
interface OrderFiltersFooterProps {
    onClear: () => void;
    onClose: () => void;
}

export const OrderFiltersFooter = ({ onClear, onClose }: OrderFiltersFooterProps) => {
    return (
        <div className="flex justify-end items-center gap-3 px-6 md:px-8 py-3 border-t border-slate-100 bg-white">
            <button
                onClick={onClear}
                className="px-4 py-2 text-[13.5px] rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
            >
                Clear All
            </button>
            <button
                onClick={onClose}
                className="px-7 py-2 text-[13.5px] rounded-xl bg-[#00a294] text-white font-bold hover:bg-[#008f82] shadow-md shadow-[#00a294]/25 hover:shadow-lg hover:shadow-[#00a294]/35 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
                Search
            </button>
        </div>
    );
};
