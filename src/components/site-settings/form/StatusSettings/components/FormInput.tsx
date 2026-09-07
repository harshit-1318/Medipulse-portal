import { Eye, EyeOff } from "lucide-react";
import type { FormInputProps } from "../types";

export const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    name, 
    placeholder, 
    isPassword = false, 
    icon: Icon,
    value,
    onChange,
    showTokens,
    toggleToken
}) => (
    <div className="space-y-1.5 w-full">
        <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />}
            <input
                type={isPassword && !showTokens[name] ? "password" : "text"}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full h-11 ${Icon ? 'pl-10' : 'px-4'} ${isPassword ? 'pr-10' : ''} rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-700 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none`}
            />
            {isPassword && (
                <button type="button" onClick={() => toggleToken(name)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showTokens[name] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
        {isPassword && <p className="text-[12px] text-slate-400 flex items-center gap-1 mt-1">ⓘ Sensitive information - handle with care</p>}
    </div>
);
