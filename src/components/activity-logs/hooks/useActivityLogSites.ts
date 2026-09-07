import { useEffect, useMemo, useState } from "react";
import { getSites } from "@/api/services/site/siteService";

export function useActivityLogSites(isSuperAdmin: boolean) {
    const [siteOptions, setSiteOptions] = useState<Array<{ label: string; value: string }>>([
        { label: "All Sites", value: "" },
    ]);

    useEffect(() => {
        if (!isSuperAdmin) {
            return;
        }

        let isCancelled = false;

        const loadSites = async () => {
            const response = await getSites(1, "", "", "", { limit: 200 });
            if (isCancelled) {
                return;
            }

            const options = response.sites
                .map((site) => ({
                    label: site.name,
                    value: site.id,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            setSiteOptions([{ label: "All Sites", value: "" }, ...options]);
        };

        loadSites();

        return () => {
            isCancelled = true;
        };
    }, [isSuperAdmin]);

    const normalizedSiteOptions = useMemo(() => (isSuperAdmin ? siteOptions : []), [isSuperAdmin, siteOptions]);

    return { normalizedSiteOptions };
}
