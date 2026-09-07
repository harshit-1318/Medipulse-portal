import type { Site } from "@/types/site";

export interface SiteInfo {
    id: string;
    key: string;
    name: string;
    is_active: boolean;
    logo: string;
    small_icon_url: string;
    company_name: string;
    siteHost: string;
    read_only?: boolean;
}

export interface SitesResponse {
    sites: Site[];
    total: number;
    page: number;
    pageSize: number;
}
