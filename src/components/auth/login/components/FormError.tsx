import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
    error: string;
    isDark?: boolean;
}

export default function FormError({ error, isDark = true }: FormErrorProps) {
    if (!error) return null;
    return (
        <div 
            role="alert"
            className={`p-3 rounded-xl backdrop-blur-md border text-xs font-semibold transition-all animate-in fade-in slide-in-from-top-1 ${
                isDark
                    ? 'bg-red-950/40 border-red-900/60 text-red-200 shadow-sm'
                    : 'bg-red-50/90 border-red-200 text-red-700 shadow-xs'
            }`}
        >
            <div className="flex items-center gap-2.5">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span className="leading-snug">{error}</span>
            </div>
        </div>
    );
}
