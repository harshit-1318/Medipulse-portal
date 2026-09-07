import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import LeadStatusBadge from '../components/LeadStatusBadge';
import type { LeadStatus } from '@/types/lead';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'closed', 'lost'];

interface StatusSelectorProps {
    current: LeadStatus;
    onChange: (s: LeadStatus) => void;
    disabled: boolean;
}

export function StatusSelector({ current, onChange, disabled }: StatusSelectorProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
                <LeadStatusBadge status={current} />
                <ChevronDown size={13} className="text-slate-400" />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <m.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden"
                        >
                            {STATUSES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { onChange(s); setOpen(false); }}
                                    className="w-full flex items-center px-3 py-2.5 hover:bg-slate-50 transition-colors"
                                >
                                    <LeadStatusBadge status={s} />
                                </button>
                            ))}
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
