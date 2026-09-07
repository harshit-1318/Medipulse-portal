import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { navItems } from '../sidebar/constants';
import { SearchInputHeader } from './components/SearchInputHeader';
import { GlobalSearchResults } from './components/GlobalSearchResults';
import { SearchFooter } from './components/SearchFooter';
import { useGlobalSearchModal } from './hooks/useGlobalSearchModal';

const navigationItems = navItems.flatMap(group => group.items).map(item => ({
    title: item.title,
    path: item.path
}));

export default function SearchBar() {
    const {
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        results,
        isLoading,
        mounted,
        isMac,
        inputRef,
        recents,
        handleSelect,
        handleRecentClick,
        removeRecent,
        clearAll,
    } = useGlobalSearchModal();

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-200 flex items-start justify-center pt-[12vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="relative w-full max-w-150 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4 border border-slate-100"
                        style={{ maxHeight: '75vh' }}
                    >
                        <SearchInputHeader
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onClose={() => setIsOpen(false)}
                            inputRef={inputRef}
                        />

                        <GlobalSearchResults
                            results={results}
                            isLoading={isLoading}
                            query={searchQuery}
                            navItems={navigationItems}
                            recents={recents}
                            onSelect={handleSelect}
                            onRecentClick={handleRecentClick}
                            onRecentRemove={removeRecent}
                            onClearRecents={clearAll}
                        />

                        <SearchFooter />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 h-9 pl-3 pr-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
                aria-label="Open Search (Ctrl K)"
            >
                <Search size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
                <span className="hidden sm:block text-[13px] font-montserrat text-slate-400 group-hover:text-slate-500 whitespace-nowrap transition-colors">
                    Search orders, customers...
                </span>
                <kbd className="hidden sm:flex items-center gap-px ml-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-400 font-mono text-[10px] leading-none group-hover:border-slate-300 transition-colors">
                    {isMac ? '⌘' : 'Ctrl'}{' '}K
                </kbd>
            </button>

            {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
        </>
    );
}
