import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';

interface SearchInputHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onClose: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
}

export function SearchInputHeader({ searchQuery, setSearchQuery, onClose, inputRef }: SearchInputHeaderProps) {
    return (
        <div className="flex items-center px-4 py-4 border-b border-slate-100 gap-3">
            <Search size={20} className="text-slate-400 shrink-0" />
            <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers, emails..."
                className="flex-1 bg-transparent outline-none text-[15px] font-medium text-slate-800 placeholder:text-slate-400 font-montserrat"
            />
            <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group bg-white border border-slate-100 hover:border-red-100 shadow-xs active:scale-90 shrink-0"
            >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
    );
}
