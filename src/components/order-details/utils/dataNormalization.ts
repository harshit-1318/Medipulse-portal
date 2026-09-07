import type { ApiResponse, Product } from "../types";
import { normalizeOrderInfo } from "./orderInfoNormalization";
import { normalizeCustomerInfo } from "./customerNormalization";

export function normalizeOrderData(response: any): ApiResponse {
    return {
        orderInfo: normalizeOrderInfo(response),
        customerInfo: normalizeCustomerInfo(response),
        sixMonthReview: response.sixMonthReview,
        productCategories: response.productCategories ?? [],
        productCategoryFlags: response.productCategoryFlags ?? {},
        products: Array.isArray(response.products)
            ? (response.products as Product[]).map(p => ({
                ...p,
                lineItemsRaw: (response.lineItemsRaw ?? []).filter(
                    (item: any) => item.product_id === p.product_id
                )
            })).filter((p) => !p.name.toLowerCase().includes('shipment'))
            : [],
        consultationFlags: {
            has_full_photo: response.consultationFlags?.has_full_photo ?? false,
            has_id_card: response.consultationFlags?.has_id_card ?? false,
            has_video_recording: response.consultationFlags?.has_video_recording ?? false,
            consultation_reviewed: response.consultationFlags?.consultation_reviewed ?? false,
            image_id_verified: response.consultationFlags?.image_id_verified ?? false,
            scr_accessed: response.consultationFlags?.scr_accessed ?? false,
            sms_sent: response.consultationFlags?.sms_sent,
            postal_sent: response.consultationFlags?.postal_sent,
        },
        customerDocuments: {
            id_card: response.customerDocuments?.id_card ?? null,
            full_photo: response.customerDocuments?.full_photo ?? null,
            review_full_photo: response.customerDocuments?.review_full_photo ?? null,
            previous_prescriptions: response.customerDocuments?.previous_prescriptions ?? [],
            previous_prescriptions_count: response.customerDocuments?.previous_prescriptions_count ?? 0,
            video_recordings: response.customerDocuments?.video_recordings ?? response.video_recordings ?? [],
        },
        pharmacistInfo: response.pharmacistInfo,
        activityLogs: response.activityLogs,
        sendVideoConsultation: response.sendVideoConsultation ?? { enabled: false, roomUrl: "", method: "", payload: {} },
        sendDocumentReminder: response.sendDocumentReminder ?? { enabled: false, actionUrl: "", method: "", payload: {} },
        sendPrescriptionReminder: response.sendPrescriptionReminder ?? { enabled: false, actionUrl: "", method: "", payload: {} },
        sendMessage: response.sendMessage ?? { enabled: false, actionUrl: "", method: "", payload: { id: "", message: "" } },
        sendGpEmail: response.sendGpEmail,
        sendSixMonthReview: response.sendSixMonthReview,
        sixMonthEmail: response.sixMonthEmail || response.six_month_email,
        scr_comments: response.scr_comments,
        approved_and_released: response.approved_and_released,
        reviewed_at: response.reviewed_at,
        reviewed_by: response.reviewed_by,
        repeatedOrders:
            response.repeatedOrders ??
            response.repeated_orders ??
            response.repeat_count ??
            response.repeatCount ??
            response.customerInfo?.totalOrders ??
            response.customer?.total_orders ??
            response.customer?.orders_count ??
            0,
        lastPreviousOrder: response.lastPreviousOrder || response.last_previous_order || null,
        customerMeta: response.customerMeta ?? response.customer_meta ?? null,
        orderDocumentFilter: response.orderDocumentFilter ?? response.order_document_filter ?? [],
        ageVerifiedReview: response.ageVerifiedReview ?? null,
        ageVerifiedEmail: response.ageVerifiedEmail,
    };
}
