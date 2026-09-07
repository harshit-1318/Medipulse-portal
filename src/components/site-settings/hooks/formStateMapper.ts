import { slugify } from "@/utils";
import { defaultSiteFormState } from "./defaultFormState";

export { defaultSiteFormState };

export const parseDomainsText = (text: string): string[] => {
    return text.split(/[\n,]+/).map((d) => d.trim()).filter(Boolean);
};

export const generateSiteKey = (name: string): string => {
    return slugify(name);
};

export const mapToFormState = (site: any): any => {
    const s = { ...defaultSiteFormState };
    if (!site) return s;

    s.site_name = site.site_name || "";
    s.site_key = site.site_key || "";
    s.domains = site.domains || [];
    s.primary_domain = site.primary_domain || "";
    s.company_name = site.settings?.branding?.company_name || "";
    s.logo = site.settings?.branding?.logo || "";
    s.small_icon_url = site.settings?.branding?.small_icon_url || "";
    
    s.shop = site.shopify_config?.shop || "";
    s.access_token = site.shopify_config?.access_token || "";
    s.api_version = site.shopify_config?.api_version || "";
    s.webhook_secret = site.shopify_config?.webhook_secret || "";
    s.api_key = site.shopify_config?.api_key || "";
    s.api_secret = site.shopify_config?.api_secret || "";
    
    s.is_active = site.is_active ?? true;
    s.read_only = Boolean(site.read_only);
    s.product_ids = site.allowed_product_filter?.product_ids?.join(",") || "";
    s.enableProductFilter = Boolean(site.allowed_product_filter?.product_ids?.length);

    if (site.daily_config) {
        s.enableDailyCo = true;
        s.dailyCoSecretKey = site.daily_config.api_key || "";
        s.dailyCoDomain = site.daily_config.domain || "";
        s.dailyCoWebhookHMAC = site.daily_config.webhook_hmac || "";
        s.dailyCoWebhookUrl = site.daily_config.webhook_url || "";
        s.dailyCoSubdomain = site.daily_config.subdomain || "";
    }

    if (site.docman_jobs_config) {
        s.enableDocmanJobs = true;
        s.jobsApiToken = site.docman_jobs_config.api_token || "";
    }

    if (site.email_config) {
        s.enableMailing = true;
        s.mailHost = site.email_config.host || "";
        s.mailPort = site.email_config.port?.toString() || "";
        s.mailUsername = site.email_config.user || "";
        s.mailPassword = site.email_config.pass || "";
        if (site.email_config.from) {
            const match = site.email_config.from.match(/^\s*(.*?)\s*<(.+?)>\s*$/);
            if (match) {
                s.mailFromName = match[1].trim();
                s.mailFromAddress = match[2].trim();
            }
        }
        s.senderOverrides = site.email_config.sender_overrides
            ? { ...site.email_config.sender_overrides }
            : {};
    }

    if (site.lexis_nexis_config) {
        s.enableLexisNexis = true;
        s.lexisNexisUrl = site.lexis_nexis_config.url || "";
        s.lexisNexisUsername = site.lexis_nexis_config.username || "";
        s.lexisNexisPassword = site.lexis_nexis_config.password || "";
    }

    if (site.klaviyo_config) {
        s.enableKlaviyo = true;
        s.klaviyoApiKey = site.klaviyo_config.api_key || "";
    }

    return s;
};
