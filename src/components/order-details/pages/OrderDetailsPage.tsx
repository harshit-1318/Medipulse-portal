import { QueryProvider } from "@/components/common";
import { OrderDetailsModals, FullScreenLoader as OrderDetailsLoading } from "../modals";
import { useOrderDetailsPage } from "../hooks";
import { OrderHeader, OrderDetailsError, OrderDetailsMainContent } from "../sections";
import { formatDate } from "../utils";

function OrderDetailsContent({ orderId }: { orderId: string }) {
    const {
        order, loading, error, isReadOnly, activeModal, showModal, hideModal, scrState, commActions, imageSlider
    } = useOrderDetailsPage(orderId);

    if (loading) return <OrderDetailsLoading />;

    if (error || !order) {
        return <OrderDetailsError orderId={orderId} error={error} />;
    }

    const formattedCreatedAt = formatDate(order.orderInfo.createdAt);
    const isArchived = order.orderInfo.status?.toLowerCase() === "archived";
    const isClosed = order.orderInfo.status?.toLowerCase() === "closed";

    return (
        <div className="w-full max-w-400 mx-auto space-y-4 pb-20 px-4 md:px-0">
            <OrderHeader orderInfo={order.orderInfo} customerId={order.customerInfo?.id} formattedCreatedAt={formattedCreatedAt} isArchived={isArchived} isClosed={isClosed} />

            <OrderDetailsMainContent 
                order={order} 
                orderId={orderId}
                isReadOnly={isReadOnly} 
                scrState={scrState} 
                commActions={commActions} 
                imageSlider={imageSlider} 
                showModal={showModal} 
                formattedCreatedAt={formattedCreatedAt} 
            />

            <OrderDetailsModals order={order} activeModal={activeModal} hideModal={hideModal} handleSendMessage={commActions.handleSendMessage} handleSendGpEmail={commActions.handleSendGpEmail} scrState={scrState} imageSlider={imageSlider} />
        </div>
    );
}

export default function OrderDetailsPage({ orderId }: { orderId: string }) {
    return (
        <QueryProvider>
            <OrderDetailsContent orderId={orderId} />
        </QueryProvider>
    );
}
