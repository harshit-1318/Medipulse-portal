import { Clock, X } from 'lucide-react';
import type { RecentSearch } from '@/hooks';

export interface NavItem {
    title: string;
    path: string;
}

export function SkeletonRows() {
    return (
        <div className="px-4 py-3 space-y-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-2/5" />
                        <div className="h-2.5 bg-slate-100 rounded animate-pulse w-3/5" />
                    </div>
                    <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
                </div>
            ))}
        </div>
    );
}

export function RecentSearchList({
    recents,
    onRecentClick,
    onRecentRemove,
    onClearAll,
}: {
    recents: RecentSearch[];
    onRecentClick: (q: string) => void;
    onRecentRemove: (q: string) => void;
    onClearAll: () => void;
}) {
    return (
        <div className="mt-1">
            <div className="flex items-center justify-between px-5 py-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Recent Searches
                </span>
                <button
                    onClick={onClearAll}
                    className="text-[10px] text-slate-400 hover:text-red-500 font-montserrat transition-colors"
                >
                    Clear all
                </button>
            </div>
            <div className="px-2">
                {recents.map((r) => (
                    <div
                        key={r.query}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors mx-1 group"
                    >
                        <Clock size={13} className="text-slate-300 shrink-0" />
                        <button
                            className="flex-1 text-left text-[13px] text-slate-600 font-montserrat truncate"
                            onClick={() => onRecentClick(r.query)}
                        >
                            {r.query}
                        </button>
                        <button
                            onClick={() => onRecentRemove(r.query)}
                            className="p-0.5 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            aria-label={`Remove ${r.query}`}
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function QuickNavList({ navItems, onSelect }: { navItems: NavItem[]; onSelect: () => void }) {
    return (
        <>
            <div className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-4">
                Quick Navigation
            </div>
            <div className="px-2">
                {navItems.map((nav, idx) => (
                    <a
                        key={idx}
                        href={nav.path}
                        className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-montserrat mx-1"
                        onClick={onSelect}
                    >
                        <span className="text-[14px] font-semibold text-slate-800">{nav.title}</span>
                        <span className="text-[12px] text-slate-400">{nav.path}</span>
                    </a>
                ))}
            </div>
        </>
    );
}
