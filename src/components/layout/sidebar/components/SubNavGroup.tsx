import { motion, AnimatePresence } from 'framer-motion';
import type { NavItem } from '../types';

interface SubNavGroupProps {
    subOpen: boolean;
    currentPath: string;
    children: NavItem[];
}

export const SubNavGroup = ({ subOpen, currentPath, children }: SubNavGroupProps) => {
    return (
        <AnimatePresence initial={false}>
            {subOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                >
                    <div className="flex flex-col gap-1.5 pl-7 pr-1 py-1 text-[13px]">
                        {children.map((subChild, subIndex) => {
                            const subActive = currentPath === subChild.path;
                            const SubIcon = subChild.icon;
                            return (
                                <a
                                    key={subIndex}
                                    href={subChild.path}
                                    className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 
                                        ${subActive
                                            ? 'text-[#00a294] font-bold bg-[#00a294]/10'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-semibold'
                                        }`}
                                >
                                    {SubIcon && (
                                        <SubIcon
                                            size={16}
                                            className={`shrink-0 transition-all duration-300 ${subActive ? 'text-[#00a294] scale-110' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}`}
                                            strokeWidth={subActive ? 2 : 1.5}
                                        />
                                    )}
                                    <span className="flex-1 min-w-0 text-left tracking-tight leading-snug whitespace-normal pr-1">{subChild.title}</span>

                                    {subActive && (
                                        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#00a294] shadow-[0_0_8px_rgba(0,162,148,0.4)]" />
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
