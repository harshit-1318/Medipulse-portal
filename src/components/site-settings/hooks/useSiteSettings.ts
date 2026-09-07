import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { siteService } from "@/api/services/site/siteService";
import { parseDomainsText, generateSiteKey, mapToFormState, defaultSiteFormState, buildSitePayload } from "./utils";

export function useSiteSettings(siteId?: string) {
    const [form, setForm] = useState<any>(defaultSiteFormState);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [domainsText, setDomainsText] = useState("");

    useEffect(() => {
        if (siteId) {
            setLoading(true);
            siteService.getSiteDetail(siteId)
                .then((data: any) => {
                    const mapped = mapToFormState(data.site || data);
                    setForm(mapped);
                    setDomainsText(mapped.domains.join("\n"));
                })
                .catch(() => toast.error("Failed to load site settings"))
                .finally(() => setLoading(false));
        }
    }, [siteId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ 
            ...prev, 
            [name]: value,
            site_key: name === "site_name" ? generateSiteKey(value) : prev.site_key
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setForm((prev: any) => ({ ...prev, [name]: checked }));
    };

    const handleSenderOverrideChange = (templateKey: string, value: string) => {
        setForm((prev: any) => ({
            ...prev,
            senderOverrides: { ...prev.senderOverrides, [templateKey]: value },
        }));
    };

    const handleDomainsChange = (text: string) => {
        setDomainsText(text);
        setForm((prev: any) => ({ ...prev, domains: parseDomainsText(text) }));
    };

    const validateForm = () => {
        if (!form.site_name.trim()) return "Site Name is required";
        if (!form.site_key.trim()) return "Site Key is required";
        if (!form.primary_domain.trim()) return "Primary Domain is required";
        return null;
    };

    const submitForm = async () => {
        const err = validateForm();
        if (err) {
            toast.error(err);
            return;
        }

        setSaving(true);
        try {
            const payload = buildSitePayload(form, siteId, true);
            if (siteId) await siteService.updateSite(siteId, payload);
            else await siteService.createSite(payload);
            
            toast.success(siteId ? "Settings updated" : "Site created");
            if (!siteId) window.location.href = '/sites';
        } catch (err) {
            toast.error("Process failed");
        } finally {
            setSaving(false);
        }
    };

    return { 
        form, loading, saving, handleChange, 
        handleSwitchChange, handleDomainsChange, 
        domainsText, submitForm, handleSenderOverrideChange
    };
}
