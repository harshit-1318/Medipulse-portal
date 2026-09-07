export default function FormActions() {
    return (
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
                type="button" 
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
            >
                Save Changes
            </button>
        </div>
    );
}
