import {
  DEFAULT_PHARMACIST_INFO,
  createOrderCommActions,
} from './mockOrderData';
import { buildOrderDocuments } from './documentHelpers';

export function buildOrderDetailPayload(orderDoc: any, cleanId: string) {
  const orderNumber = orderDoc?.orderNumber || (cleanId.startsWith('#') ? cleanId : `#${cleanId}`);
  const shopifyOrderId = orderDoc?.shopify_order_id || cleanId.replace(/\D/g, '') || '1001';
  const fs = orderDoc?.fulfillment_status || orderDoc?.fulfillmentStatus || (() => {
    const s = String(orderDoc?.status || '').toLowerCase().trim();
    if (['completed', 'fulfilled', 'dispatched'].includes(s)) return 'fulfilled';
    if (['on_hold', 'hold'].includes(s)) return 'on_hold';
    if (['cancelled', 'voided'].includes(s)) return 'cancelled';
    return 'unfulfilled';
  })();
  const totalOrders = (orderDoc?.repeatedOrders ?? orderDoc?.repeatCount ?? 0) + 1;
  const customerId = orderDoc?.store_order_id || orderDoc?.customerId || 'cust_101';
  const { customerDocuments, consultationFlags } = buildOrderDocuments(orderDoc);

  const customer = {
    id: customerId,
    name: orderDoc?.customerName || 'John Doe',
    first_name: (orderDoc?.customerName || 'John Doe').split(' ')[0] || 'John',
    last_name: (orderDoc?.customerName || 'John Doe').split(' ').slice(1).join(' ') || 'Doe',
    email: orderDoc?.customerEmail || 'john.doe@example.com',
    phone: orderDoc?.customerPhone || orderDoc?.phone || '+44 7700 900077',
    dob: orderDoc?.customerDob || orderDoc?.dob || '1988-04-12',
    gender: orderDoc?.customerGender || orderDoc?.gender || 'Male',
    weight: orderDoc?.weight || '82',
    height: orderDoc?.height || '178',
    bmi: orderDoc?.bmi || '25.9',
    address: orderDoc?.customerAddress || orderDoc?.address || orderDoc?.shippingAddress || '14 High Street, Kensington, London, W8 4SG, United Kingdom',
    total_orders: totalOrders,
    totalOrders,
  };

  const products = (orderDoc?.items && orderDoc.items.length > 0)
    ? orderDoc.items.map((item: any, idx: number) => ({
        id: `prod_${idx + 1}`,
        product_id: `prod_${idx + 1}`,
        name: item.name || 'Semaglutide 0.25mg Pen',
        title: item.name || 'Semaglutide 0.25mg Pen',
        quantity: item.quantity || 1,
        price: item.price || 89.99,
      }))
    : [
        {
          id: 'prod_1',
          product_id: 'prod_1',
          name: 'Semaglutide 0.25mg Pen (4 doses)',
          title: 'Semaglutide 0.25mg Pen (4 doses)',
          quantity: 1,
          price: 89.99,
        },
      ];

  return {
    _id: orderDoc?._id?.toString() || '65e0123456789abcdef00001',
    id: orderNumber,
    order_name: orderNumber,
    shopify_order_id: shopifyOrderId,
    shopifyOrderId: Number(shopifyOrderId) || 1001,
    status: orderDoc?.status || fs,
    fulfillment_status: fs,
    read_only: false,
    is_urgent: orderDoc?.isUrgent ?? false,
    is_parked: orderDoc?.isParked ?? false,
    tags: orderDoc?.tags || ['Weight Loss', 'Consultation Approved'],
    created_at: orderDoc?.createdAt || new Date('2026-08-15T10:30:00Z').toISOString(),
    updated_at: orderDoc?.updatedAt || new Date().toISOString(),
    total_price: orderDoc?.total || 89.99,
    repeatedOrders: orderDoc?.repeatedOrders ?? orderDoc?.repeatCount ?? 0,
    repeatCount: orderDoc?.repeatCount ?? orderDoc?.repeatedOrders ?? 0,
    order_type: orderDoc?.order_type || (totalOrders > 1 ? 'repeat' : 'first'),
    customer,
    customerInfo: customer,
    products,
    consultationFlags,
    customerDocuments,
    pharmacistInfo: DEFAULT_PHARMACIST_INFO,
    activityLogs: [
      {
        id: 'act_1',
        view: 'orders',
        actionType: 'consultation_approved',
        objectGuid: cleanId,
        subjectGuid: 'admin_1',
        targetGuid: 'cust_101',
        accessId: 1,
        userEmail: 'sarah.jenkins@medipulse.io',
        details: 'Consultation reviewed and approved by prescriber',
        createdAt: new Date('2026-08-15T11:00:00Z').toISOString(),
      },
    ],
    ...createOrderCommActions(cleanId),
  };
}
