import apiClient from "../../apiClient";
import type { SiteInfo, SitesResponse } from "./types";
import { mapToSite } from "./mappers";

export const getSiteInfoApi = (data: { host: string }): Promise<SiteInfo> =>
    apiClient.post<SiteInfo>('/sites/get-info-by-domain', data);

export async function getSites(
    page = 1,
    search = "",
    sortBy = "",
    sort = "",
    filters: any = {}
): Promise<SitesResponse> {
    try {
        const params: any = { page, search };
        if (sortBy) {
            params.sortBy = sortBy;
            params.sort = sort;
        }

        Object.assign(params, filters);

        const res: any = await apiClient.get({
            url: "/sites",
            params,
        });

        const rawSites = res.sites || (Array.isArray(res) ? res : []);
        const total = res.total || (Array.isArray(res) ? res.length : 0);
        const sites = rawSites.map(mapToSite);

        return {
            sites,
            total,
            page,
            pageSize: 10,
        };
    } catch (error) {
        console.error("Failed to fetch sites:", error);
        return { sites: [], total: 0, page, pageSize: 10 };
    }
}

export const getSiteDetail = (id: string): Promise<any> =>
    apiClient.get(`/sites/${id}`);

export const createSite = (data: any): Promise<any> =>
    apiClient.post("/sites", data);

export const updateSite = (id: string, data: any): Promise<any> =>
    apiClient.patch(`/sites/${id}`, data);

export const deleteSite = (id: string): Promise<any> =>
    apiClient.delete(`/sites/${id}`);

export const toggleSiteReadOnly = (id: string, is_read_only: boolean): Promise<any> =>
    apiClient.patch(`/sites/${id}/toggle-readonly`, { is_read_only });

export const siteService = {
    getSiteInfoApi,
    getSites,
    getSiteDetail,
    createSite,
    updateSite,
    deleteSite,
    toggleSiteReadOnly,
};

export default siteService;
