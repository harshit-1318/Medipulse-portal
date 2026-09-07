import { m, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
    label: string;
    icon: React.ReactNode;
    error?: string;
    children: React.ReactNode;
}

export default function FormField({ label, icon, error, children }: FormFieldProps) {
    return (
        <div className="flex flex-col">
            <label className="text-[14px] font-bold text-slate-700 ml-1 mb-1 tracking-tight">
                {label}
            </label>
            <div className="relative group/field transition-all duration-300">
                <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-[#00A294] transition-colors z-10 flex items-center justify-center pointer-events-none opacity-80 group-focus-within/field:opacity-100">
                    {icon}
                </div>
                {children}
            </div>
            <AnimatePresence>
                {error && (
                    <m.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="text-[12px] text-red-500 font-bold ml-1 flex items-center gap-2 overflow-hidden"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                    </m.p>
                )}
            </AnimatePresence>
        </div>
    );
}
