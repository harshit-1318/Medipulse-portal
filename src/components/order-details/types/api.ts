import type { ActivityLog } from "./common";
import type { Product } from "./product";
import type { PharmacistInfo } from "./pharmacist";
import type { 
    VideoConsultationAction, 
    OrderAction, 
    SendMessageAction, 
    SendGpEmailAction 
} from "./actions";

export interface ApiResponse {
    orderInfo: {
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
    };

    customerInfo: {
        id?: number;
        name: string;
        email: string;
        address: string;
        defaultAddress?: {
            first_name: string;
            last_name: string;
            address1: string;
            address2: string | null;
            city: string;
            province: string | null;
            country: string;
            zip: string;
            phone: string;
        } | null;
        totalOrders: number;
        dob?: string | null;
    };

    /** 6-month review summary */
    sixMonthReview?: {
        totalPens: number;
        emailSent: boolean;
    };

    productCategories?: string[];
    /** Convenience boolean flags keyed by SKU category (e.g. 'weight-loss', 'ed').
     *  Computed on the backend from SKU_MAP — use this instead of local SKU lists. */
    productCategoryFlags?: Record<string, boolean>;

    products: Product[];

    consultationFlags: {
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
    };

    customerDocuments: {
        id_card: string | null;
        full_photo: string | null;
        review_full_photo?: string | null;
        previous_prescriptions: string[];
        previous_prescriptions_count?: number;
        video_recordings?: {
            url: string;
            duration: number;
            recordedAt: string;
        }[];
        recordings?: {
            url: string;
            duration: number;
            recordedAt: string;
        }[];
    };

    /** MongoDB pharmacist data */
    pharmacistInfo?: PharmacistInfo;

    activityLogs?: ActivityLog[];

    /** Action Buttons / Controls */
    sendVideoConsultation: VideoConsultationAction;
    sendDocumentReminder: OrderAction;
    sendPrescriptionReminder: OrderAction;
    sendMessage: SendMessageAction;
    sendGpEmail?: SendGpEmailAction;
    sendSixMonthReview?: OrderAction;
    sixMonthEmail?: OrderAction;


    /** Repeat order logic (count-based, where 0 = first order, 1+ = repeat) */
    repeatedOrders?: number;

    /** Last previous order summary */
    lastPreviousOrder?: {
        orderId?: string;
        orderStatus: string;
        fulfillmentStatus?: string;
        status?: string;
        createdAt: string;
        dispatchedAt?: string | null;
        cancelledAt?: string | null;
        products: { name: string }[];
    } | null;

    /** Age verification action button config (backend-provided) */
    ageVerifiedEmail?: OrderAction;

    /** Age verification email tracking */
    ageVerifiedReview?: {
        emailSent: boolean;
        sentAt?: string | null;
        sentBy?: string | null;
    } | null;

    /** Raw data for advanced status detection */
    customerMeta?: any;
    orderDocumentFilter?: any[];

    /** Old optional fields (not used now, but kept for backward compatibility) */
    scr_comments?: string | null;
    approved_and_released?: boolean | 0 | 1;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
    goal?: string;
}
