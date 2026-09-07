import { useEffect, useState } from "react";
import { cancelOrder, updateScrReview } from "@/api/services/orders";
import type { ApiResponse } from "@/components/order-details/types";

export function useScrState(order: ApiResponse | null, isReadOnly: boolean, onSuccess: (type: string) => void) {
    const [scrFlags, setScrFlags] = useState({
        consultation_reviewed: false,
        image_id_verified: false,
        scr_accessed: false,
    });
    const [scrComments, setScrComments] = useState("");
    const [showDeclinePopup, setShowDeclinePopup] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelStaffNote, setCancelStaffNote] = useState("");
    const [approveChecked, setApproveChecked] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);
    const [reviewedBy, setReviewedBy] = useState("");
    const [reviewedAt, setReviewedAt] = useState("");
    const [regNo, setRegNo] = useState("");

    useEffect(() => {
        if (!order) return;
        setScrFlags({
            consultation_reviewed: order.consultationFlags?.consultation_reviewed ?? false,
            image_id_verified: order.consultationFlags?.image_id_verified ?? false,
            scr_accessed: order.consultationFlags?.scr_accessed ?? false,
        });
        setScrComments(order.pharmacistInfo?.scr_comment || "");
        const reviewed =
            order.consultationFlags?.consultation_reviewed ||
            order.consultationFlags?.image_id_verified ||
            order.consultationFlags?.scr_accessed;
        setIsReviewed(!!reviewed);
        setReviewedBy(order.pharmacistInfo?.generated_by_name || "");
        setReviewedAt(order.pharmacistInfo?.createdAt || "");
        setRegNo(order.pharmacistInfo?.generated_by_reg_no || "");
    }, [order]);

    const handleToggleScr = (key: keyof typeof scrFlags) => {
        if (isReviewed || isReadOnly) return;
        setScrFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmitSCR = async () => {
        const orderId = order?.orderInfo?.shopifyOrderId?.toString();
        if (!orderId) return;

        try {
            await updateScrReview({
                order_id: orderId,
                pharmacist_comments: scrComments || "",
                "scr-comment": scrComments || "",
                consultation_reviewed: scrFlags.consultation_reviewed ? "1" : "0",
                image_id_verified: scrFlags.image_id_verified ? "1" : "0",
                scr_accessed: scrFlags.scr_accessed ? "1" : "0",
                make_unfulfilled: approveChecked ? "1" : "0",
            });
            setIsReviewed(true);
            onSuccess("scrSuccessModal");
        } catch (error) {
            console.error("❌ SCR Submit Error:", error);
        }
    };

    const handleCancelOrder = async () => {
        try {
            await cancelOrder({
                orderId: order?.orderInfo?.shopifyOrderId?.toString() ?? "",
                reason: cancelReason,
                staff_note: cancelStaffNote,
            });
            setShowDeclinePopup(false);
            onSuccess("cancelSuccessModal");
        } catch (err) {
            console.error("❌ Cancel failed:", err);
        }
    };

    return {
        scrFlags,
        scrComments,
        setScrComments,
        showDeclinePopup,
        setShowDeclinePopup,
        cancelReason,
        setCancelReason,
        cancelStaffNote,
        setCancelStaffNote,
        approveChecked,
        setApproveChecked,
        isReviewed,
        reviewedBy,
        reviewedAt,
        regNo,
        handleToggleScr,
        handleSubmitSCR,
        handleCancelOrder,
    };
}
