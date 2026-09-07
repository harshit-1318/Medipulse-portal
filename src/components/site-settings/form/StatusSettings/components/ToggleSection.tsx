import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfigCard } from "./ConfigCard";
import type { ToggleSectionProps } from "../types";

export const ToggleSection: React.FC<ToggleSectionProps> = ({ 
    label, 
    name, 
    checked, 
    title, 
    children, 
    handleSwitchChange 
}) => {
    const [isCardOpen, setIsCardOpen] = useState(true);

    return (
        <div className={`py-4 border-b border-slate-100 last:border-0 transition-all duration-300 ${checked ? 'bg-slate-50/40 rounded-2xl px-4 -mx-4' : 'px-0'}`}>
            <label className="flex items-center gap-3.5 cursor-pointer group w-fit select-none">
                <div className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleSwitchChange(name, e.target.checked)}
                        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
                    />
                    <motion.div 
                        initial={false}
                        animate={{
                            backgroundColor: checked ? "#4f46e5" : "#ffffff",
                            borderColor: checked ? "#4f46e5" : "#cbd5e1",
                            scale: 1,
                        }}
                        whileHover={{ borderColor: checked ? "#4f46e5" : "#818cf8" }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all duration-200"
                    >
                        <AnimatePresence mode="wait">
                            {checked && (
                                <motion.svg 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                    className="w-3.5 h-3.5 text-white" 
                                    viewBox="0 0 14 14" 
                                    fill="none"
                                >
                                    <motion.path 
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.2, delay: 0.05 }}
                                        d="M3 8L6 11L11 3.5" 
                                        strokeWidth={2.5} 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        stroke="currentColor"
                                    />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
                <span className={`text-[15px] font-bold transition-colors duration-200 ${checked ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{label}</span>
            </label>

            <AnimatePresence>
                {checked && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, translateY: -4 }}
                        animate={{ height: "auto", opacity: 1, translateY: 0 }}
                        exit={{ height: 0, opacity: 0, translateY: -4 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <ConfigCard 
                            title={title} 
                            isOpen={isCardOpen} 
                            onToggle={() => setIsCardOpen(!isCardOpen)}
                        >
                            {children}
                        </ConfigCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
