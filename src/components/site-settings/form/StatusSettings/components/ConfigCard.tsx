import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ConfigCardProps } from "../types";

export const ConfigCard: React.FC<ConfigCardProps> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="mt-3 overflow-hidden">
            <button 
                onClick={onToggle}
                className="flex items-center gap-2.5 py-2 text-[12px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors w-full text-left outline-none group/card"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="p-1 px-1.5 rounded-lg group-hover/card:bg-indigo-50 transition-colors"
                >
                    <ChevronDown size={12} className="text-slate-400 group-hover/card:text-indigo-500" />
                </motion.div>
                {title}
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="pt-3 pb-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
