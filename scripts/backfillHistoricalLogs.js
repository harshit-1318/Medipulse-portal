import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://harshit:HARSHIT-1318@cluster0.f9gfmb5.mongodb.net/?appName=Cluster0';

async function backfill() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  const orders = await db.collection('orders').find({}).sort({ createdAt: 1 }).toArray();
  const prescriptions = await db.collection('prescriptions').find({}).sort({ createdAt: 1 }).toArray();

  console.log(`Found ${users.length} users, ${orders.length} orders, ${prescriptions.length} prescriptions.`);

  const activityCollection = db.collection('activitylogs');

  // Clear existing logs
  await activityCollection.deleteMany({});
  console.log('Cleared existing activity logs.');

  const logsToInsert = [];

  // 1. Initial Super Admin Account Setup (23 July 2026)
  const superAdmin = users.find((u) => u.role === 'super_admin') || {
    name: 'Harshit',
    email: 'kumarharshit370@gmail.com',
    role: 'super_admin',
  };

  const setupDate = new Date('2026-07-23T17:17:05.294Z');
  logsToInsert.push({
    action: 'user_created',
    action_type: 'user_created',
    user: superAdmin.name,
    user_name: superAdmin.name,
    user_email: superAdmin.email,
    role: superAdmin.role,
    user_role: superAdmin.role,
    details: 'Initial Super Admin account provisioned for MediPulse Healthcare Portal',
    page: 'users',
    view: 'users',
    site_id: '65e0123456789abcdef00001',
    count: 1,
    createdAt: setupDate,
    updatedAt: setupDate,
  });

  logsToInsert.push({
    action: 'login_success',
    action_type: 'login_success',
    user: superAdmin.name,
    user_name: superAdmin.name,
    user_email: superAdmin.email,
    role: superAdmin.role,
    user_role: superAdmin.role,
    details: `${superAdmin.name} (${superAdmin.role}) logged in to configure portal settings`,
    page: 'auth',
    view: 'auth',
    site_id: '65e0123456789abcdef00001',
    count: 1,
    createdAt: new Date('2026-07-23T17:25:00.000Z'),
    updatedAt: new Date('2026-07-23T17:25:00.000Z'),
  });

  // 2. Staff Onboarding (07 September 2026)
  const staffUsers = users.filter((u) => u.role !== 'super_admin');
  for (const staff of staffUsers) {
    const userCreatedAt = staff.createdAt ? new Date(staff.createdAt) : new Date('2026-09-07T11:40:58.200Z');

    logsToInsert.push({
      action: 'user_created',
      action_type: 'user_created',
      user: superAdmin.name,
      user_name: superAdmin.name,
      user_email: superAdmin.email,
      role: superAdmin.role,
      user_role: superAdmin.role,
      details: `Created new ${staff.role.replace(/_/g, ' ')} account for ${staff.name} (${staff.email})`,
      page: 'users',
      view: 'users',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: userCreatedAt,
      updatedAt: userCreatedAt,
    });

    // Staff first login
    const loginTime = new Date(userCreatedAt.getTime() + 10 * 60 * 1000);
    logsToInsert.push({
      action: 'login_success',
      action_type: 'login_success',
      user: staff.name,
      user_name: staff.name,
      user_email: staff.email,
      role: staff.role,
      user_role: staff.role,
      details: `${staff.name} (${staff.role.replace(/_/g, ' ')}) logged in to healthcare portal`,
      page: 'auth',
      view: 'auth',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: loginTime,
      updatedAt: loginTime,
    });
  }

  // 3. Orders Timeline (27 August 2026 - 10 September 2026)
  const prescriber = users.find((u) => u.role === 'prescriber') || {
    name: 'Dr. Emily Watson',
    email: 'dr.watson@medipulse.io',
    role: 'prescriber',
  };
  const pharmacist = users.find((u) => u.role === 'pharmacist') || {
    name: 'Marcus Sterling',
    email: 'marcus.sterling@medipulse.io',
    role: 'pharmacist',
  };
  const support = users.find((u) => u.role === 'customer_support') || {
    name: 'Liam Reynolds',
    email: 'liam.reynolds@medipulse.io',
    role: 'customer_support',
  };
  const driver = users.find((u) => u.role === 'driver') || {
    name: 'David Miller',
    email: 'david.miller@medipulse.io',
    role: 'driver',
  };
  const customer = users.find((u) => u.role === 'customer') || {
    name: 'Clara Oswald',
    email: 'clara.oswald@medipulse.io',
    role: 'customer',
  };

  orders.forEach((order, index) => {
    const orderNum = order.orderNumber || `ORD-${10000 + index}`;
    const baseTime = order.createdAt ? new Date(order.createdAt) : new Date('2026-09-08T10:00:00.000Z');

    // Customer order view or placement
    logsToInsert.push({
      action: 'order_created',
      action_type: 'order_created',
      user: order.customerName || customer.name,
      user_name: order.customerName || customer.name,
      user_email: order.customerEmail || customer.email,
      role: 'customer',
      user_role: 'customer',
      orderId: orderNum,
      object_guid: orderNum,
      details: `Order #${orderNum} placed by ${order.customerName || customer.name}`,
      page: 'orders',
      view: 'orders',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: baseTime,
      updatedAt: baseTime,
    });

    // Prescriber GP email sent / clinical review
    const prescriberTime = new Date(baseTime.getTime() + 18 * 60 * 1000);
    logsToInsert.push({
      action: 'gp_email_sent',
      action_type: 'gp_email_sent',
      user: prescriber.name,
      user_name: prescriber.name,
      user_email: prescriber.email,
      role: prescriber.role,
      user_role: prescriber.role,
      orderId: orderNum,
      object_guid: orderNum,
      details: `Sent GP consultation summary letter for order #${orderNum}`,
      page: 'orders',
      view: 'orders',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: prescriberTime,
      updatedAt: prescriberTime,
    });

    // Pharmacist Status update
    const pharmaTime = new Date(baseTime.getTime() + 42 * 60 * 1000);
    logsToInsert.push({
      action: 'order_status_changed',
      action_type: 'order_status_changed',
      user: pharmacist.name,
      user_name: pharmacist.name,
      user_email: pharmacist.email,
      role: pharmacist.role,
      user_role: pharmacist.role,
      orderId: orderNum,
      object_guid: orderNum,
      details: `Status updated to ${order.status || 'processing'} for order #${orderNum}`,
      page: 'orders',
      view: 'orders',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: pharmaTime,
      updatedAt: pharmaTime,
    });

    // For every 2nd order, add customer support message
    if (index % 2 === 0) {
      const supportTime = new Date(baseTime.getTime() + 55 * 60 * 1000);
      logsToInsert.push({
        action: 'customer_message_sent',
        action_type: 'customer_message_sent',
        user: support.name,
        user_name: support.name,
        user_email: support.email,
        role: support.role,
        user_role: support.role,
        orderId: orderNum,
        object_guid: orderNum,
        details: `Dispatched notification SMS to ${order.customerName || customer.name}`,
        page: 'customers',
        view: 'customers',
        site_id: '65e0123456789abcdef00001',
        count: 1,
        createdAt: supportTime,
        updatedAt: supportTime,
      });
    }

    // For completed / dispatched orders, add driver log
    if (order.status === 'completed' || order.status === 'dispatched') {
      const driverTime = new Date(baseTime.getTime() + 75 * 60 * 1000);
      logsToInsert.push({
        action: 'order_status_changed',
        action_type: 'order_status_changed',
        user: driver.name,
        user_name: driver.name,
        user_email: driver.email,
        role: driver.role,
        user_role: driver.role,
        orderId: orderNum,
        object_guid: orderNum,
        details: `Out for delivery by driver ${driver.name}`,
        page: 'orders',
        view: 'orders',
        site_id: '65e0123456789abcdef00001',
        count: 1,
        createdAt: driverTime,
        updatedAt: driverTime,
      });
    }
  });

  // 4. Prescriptions Review Timeline
  prescriptions.forEach((rx, index) => {
    const rxTime = rx.createdAt ? new Date(rx.createdAt) : new Date('2026-09-08T11:00:00.000Z');
    const patientName = rx.patient_name || rx.patientName || 'Patient';

    logsToInsert.push({
      action: 'order_viewed',
      action_type: 'order_viewed',
      user: prescriber.name,
      user_name: prescriber.name,
      user_email: prescriber.email,
      role: prescriber.role,
      user_role: prescriber.role,
      details: `Prescription clinical evaluation completed for ${patientName}`,
      page: 'prescriptions',
      view: 'prescriptions',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: rxTime,
      updatedAt: rxTime,
    });
  });

  // 5. Today's Logins (11 September 2026)
  const today = new Date('2026-09-11T08:22:00.000Z');
  for (const user of users) {
    logsToInsert.push({
      action: 'login_success',
      action_type: 'login_success',
      user: user.name,
      user_name: user.name,
      user_email: user.email,
      role: user.role,
      user_role: user.role,
      details: `${user.name} (${user.role.replace(/_/g, ' ')}) signed in to daily clinic portal`,
      page: 'auth',
      view: 'auth',
      site_id: '65e0123456789abcdef00001',
      count: 1,
      createdAt: today,
      updatedAt: today,
    });
  }

  // Sort chronologically ascending before insert
  logsToInsert.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  console.log(`Inserting ${logsToInsert.length} historical real activity logs...`);
  await activityCollection.insertMany(logsToInsert);
  console.log('✅ Successfully inserted historical real activity logs.');

  const totalCount = await activityCollection.countDocuments();
  console.log(`Total activity logs now in database: ${totalCount}`);

  await mongoose.disconnect();
}

backfill().catch((err) => {
  console.error('Failed to backfill historical logs:', err);
  process.exit(1);
});
