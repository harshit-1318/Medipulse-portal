import { Mail } from 'lucide-react';

interface EmailInputProps {
    value: string;
    onChange: (val: string) => void;
    isDark?: boolean;
}

export default function EmailInput({ value, onChange, isDark = true }: EmailInputProps) {
    return (
        <div className="space-y-1.5">
            <label className={`block text-[11px] font-bold uppercase tracking-wider ml-0.5 transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
                EMAIL
            </label>
            <div className="relative group/input">
                <input
                    type="email"
                    required
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full h-11.5 pl-10.5 pr-4 rounded-xl outline-none text-sm font-medium transition-all duration-200 ${
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
                    <Mail size={17} strokeWidth={2.2} />
                </div>
            </div>
        </div>
    );
}
