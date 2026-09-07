
interface Props {
    onClear: () => void;
    onClose: () => void;
}

export const SiteFiltersFooter: React.FC<Props> = ({ onClear, onClose }) => {
    return (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
            <button
                onClick={onClear}
                className="h-10 px-5 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all active:scale-95 flex items-center justify-center"
            >
                Clear All
            </button>

            <button
                onClick={onClose}
                className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center"
            >
                Close
            </button>
        </div>
    );
};
