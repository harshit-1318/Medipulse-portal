import type { ApiResponse } from "@/components/order-details/types";

interface UseIdentityCardDataParams {
    customerDocuments: ApiResponse["customerDocuments"];
    consultationFlags: ApiResponse["consultationFlags"];
    customerMeta?: any;
    orderDocumentFilter?: any[];
    order?: any;
}

export function useIdentityCardData({
    customerDocuments,
    consultationFlags,
    customerMeta,
    orderDocumentFilter,
    order,
}: UseIdentityCardDataParams) {
    const hasOrderDocFilterUploaded = Array.isArray(orderDocumentFilter) &&
        orderDocumentFilter.some((f: any) => f.uploaded === true || f.status === "uploaded");

    const idCard = customerDocuments?.id_card || consultationFlags?.has_id_card || customerMeta?.id_card || customerMeta?.has_id_card;
    const fullPhoto = customerDocuments?.full_photo || consultationFlags?.has_full_photo || customerMeta?.full_photo || customerMeta?.has_full_photo || hasOrderDocFilterUploaded;
    const hasVideo = consultationFlags?.has_video_recording ||
        (customerDocuments?.video_recordings && customerDocuments.video_recordings.length > 0) ||
        (customerDocuments?.recordings && customerDocuments.recordings.length > 0);
    const videoRequestSent = !hasVideo && consultationFlags?.video_request_sent;

    const orderTags = order?.orderInfo?.tags;
    const parsedTags = Array.isArray(orderTags)
        ? orderTags
        : typeof orderTags === 'string'
            ? orderTags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [];

    const ageVerifiedTags = parsedTags.filter((t: string) => {
        const normalized = t.toLowerCase().replace(/[\s-_]/g, '');
        return normalized.includes('ageverified') || normalized.includes('ageverification');
    });
    const hasPendingAgeVerification = parsedTags.some((t: string) => {
        const normalized = t.toLowerCase().replace(/[\s-_]/g, '');
        return normalized.includes('pendingageverification');
    });

    const hasMounjaroOrWegovy = order?.products?.some((p: any) =>
        p.name?.toLowerCase().includes("mounjaro") || p.name?.toLowerCase().includes("wegovy")
    );

    const ageVerifiedReview = order?.ageVerifiedReview;
    const isManualVerified = ageVerifiedReview?.emailSent === true;
    const sentAt = ageVerifiedReview?.sentAt
        ? new Date(ageVerifiedReview.sentAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
        : null;
    const sentBy = ageVerifiedReview?.sentBy ?? null;

    return {
        idCard,
        fullPhoto,
        hasVideo,
        videoRequestSent,
        ageVerifiedTags,
        hasPendingAgeVerification,
        hasMounjaroOrWegovy,
        isManualVerified,
        sentAt,
        sentBy,
    };
}
