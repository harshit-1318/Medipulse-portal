import React from 'react';

interface SearchEmptyStateProps {
    query: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => (
    <div className="flex-1 overflow-y-auto pb-2 custom-scrollbar">
        <div className="py-12 text-center text-sm text-slate-500 font-montserrat space-y-2">
            <p>
                No results for{' '}
                <span className="font-semibold text-slate-700">"{query}"</span>
            </p>
            <p className="text-[11px] text-slate-400">
                Try: a numeric ID, <span className="font-mono">#order-name</span>, or an email address
            </p>
        </div>
    </div>
);
