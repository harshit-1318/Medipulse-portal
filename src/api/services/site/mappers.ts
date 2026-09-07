import type { Site } from "@/types/site";

/**
 * Map backend site object to frontend Site interface
 */
export const mapToSite = (raw: any): Site => ({
    id: raw._id || raw.id,
    name: raw.site_name || raw.name,
    key: raw.site_key || raw.key,
    url: raw.primary_domain || raw.url || "",
    status: raw.is_active ? "active" : "inactive",
    totalUsers: raw.totalUsers ?? raw.metadata?.totalUsers ?? 0,
    totalOrders: raw.totalOrders ?? raw.metadata?.totalOrders ?? 0,
    createdAt: raw.createdAt || raw.updatedAt || "",
    logo: raw.settings?.branding?.logo || raw.logo,
    companyName: raw.settings?.branding?.company_name || raw.company_name,
    primaryDomain: raw.primary_domain,
    is_active: raw.is_active,
});
