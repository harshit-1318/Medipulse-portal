export function getDocumentItemsStatus(o: any): { id: boolean; fullPhoto: boolean; video: boolean } {
    const filterItems = Array.isArray(o?.orderDocumentFilter) ? o.orderDocumentFilter : [];

    const resolveFilterUploaded = (field: string): boolean | undefined => {
        const item = filterItems.find((f: any) => String(f?.field || "").toLowerCase() === field);
        if (!item) return undefined;
        if (typeof item.uploaded === "boolean") return item.uploaded;
        if (typeof item.status === "string") return item.status.toLowerCase() === "uploaded";
        return undefined;
    };

    const idFromFilter = resolveFilterUploaded("has_id_card");
    const fullPhotoFromFilter = resolveFilterUploaded("has_full_photo");
    const videoFromFilter = resolveFilterUploaded("has_video_recording");

    const id =
        o?.hasIdCard === true ||
        o?.has_id_card === true ||
        idFromFilter === true ||
        o?.customerMeta?.id_card === true ||
        o?.customerMeta?.has_id_card === true;

    const fullPhoto =
        o?.hasFullPhoto === true ||
        o?.has_full_photo === true ||
        fullPhotoFromFilter === true ||
        o?.customerMeta?.has_full_photo === true;

    const video =
        o?.hasVideoRecording === true ||
        o?.has_video_recording === true ||
        videoFromFilter === true;

    return { id, fullPhoto, video };
}

export function detectDocsStatus(o: any): boolean {
    if (!o) return false;

    const documentItems = getDocumentItemsStatus(o);

    const isExplicitlyNotUploaded =
        o.documentsUploaded === false ||
        (o.documentStatus && String(o.documentStatus).toLowerCase() === "not_uploaded") ||
        (o.document_status && String(o.document_status).toLowerCase() === "not_uploaded");

    const hasDocsArray = Array.isArray(o.documents) && o.documents.length > 0;
    const hasDocsFlag = Boolean(o.documentsUploaded) || Boolean(o.hasDocuments);
    const hasDocsString = typeof o.documents === "string" && o.documents.trim() !== "";
    const explicitStatusUploaded =
        (o.documentStatus && String(o.documentStatus).toLowerCase() === "uploaded") ||
        (o.document_status && String(o.document_status).toLowerCase() === "uploaded");

    const hasOrderDocFilterUploaded = Array.isArray(o.orderDocumentFilter) && 
        o.orderDocumentFilter.some((f: any) => f.uploaded === true || f.status === "uploaded");

    const hasMetaDocs = Boolean(
        documentItems.id ||
            documentItems.fullPhoto ||
            hasOrderDocFilterUploaded,
    );

    if (isExplicitlyNotUploaded) return false;
    if (hasDocsArray || hasDocsFlag || hasDocsString || explicitStatusUploaded || hasMetaDocs) return true;

    const hasTag =
        Array.isArray(o.tags) &&
        o.tags.some((t: any) => {
            const tag = String(t).toLowerCase();
            return tag.includes("prescription_uploaded") || tag.includes("prescription uploaded") || tag === "uploaded";
        });

    return Boolean(hasTag);
}
