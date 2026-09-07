
interface Props {
    saving: boolean;
    isEditMode: boolean;
    onSubmit: () => void;
}

export const SiteSettingsFooter: React.FC<Props> = ({ saving, isEditMode, onSubmit }) => {
    return (
        <div className="flex items-center justify-end gap-4 p-6 bg-white rounded-3xl border border-slate-200/60 shadow-lg">
            <button 
                onClick={() => window.location.href = '/sites'}
                className="px-8 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[15px] rounded-2xl transition-all"
            >
                Discard Changes
            </button>
            <button
                onClick={onSubmit}
                disabled={saving}
                className="px-8 py-3.5 bg-[#00A294] hover:bg-[#008F83] text-white font-bold text-[15px] rounded-2xl shadow-lg shadow-teal-100 transition-all active:scale-95 disabled:opacity-50"
            >
                {saving ? "Processing..." : isEditMode ? "Update Site" : "Confirm Creation"}
            </button>
        </div>
    );
};
