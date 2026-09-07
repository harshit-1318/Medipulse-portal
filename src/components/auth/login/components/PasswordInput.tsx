import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (val: string) => void;
    isDark?: boolean;
}

export default function PasswordInput({ value, onChange, isDark = true }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-0.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                    Password
                </label>
            </div>
            <div className="relative group/input">
                <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full h-11.5 pl-10.5 pr-11 rounded-xl outline-none text-sm font-medium transition-all duration-200 ${
                        isDark
                            ? 'bg-slate-950/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:bg-slate-900/90 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15'
                            : 'bg-slate-50/90 hover:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 shadow-xs'
                    }`}
                />
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                    isDark 
                        ? 'text-slate-500 group-focus-within/input:text-cyan-400' 
                        : 'text-slate-400 group-focus-within/input:text-teal-600'
                }`}>
                    <Lock size={17} strokeWidth={2.2} />
                </div>
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isDark 
                            ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60' 
                            : 'text-slate-400 hover:text-teal-600 hover:bg-slate-200/60'
                    }`}
                >
                    {showPassword ? <EyeOff size={17} strokeWidth={2.2} /> : <Eye size={17} strokeWidth={2.2} />}
                </button>
            </div>
        </div>
    );
}
