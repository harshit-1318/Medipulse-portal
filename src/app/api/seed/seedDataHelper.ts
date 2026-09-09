const FIRST_NAMES = ['Oliver', 'Emma', 'Liam', 'Sophia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Mia'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Taylor', 'Wilson', 'Moore'];
const MEDICATIONS = [
  { name: 'Semaglutide 0.25mg Pen', price: 89.99, tag: 'Weight Management' },
  { name: 'Semaglutide 0.5mg Pen', price: 109.99, tag: 'Weight Management' },
  { name: 'Tirzepatide 2.5mg Pen', price: 120.00, tag: 'GLP-1' },
  { name: 'Wegovy 1mg FlexTouch', price: 135.50, tag: 'Weight Management' },
  { name: 'Ozempic 1mg Pen', price: 115.00, tag: 'Diabetes / Weight' },
];
const STATUSES = ['completed', 'pending_doctor_approval', 'dispatched', 'consultation_approved', 'payment_pending'];

export function getRandomDateForDay(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const hour = Math.floor(Math.random() * 9) + 9;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

export function generateSeedBatch(dateStr: string, count: number) {
  const orders: any[] = [];
  const rxList: any[] = [];
  const customers: any[] = [];

  for (let i = 0; i < count; i++) {
    const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const isRepeat = i > 0 && Math.random() < 0.35;
    const repeatCount = isRepeat ? Math.floor(Math.random() * 3) + 1 : 0;
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 900 + 100)}@example.com`;
    const phone = `+44 7${Math.floor(100000000 + Math.random() * 900000000)}`;

    const med = MEDICATIONS[Math.floor(Math.random() * MEDICATIONS.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const orderNum = `MP-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = getRandomDateForDay(dateStr);

    orders.push({
      siteId: '65e0123456789abcdef00001',
      orderNumber: orderNum,
      customerName: name,
      customerEmail: email,
      status,
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
    });

    rxList.push({
      orderNumber: orderNum,
      patientName: name,
      patientEmail: email,
      medication: med.name,
      dosage: 'Standard 1x weekly',
      status: status === 'completed' ? 'verified' : 'pending_review',
      orderDate,
      generatedAt: orderDate,
      createdAt: orderDate,
      updatedAt: orderDate,
    });

    customers.push({ name, email, phone, status: 'active', totalOrders: repeatCount + 1, orderDate });
  }

  return { orders, rxList, customers };
}
