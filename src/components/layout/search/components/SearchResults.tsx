interface NavItem {
    title: string;
    path: string;
}

interface SearchResultsProps {
    filteredNavs: NavItem[];
    searchQuery: string;
    onSelect: () => void;
}

export function SearchResults({ filteredNavs, searchQuery, onSelect }: SearchResultsProps) {
    return (
        <div className="flex-1 overflow-y-auto mix-h-[300px] pb-2 custom-scrollbar">
            {/* Category Header */}
            <div className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-transparent pt-4">
                Navigations
            </div>

            <div className="px-2">
                {filteredNavs.length > 0 ? (
                    filteredNavs.map((nav, idx) => (
                        <a
                            key={idx}
                            href={nav.path}
                            className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-montserrat mx-1"
                            onClick={onSelect}
                        >
                            <span className="text-[14px] font-semibold text-slate-800">
                                {nav.title}
                            </span>
                            <span className="text-[12px] text-slate-400">
                                {nav.path}
                            </span>
                        </a>
                    ))
                ) : (
                    <div className="py-12 text-center text-sm text-slate-500 font-montserrat">
                        No results found for "<span className="font-semibold text-slate-700">{searchQuery}</span>"
                    </div>
                )}
            </div>
        </div>
    );
}
