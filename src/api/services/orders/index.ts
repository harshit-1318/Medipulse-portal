import { getOrders, getOrderById } from "./fetchers/core";
import { markOrderUrgent } from "./actions/order";

export * from "./types";
export * from "./buildParams";
export * from "./orderParamsNormalizer";
export * from "./internalNotesService";
export * from "./fetchers";
export * from "./actions";
export * from "./utils";

export const orderService = {
    getOrders,
    getOrderById,
    markOrderUrgent,
};
