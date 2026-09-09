import mongoose from 'mongoose';
import { loadEnv } from './seedConstants.mjs';
import { generateSeedRecord } from './seedGenerator.mjs';

loadEnv();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local or .env');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let date = null, days = 1, count = 10, clean = false;
  for (const arg of args) {
    if (arg.startsWith('--date=')) date = arg.split('=')[1];
    else if (arg === '--today') date = new Date().toISOString().split('T')[0];
    else if (arg === '--yesterday') {
      const d = new Date(); d.setDate(d.getDate() - 1);
      date = d.toISOString().split('T')[0];
    } else if (arg.startsWith('--days=')) days = parseInt(arg.split('=')[1], 10) || 1;
    else if (arg.startsWith('--count=') || arg.startsWith('--orders=')) count = parseInt(arg.split('=')[1], 10) || 10;
    else if (arg === '--clean') clean = true;
  }
  return { date: date || (days === 1 ? new Date().toISOString().split('T')[0] : null), days, count, clean };
}

function getTargetDates(date, days) {
  if (days <= 1) return [date];
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

async function seed() {
  const { date, days, count, clean } = parseArgs();
  console.log(`\n🚀 Connecting to MongoDB Atlas...`);
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected successfully!`);

  const db = mongoose.connection;
  const ordersCol = db.collection('orders'), customersCol = db.collection('customers');
  const rxCol = db.collection('prescriptions'), leadsCol = db.collection('leads');

  if (clean) {
    console.log(`🧹 Cleaning previously seeded mock data...`);
    await ordersCol.deleteMany({ tags: 'mock_seed' });
    await rxCol.deleteMany({ status: 'mock_seed' });
    await leadsCol.deleteMany({ status: 'mock_seed' });
    console.log(`✨ Clean complete.`);
  }

  const targetDates = getTargetDates(date, days);
  console.log(`📅 Target Date(s): ${targetDates.join(', ')}`);
  console.log(`📦 Generating ${count} orders per date (${targetDates.length * count} total)...\n`);

  let totalOrdersCreated = 0;
  for (const dateStr of targetDates) {
    const ordersBatch = [], rxBatch = [], leadsBatch = [];
    for (let i = 0; i < count; i++) {
      const { order, rx, lead, customerName, customerEmail, phone, orderDate, repeatCount } = generateSeedRecord(i, dateStr);
      ordersBatch.push(order);
      rxBatch.push(rx);
      if (lead) leadsBatch.push(lead);
      await customersCol.updateOne(
        { email: customerEmail },
        {
          $set: { name: customerName, email: customerEmail, phone, status: 'active', updatedAt: orderDate },
          $setOnInsert: { createdAt: orderDate },
          $inc: { totalOrders: repeatCount + 1 },
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
  console.log(`\n🎉 SUCCESS! Total ${totalOrdersCreated} orders created.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error('❌ Seeding failed:', err); process.exit(1); });
