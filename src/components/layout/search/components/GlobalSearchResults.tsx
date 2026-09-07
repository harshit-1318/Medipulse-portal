import { Package, Users } from 'lucide-react';
import type { GlobalSearchResponse } from '@/types/globalSearch';
import type { RecentSearch } from '@/hooks';
import { OrderRow, CustomerRow } from './SearchRowItems';
import { SkeletonRows, RecentSearchList, QuickNavList, type NavItem } from './SearchFallbackViews';
import { SearchCategoryGroup } from './SearchCategoryGroup';
import { SearchEmptyState } from './SearchEmptyState';

interface GlobalSearchResultsProps {
    results: GlobalSearchResponse | null;
    isLoading: boolean;
    query: string;
    navItems: NavItem[];
    recents: RecentSearch[];
    onSelect: () => void;
    onRecentClick: (query: string) => void;
    onRecentRemove: (query: string) => void;
    onClearRecents: () => void;
}

export function GlobalSearchResults({
    results,
    isLoading,
    query,
    navItems,
    recents,
    onSelect,
    onRecentClick,
    onRecentRemove,
    onClearRecents,
}: GlobalSearchResultsProps) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return (
            <div className="flex-1 overflow-y-auto pb-2 custom-scrollbar">
                {recents.length > 0 && (
                    <RecentSearchList
                        recents={recents}
                        onRecentClick={onRecentClick}
                        onRecentRemove={onRecentRemove}
                        onClearAll={onClearRecents}
                    />
                )}
                <div className={recents.length > 0 ? 'mt-1 border-t border-slate-100 pt-1' : ''}>
                    <QuickNavList navItems={navItems} onSelect={onSelect} />
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 overflow-y-auto pb-2 custom-scrollbar">
                <SkeletonRows />
            </div>
        );
    }

    const hasOrders = results && results.orders.length > 0;
    const hasCustomers = results && results.customers.length > 0;
    const hasAnyResults = hasOrders || hasCustomers;

    if (results && !hasAnyResults) {
        return <SearchEmptyState query={trimmedQuery} />;
    }

    return (
        <div className="flex-1 overflow-y-auto pb-2 custom-scrollbar">
            {hasOrders && (
                <SearchCategoryGroup icon={<Package size={12} />} label="Orders" count={results!.orders.length} isTop>
                    {results!.orders.map((order) => (
                        <OrderRow key={order.shopify_order_id} order={order} onSelect={onSelect} />
                    ))}
                </SearchCategoryGroup>
            )}

            {hasOrders && hasCustomers && (
                <div className="mx-5 my-1 border-t border-slate-100" />
            )}

            {hasCustomers && (
                <SearchCategoryGroup icon={<Users size={12} />} label="Customers" count={results!.customers.length} isTop={!hasOrders}>
                    {results!.customers.map((customer) => (
                        <CustomerRow
                            key={customer.customer_id}
                            customer={customer}
                            onSelect={onSelect}
                        />
                    ))}
                </SearchCategoryGroup>
            )}
        </div>
    );
}
