import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    label: string;
    isOpen: boolean;
    isLast: boolean;
    onToggle: () => void;
    menu: any;
}

export const BreadcrumbDropdown: React.FC<Props> = ({ label, isOpen, isLast, onToggle, menu }) => {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`flex items-center gap-1 font-semibold tracking-tight transition-all duration-200 ${isOpen ? 'text-[#3eb489]' : isLast ? 'text-slate-700' : 'text-slate-400 hover:text-[#3eb489]'}`}
            >
                {label}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-100 overflow-y-auto max-h-[80vh] custom-scrollbar"
                    >
                        <div className="flex flex-col">
                            {menu.children?.map((item: any) => {
                                const Icon = item.icon;
                                const isActive = window.location.pathname === item.path;
                                return (
                                    <a
                                        key={item.title} href={item.path}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-[13.5px] ${isActive ? 'bg-slate-50 text-[#00a294] font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-[#00a294]' : 'text-slate-400'} />
                                        {item.title}
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
