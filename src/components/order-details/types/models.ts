export interface OrderInfo {
    orderId: string;
    shopifyOrderId: number;
    createdAt: string;
    resyncedAt?: string | null;
    status: string | null;
    fulfillmentStatus: string | null;
    readOnly?: boolean;
    isUrgent?: boolean;
    isParked?: boolean;
    tags?: string[] | string | null;
}

export interface CustomerAddress {
    first_name: string;
    last_name: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string | null;
    country: string;
    zip: string;
    phone: string;
}

export interface CustomerInfo {
    id?: number;
    name: string;
    email: string;
    address: string;
    defaultAddress?: CustomerAddress | null;
    totalOrders: number;
    dob?: string | null;
}

export interface SixMonthReviewSummary {
    totalPens: number;
    emailSent: boolean;
}

export interface ConsultationFlags {
    has_full_photo: boolean;
    has_id_card: boolean;
    has_video_recording: boolean;
    /** Room created but recording not yet available — show 'Pending' state */
    video_request_sent?: boolean;
    consultation_reviewed: boolean;
    image_id_verified: boolean;
    scr_accessed: boolean;
    sms_sent?: boolean;
    postal_sent?: boolean;
}

export interface VideoRecordingInfo {
    url: string;
    duration: number;
    recordedAt: string;
}

export interface CustomerDocuments {
    id_card: string | null;
    full_photo: string | null;
    review_full_photo?: string | null;
    previous_prescriptions: string[];
    previous_prescriptions_count?: number;
    video_recordings?: VideoRecordingInfo[];
    recordings?: VideoRecordingInfo[];
}

export interface LastPreviousOrderSummary {
    orderId?: string;
    orderStatus: string;
    fulfillmentStatus?: string;
    status?: string;
    createdAt: string;
    dispatchedAt?: string | null;
    cancelledAt?: string | null;
    products: { name: string }[];
}

export interface AgeVerifiedReview {
    emailSent: boolean;
    sentAt?: string | null;
    sentBy?: string | null;
}
