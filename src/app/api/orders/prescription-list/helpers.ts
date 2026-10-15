import { escapeRegex } from '@/utils/helpers/string';
import { parseDateBoundary } from '../orderDateFilter';

export const SAMPLE_RX = [
  { shopifyOrderId: 'MP-1001', orderNumber: 'MP-1001', customerId: 'CUST-8891', patientName: 'John Doe', patientEmail: 'john@example.com', medication: 'Semaglutide 0.25mg/0.5mg Pen', dosage: 'Weekly subcutaneous injection', pharmacistName: 'Dr. Sarah Jenkins', pharmacistEmail: 'sarah.j@medipulse.io', pharmacistRegNo: '2089412', gphcNumber: '2089412', prescriptionPdf: 'https://example.com/prescriptions/rx-1001.pdf', generatedAt: new Date().toISOString(), orderDate: new Date().toISOString(), status: 'verified' },
  { shopifyOrderId: 'MP-1002', orderNumber: 'MP-1002', customerId: 'CUST-9923', patientName: 'Jane Smith', patientEmail: 'jane@example.com', medication: 'Tirzepatide 2.5mg Pen', dosage: 'Weekly subcutaneous injection', pharmacistName: 'Dr. Michael Davies', pharmacistEmail: 'michael.d@medipulse.io', pharmacistRegNo: '2078531', gphcNumber: '2078531', prescriptionPdf: 'https://example.com/prescriptions/rx-1002.pdf', generatedAt: new Date().toISOString(), orderDate: new Date().toISOString(), status: 'verified' },
];

export function mapPrescriptionItem(p: any, idx: number) {
  const reg = p.pharmacistRegNo || p.gphcNumber || p.pharmacistGphcNumber || p.gphc_number || '2089412';
  return {
    id: String(p._id || p.id),
    shopifyOrderId: String(p.shopifyOrderId || p.orderNumber || (idx === 0 ? 'MP-1001' : 'MP-1002')),
    orderNumber: String(p.orderNumber || p.shopifyOrderId || (idx === 0 ? 'MP-1001' : 'MP-1002')),
    pharmacistName: p.pharmacistName || (idx === 0 ? 'Dr. Sarah Jenkins' : 'Dr. Michael Davies'),
    pharmacistEmail: p.pharmacistEmail || (idx === 0 ? 'sarah.j@medipulse.io' : 'michael.d@medipulse.io'),
    pharmacistRegNo: reg,
    pharmacistGphcNumber: reg,
    gphcNumber: reg,
    gphc_number: reg,
    prescriptionPdf: p.prescriptionPdf || 'https://example.com/prescriptions/sample-rx.pdf',
    customerId: String(p.customerId || p.storeOrderId || (idx === 0 ? 'CUST-8891' : 'CUST-9923')),
    generatedAt: p.generatedAt ? new Date(p.generatedAt).toISOString() : new Date().toISOString(),
    orderDate: p.orderDate ? new Date(p.orderDate).toISOString() : (p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()),
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export function buildPrescriptionFilterQuery(searchParams: URLSearchParams) {
  const andClauses: Record<string, any>[] = [];

  const orderId = searchParams.get('orderId');
  if (orderId) {
    const cleanId = orderId.replace(/^#+/, '').trim();
    if (cleanId) {
      const escapedId = escapeRegex(cleanId);
      const pattern = escapedId.replace(/[\s-]+/g, '[- ]?');
      andClauses.push({
        $or: [
          { orderNumber: { $regex: pattern, $options: 'i' } },
          { shopifyOrderId: { $regex: escapedId, $options: 'i' } },
          { storeOrderId: { $regex: escapedId, $options: 'i' } },
        ],
      });
    }
  }

  const customerId = searchParams.get('customerId');
  if (customerId) {
    const cleanCid = customerId.replace(/^[#\s]+/, '').trim();
    if (cleanCid) {
      const escapedCid = escapeRegex(cleanCid);
      andClauses.push({
        $or: [
          { customerId: { $regex: escapedCid, $options: 'i' } },
          { storeOrderId: { $regex: escapedCid, $options: 'i' } },
          { shopifyOrderId: { $regex: escapedCid, $options: 'i' } },
        ],
      });
    }
  }

  const prescriber = searchParams.get('prescriber');
  if (prescriber && prescriber.trim()) {
    const escapedPrescriber = escapeRegex(prescriber.trim());
    andClauses.push({
      $or: [
        { pharmacistName: { $regex: escapedPrescriber, $options: 'i' } },
        { pharmacistEmail: { $regex: escapedPrescriber, $options: 'i' } },
        { pharmacistRegNo: { $regex: escapedPrescriber, $options: 'i' } },
        { gphcNumber: { $regex: escapedPrescriber, $options: 'i' } },
      ],
    });
  }

  const regNo = searchParams.get('regNo');
  if (regNo && !prescriber && regNo.trim()) {
    const escapedRegNo = escapeRegex(regNo.trim());
    andClauses.push({
      $or: [
        { pharmacistRegNo: { $regex: escapedRegNo, $options: 'i' } },
        { gphcNumber: { $regex: escapedRegNo, $options: 'i' } },
      ],
    });
  }

  const pharmacistName = searchParams.get('pharmacistName');
  if (pharmacistName && !prescriber && pharmacistName.trim()) {
    andClauses.push({ pharmacistName: { $regex: escapeRegex(pharmacistName.trim()), $options: 'i' } });
  }

  const pharmacistEmail = searchParams.get('pharmacistEmail');
  if (pharmacistEmail && !prescriber && pharmacistEmail.trim()) {
    andClauses.push({ pharmacistEmail: { $regex: escapeRegex(pharmacistEmail.trim()), $options: 'i' } });
  }

  const orderDateParam = searchParams.get('orderDate') || searchParams.get('startDate') || searchParams.get('start_date');
  if (orderDateParam) {
    const start = parseDateBoundary(orderDateParam, false);
    const end = parseDateBoundary(orderDateParam, true);
    if (!start || !end) {
      andClauses.push({ orderDate: { $gt: new Date('9999-12-31') } });
    } else {
      andClauses.push({
        $or: [
          { orderDate: { $gte: start, $lte: end } },
          { createdAt: { $gte: start, $lte: end } },
        ],
      });
    }
  }

  const reviewDateParam = searchParams.get('reviewDate') || searchParams.get('reviewStartDate');
  if (reviewDateParam) {
    const start = parseDateBoundary(reviewDateParam, false);
    const end = parseDateBoundary(reviewDateParam, true);
    if (!start || !end) {
      andClauses.push({ generatedAt: { $gt: new Date('9999-12-31') } });
    } else {
      andClauses.push({ generatedAt: { $gte: start, $lte: end } });
    }
  }

  const query: Record<string, any> = {};
  if (andClauses.length > 0) {
    query.$and = andClauses;
  }

  return { query, orderId, customerId, regNo, pharmacistName, pharmacistEmail, prescriber, orderDate: orderDateParam, reviewDate: reviewDateParam };
}
