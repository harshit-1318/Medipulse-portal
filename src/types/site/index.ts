import type { SortingState, OnChangeFn } from "@tanstack/react-table";

export interface Site {
    id: string;
    name: string;
    key: string;
    url: string;
    status: "active" | "inactive" | string;
    totalUsers: number;
    totalOrders: number;
    createdAt: string;
    logo?: string;
    companyName?: string;
    primaryDomain?: string;
    is_active?: boolean;
}

export interface SitesTableProps {
    data: Site[];
    loading: boolean;
    total: number;
    page: number;
    setPage: (page: number) => void;
    search: string;
    setSearch: (search: string) => void;
    sorting: SortingState;
    setSorting: OnChangeFn<SortingState>;
}

export interface SiteFiltersState {
    search: string;
    status: string;
    siteName: string;
    url: string;
    startDate: string;
    endDate: string;
}
