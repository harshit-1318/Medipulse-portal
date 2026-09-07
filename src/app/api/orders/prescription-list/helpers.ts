export const SAMPLE_RX = [
  { shopifyOrderId: 'MP-1001', orderNumber: 'MP-1001', customerId: 'CUST-8891', patientName: 'John Doe', patientEmail: 'john@example.com', medication: 'Semaglutide 0.25mg/0.5mg Pen', dosage: 'Weekly subcutaneous injection', pharmacistName: 'Dr. Sarah Jenkins', pharmacistEmail: 'sarah.j@medipulse.io', pharmacistRegNo: '2089412', gphcNumber: '2089412', prescriptionPdf: 'https://example.com/prescriptions/rx-1001.pdf', generatedAt: new Date().toISOString(), orderDate: new Date().toISOString(), status: 'verified' },
  { shopifyOrderId: 'MP-1002', orderNumber: 'MP-1002', customerId: 'CUST-9923', patientName: 'Jane Smith', patientEmail: 'jane@example.com', medication: 'Tirzepatide 2.5mg Pen', dosage: 'Weekly subcutaneous injection', pharmacistName: 'Dr. Michael Davies', pharmacistEmail: 'michael.d@medipulse.io', pharmacistRegNo: '2078531', gphcNumber: '2078531', prescriptionPdf: 'https://example.com/prescriptions/rx-1002.pdf', generatedAt: new Date().toISOString(), orderDate: new Date().toISOString(), status: 'verified' },
];

export function mapPrescriptionItem(p: any, idx: number) {
  return {
    id: String(p._id || p.id),
    shopifyOrderId: String(p.shopifyOrderId || p.orderNumber || (idx === 0 ? 'MP-1001' : 'MP-1002')),
    pharmacistName: p.pharmacistName || (idx === 0 ? 'Dr. Sarah Jenkins' : 'Dr. Michael Davies'),
    pharmacistEmail: p.pharmacistEmail || (idx === 0 ? 'sarah.j@medipulse.io' : 'michael.d@medipulse.io'),
    pharmacistRegNo: p.pharmacistRegNo || p.gphcNumber || (idx === 0 ? '2089412' : '2078531'),
    pharmacistGphcNumber: p.gphcNumber || p.pharmacistRegNo || (idx === 0 ? '2089412' : '2078531'),
    gphcNumber: p.gphcNumber || p.pharmacistRegNo || (idx === 0 ? '2089412' : '2078531'),
    gphc_number: p.gphcNumber || p.pharmacistRegNo || (idx === 0 ? '2089412' : '2078531'),
    prescriptionPdf: p.prescriptionPdf || 'https://example.com/prescriptions/sample-rx.pdf',
    customerId: p.customerId && p.customerId !== 'N/A' ? String(p.customerId) : (idx === 0 ? 'CUST-8891' : 'CUST-9923'),
    generatedAt: p.generatedAt ? new Date(p.generatedAt).toISOString() : new Date().toISOString(),
    orderDate: p.orderDate ? new Date(p.orderDate).toISOString() : new Date().toISOString(),
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export function buildPrescriptionFilterQuery(searchParams: URLSearchParams) {
  const orderId = searchParams.get('orderId');
  const customerId = searchParams.get('customerId');
  const regNo = searchParams.get('regNo');
  const pharmacistName = searchParams.get('pharmacistName');
  const pharmacistEmail = searchParams.get('pharmacistEmail');
  const startDate = searchParams.get('start_date');

  const query: any = {};
  if (orderId) {
    query.$or = [
      { shopifyOrderId: { $regex: orderId, $options: 'i' } },
      { orderNumber: { $regex: orderId, $options: 'i' } },
    ];
  }
  if (customerId) query.customerId = { $regex: customerId, $options: 'i' };
  if (regNo) {
    query.$or = [
      { pharmacistRegNo: { $regex: regNo, $options: 'i' } },
      { gphcNumber: { $regex: regNo, $options: 'i' } },
    ];
  }
  if (pharmacistName) query.pharmacistName = { $regex: pharmacistName, $options: 'i' };
  if (pharmacistEmail) query.pharmacistEmail = { $regex: pharmacistEmail, $options: 'i' };
  if (startDate) query.createdAt = { $gte: new Date(startDate) };

  return { query, orderId, customerId, regNo, pharmacistName, pharmacistEmail };
}
