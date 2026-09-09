import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables natively without external dotenv dependency
function loadEnv() {
  for (const envFile of ['.env.local', '.env.production', '.env']) {
    const p = path.join(__dirname, '..', envFile);
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf-8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local or .env');
  process.exit(1);
}

const FIRST_NAMES = ['Oliver', 'Emma', 'Liam', 'Sophia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper', 'Daniel'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Taylor', 'Anderson', 'Thomas', 'Wilson', 'Moore', 'Jackson', 'Martin'];
const MEDICATIONS = [
  { name: 'Semaglutide 0.25mg Pen', price: 89.99, tag: 'Weight Management' },
  { name: 'Semaglutide 0.5mg Pen', price: 109.99, tag: 'Weight Management' },
  { name: 'Tirzepatide 2.5mg Pen', price: 120.00, tag: 'GLP-1' },
  { name: 'Tirzepatide 5.0mg Pen', price: 145.00, tag: 'GLP-1' },
  { name: 'Wegovy 1mg FlexTouch', price: 135.50, tag: 'Weight Management' },
  { name: 'Ozempic 1mg Pen', price: 115.00, tag: 'Diabetes / Weight' },
  { name: 'Finasteride 1mg Tablets (28)', price: 28.50, tag: 'Hair Loss' },
  { name: 'Sildenafil 50mg Tablets (8)', price: 34.00, tag: 'Men’s Health' }
];
const STATUSES = ['completed', 'pending_doctor_approval', 'dispatched', 'consultation_approved', 'payment_pending'];

function parseArgs() {
  const args = process.argv.slice(2);
  let date = null;
  let days = 1;
  let count = 10;
  let clean = false;

  for (const arg of args) {
    if (arg.startsWith('--date=')) date = arg.split('=')[1];
    else if (arg === '--today') date = new Date().toISOString().split('T')[0];
    else if (arg === '--yesterday') {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      date = d.toISOString().split('T')[0];
    } else if (arg.startsWith('--days=')) days = parseInt(arg.split('=')[1], 10) || 1;
    else if (arg.startsWith('--count=')) count = parseInt(arg.split('=')[1], 10) || 10;
    else if (arg.startsWith('--orders=')) count = parseInt(arg.split('=')[1], 10) || 10;
    else if (arg === '--clean') clean = true;
  }

  if (!date && days === 1) {
    date = new Date().toISOString().split('T')[0];
  }

  return { date, days, count, clean };
}

function getRandomDateForDay(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const hour = Math.floor(Math.random() * 10) + 9;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

async function seed() {
  const { date, days, count, clean } = parseArgs();
  console.log(`\n🚀 Connecting to MongoDB Atlas...`);
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected successfully!`);

  const db = mongoose.connection;
  const ordersCol = db.collection('orders');
  const customersCol = db.collection('customers');
  const rxCol = db.collection('prescriptions');
  const leadsCol = db.collection('leads');

  if (clean) {
    console.log(`🧹 Cleaning previously seeded mock data...`);
    await ordersCol.deleteMany({ tags: 'mock_seed' });
    await rxCol.deleteMany({ status: 'mock_seed' });
    await leadsCol.deleteMany({ status: 'mock_seed' });
    console.log(`✨ Clean complete.`);
  }

  const targetDates = [];
  if (days > 1) {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      targetDates.push(d.toISOString().split('T')[0]);
    }
  } else {
    targetDates.push(date);
  }

  console.log(`📅 Target Date(s): ${targetDates.join(', ')}`);
  console.log(`📦 Generating ${count} orders per date (${targetDates.length * count} total)...\n`);

  let totalOrdersCreated = 0;

  for (const dateStr of targetDates) {
    const ordersBatch = [];
    const rxBatch = [];
    const leadsBatch = [];

    for (let i = 0; i < count; i++) {
      const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const customerName = `${fn} ${ln}`;
      const customerEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 900 + 100)}@example.com`;
      const phone = `+44 7${Math.floor(100000000 + Math.random() * 900000000)}`;

      const med = MEDICATIONS[Math.floor(Math.random() * MEDICATIONS.length)];
      const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      const orderNum = `MP-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderDate = getRandomDateForDay(dateStr);
      const isUrgent = Math.random() < 0.15;
      const isParked = Math.random() < 0.08;

      ordersBatch.push({
        siteId: '65e0123456789abcdef00001',
        orderNumber: orderNum,
        customerName,
        customerEmail,
        status,
        total: med.price,
        items: [{ name: med.name, quantity: 1, price: med.price }],
        isUrgent,
        isParked,
        tags: ['mock_seed', med.tag],
        shopify_order_id: String(Math.floor(5000000000 + Math.random() * 4000000000)),
        store_order_id: String(Math.floor(100000 + Math.random() * 900000)),
        createdAt: orderDate,
        updatedAt: orderDate,
      });

      rxBatch.push({
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
      });

      if (Math.random() < 0.4) {
        leadsBatch.push({
          siteId: '65e0123456789abcdef00001',
          customerName,
          customerEmail,
          status: 'new',
          notes: [{ text: `Inquired regarding ${med.name}`, createdAt: orderDate }],
          createdAt: orderDate,
          updatedAt: orderDate,
        });
      }

      await customersCol.updateOne(
        { email: customerEmail },
        {
          $set: { name: customerName, email: customerEmail, phone, status: 'active', updatedAt: orderDate },
          $setOnInsert: { createdAt: orderDate },
          $inc: { totalOrders: 1 },
        },
        { upsert: true }
      );
    }

    await ordersCol.insertMany(ordersBatch);
    await rxCol.insertMany(rxBatch);
    if (leadsBatch.length > 0) await leadsCol.insertMany(leadsBatch);

    totalOrdersCreated += ordersBatch.length;
    console.log(`  ✅ [${dateStr}] Created ${ordersBatch.length} orders, ${rxBatch.length} prescriptions, ${leadsBatch.length} leads.`);
  }

  console.log(`\n🎉 SUCCESS! Total ${totalOrdersCreated} fake orders created across specified dates.`);
  await mongoose.disconnect();
  console.log(`🔌 Disconnected from MongoDB. You can now view them on your portal dashboard and orders table!\n`);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
