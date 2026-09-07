import { useEffect, useState } from "react";
import useSiteStore, { useSiteInfo } from '@/store';
import { useCommunicationActions } from "../communication";
import { useImageSlider } from "../media";
import { useOrderDetails } from "./useOrderDetails";
import { useScrState } from "../clinical";

export function useOrderDetailsPage(orderId: string) {
    const siteInfo = useSiteInfo();
    const { order, loading, error } = useOrderDetails(orderId);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const isReadOnly = Boolean(order?.orderInfo?.readOnly) || Boolean(siteInfo?.read_only);
    const showModal = (id: string) => setActiveModal(id);
    const hideModal = () => setActiveModal(null);

    const scrState = useScrState(order ?? null, isReadOnly, showModal);
    const commActions = useCommunicationActions(order ?? null, isReadOnly, showModal, hideModal);
    const imageSlider = useImageSlider();

    useEffect(() => {
        if (order?.orderInfo?.orderId) {
            const shortId = order.orderInfo.orderId.toString();
            const label = shortId.startsWith('#') ? shortId : `#${shortId}`;
            useSiteStore.setState({ currentOrderLabel: label });
        }

        return () => {
            // Optional: Clear on unmount if needed, but breadcrumb might need it for a bit
            // useSiteStore.setState({ currentOrderLabel: undefined });
        };
    }, [order?.orderInfo?.orderId]);

    useEffect(() => {
        if (activeModal === "scrSuccessModal" || activeModal === "cancelSuccessModal" || activeModal === "sixMonthSuccessModal") {
            const timer = setTimeout(() => window.location.reload(), 1500);
            return () => clearTimeout(timer);
        }
    }, [activeModal]);

    return {
        order,
        loading,
        error,
        isReadOnly,
        activeModal,
        showModal,
        hideModal,
        scrState,
        commActions,
        imageSlider,
        setActiveModal,
    };
}
