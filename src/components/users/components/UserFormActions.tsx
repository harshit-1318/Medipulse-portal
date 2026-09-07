import { Save, X, UserPlus } from 'lucide-react';

interface UserFormActionsProps {
    isEditMode: boolean;
    isSubmitting: boolean;
}

export default function UserFormActions({ isEditMode, isSubmitting }: UserFormActionsProps) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-end gap-5 pt-4 border-t border-slate-50 mt-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <a
                    href="/users"
                    className="w-full md:w-auto flex items-center justify-center gap-2.5 px-8 py-4 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-[15px] transition-all duration-300 group"
                >
                    <X size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    <span>Cancel</span>
                </a>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto flex items-center justify-center gap-4 px-16 py-4 bg-linear-to-r from-[#00A294] via-[#00A294] to-[#008F83] hover:from-[#008F83] hover:to-[#007B70] text-white rounded-2xl font-bold text-[16px] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,162,148,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(0,162,148,0.6)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:scale-100 disabled:shadow-none relative overflow-hidden group/btn"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    {isEditMode ? <Save size={21} /> : <UserPlus size={22} />}
                    <span className="relative z-10">{isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}</span>
                </button>
            </div>
        </div>
    );
}
