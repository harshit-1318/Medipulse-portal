import type { ActivityLog } from "./common";
import type { Product } from "./product";
import type { PharmacistInfo } from "./pharmacist";
import type { 
    VideoConsultationAction, 
    OrderAction, 
    SendMessageAction, 
    SendGpEmailAction 
} from "./actions";
import type {
    OrderInfo,
    CustomerInfo,
    SixMonthReviewSummary,
    ConsultationFlags,
    CustomerDocuments,
    LastPreviousOrderSummary,
    AgeVerifiedReview
} from "./models";

export interface ApiResponse {
    orderInfo: OrderInfo;
    customerInfo: CustomerInfo;
    /** 6-month review summary */
    sixMonthReview?: SixMonthReviewSummary;
    productCategories?: string[];
    /** Convenience boolean flags keyed by SKU category (e.g. 'weight-loss', 'ed').
     *  Computed on the backend from SKU_MAP — use this instead of local SKU lists. */
    productCategoryFlags?: Record<string, boolean>;
    products: Product[];
    consultationFlags: ConsultationFlags;
    customerDocuments: CustomerDocuments;
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
    lastPreviousOrder?: LastPreviousOrderSummary | null;
    /** Age verification action button config (backend-provided) */
    ageVerifiedEmail?: OrderAction;
    /** Age verification email tracking */
    ageVerifiedReview?: AgeVerifiedReview | null;
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
