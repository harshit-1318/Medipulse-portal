import { getOrders, getOrderById } from './fetchers/core';
import { markOrderUrgent } from './actions';

export * from './types';
export * from './utils';
export * from './buildParams';
export * from './fetchers/core';
export * from './fetchers/status';
export * from './fetchers/customer';
export * from './fetchers/document';
export * from './actions';

export const orderService = {
    getOrders,
    getOrderById,
    markOrderUrgent,
};
