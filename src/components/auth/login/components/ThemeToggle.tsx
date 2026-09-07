import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-300 shadow-xs cursor-pointer select-none backdrop-blur-xl ${
                isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/70 text-slate-200 hover:text-white hover:border-cyan-500/40 shadow-black/20'
                    : 'bg-white/85 hover:bg-white border-slate-200/80 text-slate-700 hover:text-slate-950 hover:border-teal-500/40 shadow-slate-200/60'
            }`}
        >
            {isDark ? (
                <>
                    <Sun size={14} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                    <span className="tracking-wide">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon size={14} className="text-indigo-500 transition-transform duration-300 group-hover:-rotate-12" />
                    <span className="tracking-wide">Dark Mode</span>
                </>
            )}
        </button>
    );
}
