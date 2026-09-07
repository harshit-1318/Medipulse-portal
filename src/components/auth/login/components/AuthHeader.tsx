import { ShieldCheck } from 'lucide-react';

interface AuthHeaderProps {
    isDark?: boolean;
}

export default function AuthHeader({ isDark = true }: AuthHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-3.5 mb-7 text-center">
            {/* Medical Security Emblem */}
            <div className="relative group/shield">
                <div className={`absolute -inset-1 rounded-2xl blur-md opacity-40 transition-opacity duration-500 ${
                    isDark ? 'bg-cyan-400/40' : 'bg-teal-500/30'
                }`} />
                <div className={`relative p-3 rounded-2xl shadow-lg transition-all duration-300 ${
                    isDark 
                        ? 'bg-linear-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 ring-1 ring-white/20' 
                        : 'bg-linear-to-tr from-teal-500 to-cyan-600 text-white shadow-teal-500/25 ring-1 ring-teal-400/30'
                }`}>
                    <ShieldCheck size={26} strokeWidth={2.4} />
                </div>
            </div>

            <div className="space-y-1">
                <h1 className={`text-2xl sm:text-[28px] font-extrabold tracking-tight transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-slate-900'
                }`}>
                    Welcome Back
                </h1>
                <p className={`font-medium text-sm transition-colors duration-300 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                    Login to Continue
                </p>
            </div>
        </div>
    );
}
