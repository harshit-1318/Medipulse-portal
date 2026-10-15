import type { ApiResponse } from "@/components/order-details/types";
import { getDocumentItemsStatus, resolveDocumentUrl } from "@/api/services/orders/utils/docsStatus";

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
    const rawOrder = {
        customerDocuments,
        consultationFlags,
        customerMeta,
        orderDocumentFilter,
        ...order,
    };

    const docItemsStatus = getDocumentItemsStatus(rawOrder);

    const idCardUrl = resolveDocumentUrl(customerDocuments?.id_card, customerMeta?.id_card, order?.id_card);
    const fullPhotoUrl = resolveDocumentUrl(customerDocuments?.full_photo, customerMeta?.full_photo, order?.full_photo);

    const idCard = docItemsStatus.id && idCardUrl ? idCardUrl : null;
    const fullPhoto = docItemsStatus.fullPhoto && fullPhotoUrl ? fullPhotoUrl : null;
    const hasVideo = docItemsStatus.video;

    const videoRequestSent = !hasVideo && Boolean(consultationFlags?.video_request_sent || order?.video_request_sent);

    const orderTags = order?.orderInfo?.tags ?? order?.tags;
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
