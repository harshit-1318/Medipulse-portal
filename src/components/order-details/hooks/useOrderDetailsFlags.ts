import { isClinicalOrder } from "../utils";
import { isParkedOrderTag } from "../utils/tagsUtils";

export function useOrderDetailsFlags(order: any, role?: string) {
    const orderStatus = (order.orderInfo?.status || "").toLowerCase();
    const fulfillmentStatus = (order.orderInfo?.fulfillmentStatus || "").toLowerCase();

    const isOnHold = orderStatus === "on_hold" || fulfillmentStatus === "on_hold";
    const isCancelled = orderStatus === "cancelled";
    const isClinical = isClinicalOrder(order.products);
    const isWeightLoss = order.productCategoryFlags?.['weight-loss'] ?? false;
    const hasPrescription = Boolean(order.pharmacistInfo?.prescription_pdf);
    const isCustomerSupport = role === "customer_support";
    const isParked = isParkedOrderTag(order.orderInfo?.tags);

    return {
        isOnHold,
        isCancelled,
        isClinical,
        isWeightLoss,
        hasPrescription,
        isCustomerSupport,
        isParked,
    };
}
