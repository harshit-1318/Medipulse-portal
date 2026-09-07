import { useState } from 'react';
import { Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NoticeButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex items-center justify-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-200/50 transition-colors text-slate-500 hover:text-slate-800 focus:outline-none"
                aria-label="Notifications"
            >
                <Bell size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-100/50">
                                <h3 className="font-montserrat font-semibold text-slate-800 tracking-tight">
                                    Notifications
                                </h3>
                            </div>

                            <div className="flex items-center justify-center p-8 min-h-40 text-sm text-slate-400 font-montserrat">
                                No new notifications
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
