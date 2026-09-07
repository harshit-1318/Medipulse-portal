import SearchBar from '../search/SearchBar';
import NoticeButton from './NoticeButton';
import AccountDropdown from '../account/AccountDropdown';
import Breadcrumb from '../breadcrumb/Breadcrumb';

export default function Header() {
    return (
        <header
            className="sticky top-0 left-0 right-0 z-40 flex items-center justify-between pl-6 pr-6 h-16 shrink-0 bg-[#f8fafc]/90 backdrop-blur-sm border-b border-slate-200/50"
            aria-label="Dashboard Top Navigation"
        >
            {/* Left side -> Breadcrumbs */}
            <div className="flex items-center">
                <Breadcrumb />
            </div>

            {/* Right side -> Main Utilities */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                <SearchBar />
                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div> {/* Divider */}
                <NoticeButton />
                <AccountDropdown />
            </div>
        </header>
    );
}
