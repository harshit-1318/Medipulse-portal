export function isValidDocumentUrl(val: unknown): val is string {
    if (typeof val !== 'string') return false;
    const trimmed = val.trim();
    if (!trimmed) return false;
    const lower = trimmed.toLowerCase();
    if (['null', 'undefined', 'none', 'false', '0', 'n/a', 'not uploaded', 'not_uploaded'].includes(lower)) return false;
    if (lower.includes('placeholder') || lower.includes('example.com/placeholder')) return false;
    return true;
}

export function resolveDocumentUrl(...candidates: any[]): string | null {
    for (const c of candidates) {
        if (isValidDocumentUrl(c)) return c.trim();
    }
    return null;
}

export function getDocumentItemsStatus(o: any): { id: boolean; fullPhoto: boolean; video: boolean } {
    if (!o) return { id: false, fullPhoto: false, video: false };

    const filterItems = Array.isArray(o?.orderDocumentFilter) ? o.orderDocumentFilter : [];
    const resolveFilter = (field: string): boolean | undefined => {
        const item = filterItems.find((f: any) => String(f?.field || "").toLowerCase() === field);
        if (!item) return undefined;
        if (typeof item.uploaded === "boolean") return item.uploaded;
        if (typeof item.status === "string") {
            const s = item.status.toLowerCase();
            if (s === "uploaded") return true;
            if (s === "not_uploaded" || s === "not-uploaded" || s === "not uploaded") return false;
        }
        return undefined;
    };

    const idFilter = resolveFilter("has_id_card");
    const photoFilter = resolveFilter("has_full_photo");
    const videoFilter = resolveFilter("has_video_recording");

    const custDocs = o?.customerDocuments;
    const hasCustDocs = Boolean(custDocs && typeof custDocs === 'object');

    const idUrl = resolveDocumentUrl(custDocs?.id_card, o?.id_card, o?.id_card_url, o?.idDocumentUrl, o?.customerMeta?.id_card);
    const photoUrl = resolveDocumentUrl(custDocs?.full_photo, o?.full_photo, o?.full_photo_url, o?.photoUrl, o?.customerMeta?.full_photo);

    const videoList = Array.isArray(custDocs?.video_recordings) ? custDocs.video_recordings :
        Array.isArray(custDocs?.recordings) ? custDocs.recordings :
        Array.isArray(o?.video_recordings) ? o.video_recordings :
        Array.isArray(o?.recordings) ? o.recordings : [];
    const hasVideoUrl = videoList.some((r: any) => isValidDocumentUrl(r?.url || r?.video_url || r?.link || r)) ||
        isValidDocumentUrl(o?.videoUrl || o?.video_url);

    const id = idFilter !== undefined ? (idFilter && (hasCustDocs ? Boolean(idUrl) : true)) :
        hasCustDocs ? Boolean(idUrl) :
        Boolean(idUrl || o?.hasIdCard === true || o?.has_id_card === true || o?.customerMeta?.has_id_card === true);

    const fullPhoto = photoFilter !== undefined ? (photoFilter && (hasCustDocs ? Boolean(photoUrl) : true)) :
        hasCustDocs ? Boolean(photoUrl) :
        Boolean(photoUrl || o?.hasFullPhoto === true || o?.has_full_photo === true || o?.customerMeta?.has_full_photo === true);

    const video = videoFilter !== undefined ? (videoFilter && (hasCustDocs ? hasVideoUrl : true)) :
        hasCustDocs ? hasVideoUrl :
        Boolean(hasVideoUrl || o?.hasVideoRecording === true || o?.has_video_recording === true);

    return { id, fullPhoto, video };
}

export function detectDocsStatus(o: any): boolean {
    if (!o) return false;

    const isExplicitlyNotUploaded =
        o.documentsUploaded === false ||
        (o.documentStatus && String(o.documentStatus).toLowerCase().replace(/[-_]/g, '') === "notuploaded") ||
        (o.document_status && String(o.document_status).toLowerCase().replace(/[-_]/g, '') === "notuploaded");

    if (isExplicitlyNotUploaded) return false;

    const documentItems = getDocumentItemsStatus(o);
    const hasOrderDocFilter = Array.isArray(o.orderDocumentFilter) &&
        o.orderDocumentFilter.some((f: any) => f.uploaded === true || f.status === "uploaded");
    if (documentItems.id || documentItems.fullPhoto || documentItems.video || hasOrderDocFilter) return true;

    const hasDocsArray = Array.isArray(o.documents) && o.documents.length > 0;
    const hasDocsFlag = Boolean(o.documentsUploaded) || Boolean(o.hasDocuments);
    const hasDocsString = typeof o.documents === "string" && o.documents.trim() !== "";
    const explicitStatusUploaded =
        (o.documentStatus && String(o.documentStatus).toLowerCase() === "uploaded") ||
        (o.document_status && String(o.document_status).toLowerCase() === "uploaded");

    if (hasDocsArray || hasDocsFlag || hasDocsString || explicitStatusUploaded) return true;

    const hasTag = Array.isArray(o.tags) && o.tags.some((t: any) => {
        const tag = String(t).toLowerCase();
        return tag.includes("prescription_uploaded") || tag.includes("prescription uploaded") || tag === "uploaded";
    });

    return Boolean(hasTag);
}
