import { FIRST_NAMES, LAST_NAMES, MEDICATIONS, STATUSES } from './seedConstants.mjs';

export function getRandomDateForDay(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const hour = Math.floor(Math.random() * 10) + 9;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

export function generateSeedRecord(index, dateStr) {
  const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const isRepeat = index > 0 && Math.random() < 0.35;
  const repeatCount = isRepeat ? Math.floor(Math.random() * 3) + 1 : 0;
  const customerName = `${fn} ${ln}`;
  const customerEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 900 + 100)}@example.com`;
  const phone = `+44 7${Math.floor(100000000 + Math.random() * 900000000)}`;

  const med = MEDICATIONS[Math.floor(Math.random() * MEDICATIONS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  const orderNum = `MP-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderDate = getRandomDateForDay(dateStr);

  let fulfillmentStatus = 'unfulfilled';
  if (status === 'on_hold') fulfillmentStatus = 'on_hold';
  else if (status === 'cancelled') fulfillmentStatus = 'cancelled';
  else if (['completed', 'fulfilled', 'dispatched'].includes(status)) fulfillmentStatus = 'fulfilled';

  const order = {
    siteId: '65e0123456789abcdef00001',
    orderNumber: orderNum,
    customerName,
    customerEmail,
    status,
    fulfillment_status: fulfillmentStatus,
    total: med.price,
    items: [{ name: med.name, quantity: 1, price: med.price }],
    isUrgent: Math.random() < 0.15,
    isParked: Math.random() < 0.08,
    tags: ['mock_seed', med.tag],
    shopify_order_id: String(Math.floor(5000000000 + Math.random() * 4000000000)),
    store_order_id: String(Math.floor(100000 + Math.random() * 900000)),
    order_type: isRepeat ? 'repeat' : 'first',
    repeatedOrders: repeatCount,
    repeatCount,
    createdAt: orderDate,
    updatedAt: orderDate,
  };

  const rx = {
    orderNumber: orderNum,
    patientName: customerName,
    patientEmail: customerEmail,
    medication: med.name,
    dosage: 'Standard 1x weekly',
    pharmacistName: 'Dr. Sarah Jenkins',
    pharmacistEmail: 'sarah.j@medipulse.io',
    pharmacistRegNo: '2089412',
    gphcNumber: '2089412',
    status: status === 'completed' ? 'verified' : 'pending_review',
    orderDate,
    generatedAt: orderDate,
    createdAt: orderDate,
    updatedAt: orderDate,
  };

  const lead = Math.random() < 0.4 ? {
    siteId: '65e0123456789abcdef00001',
    customerName,
    customerEmail,
    status: 'new',
    notes: [{ text: `Inquired regarding ${med.name}`, createdAt: orderDate }],
    createdAt: orderDate,
    updatedAt: orderDate,
  } : null;

  return { order, rx, lead, customerName, customerEmail, phone, orderDate, repeatCount };
}
