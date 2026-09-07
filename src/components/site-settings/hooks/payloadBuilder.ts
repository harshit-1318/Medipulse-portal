export const buildSitePayload = (form: any, siteId?: string, trimSiteKey = false) => {
    return {
        siteId,
        host: form.primary_domain,
        site_key: trimSiteKey ? form.site_key.trim().toLowerCase() : form.site_key,
        site_name: form.site_name.trim(),
        domains: form.domains,
        primary_domain: form.primary_domain,
        is_active: form.is_active,
        read_only: form.read_only,
        settings: {
            branding: {
                company_name: form.company_name,
                logo: form.logo,
                small_icon_url: form.small_icon_url,
            },
        },
        shopify_config: {
            shop: form.shop,
            access_token: form.access_token,
            api_version: form.api_version,
            webhook_secret: form.webhook_secret,
            api_key: form.api_key,
            api_secret: form.api_secret,
        },
        ...(form.enableDailyCo && {
            daily_config: {
                api_key: form.dailyCoSecretKey,
                domain: form.dailyCoDomain,
                webhook_hmac: form.dailyCoWebhookHMAC,
                webhook_url: form.dailyCoWebhookUrl,
                subdomain: form.dailyCoSubdomain,
            },
        }),
        ...(form.enableDocmanJobs && {
            docman_jobs_config: {
                api_token: form.jobsApiToken,
            },
        }),
        ...(form.enableMailing && {
            email_config: {
                host: form.mailHost,
                port: Number(form.mailPort),
                user: form.mailUsername,
                pass: form.mailPassword,
                from: `${form.mailFromName} <${form.mailFromAddress}>`,
                ...(Object.keys(form.senderOverrides || {}).some(k => form.senderOverrides[k]?.trim()) && {
                    sender_overrides: Object.fromEntries(
                        Object.entries(form.senderOverrides as Record<string, string>)
                            .filter(([, v]) => v?.trim())
                    ),
                }),
            },
        }),
        ...(form.enableLexisNexis && {
            lexis_nexis_config: {
                url: form.lexisNexisUrl,
                username: form.lexisNexisUsername,
                password: form.lexisNexisPassword,
            },
        }),
        ...(form.enableKlaviyo && {
            klaviyo_config: {
                api_key: form.klaviyoApiKey,
            },
        }),
        ...(form.enableProductFilter && {
            allowed_product_filter: {
                product_ids: form.product_ids
                    .split(",")
                    .map((id: string) => id.trim())
                    .filter(Boolean)
                    .map((id: string) => (Number.isNaN(Number(id)) ? id : Number(id))),
            },
        }),
    };
};
