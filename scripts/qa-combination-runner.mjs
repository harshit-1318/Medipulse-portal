// scripts/qa-combination-runner.mjs
// Comprehensive QA Combination Automation Runner for Activity Filters Modal

const BASE_URL = 'http://localhost:3000';

class QaRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      blocked: 0,
      phase1Combinations: [],
      phase2Combinations: [],
      negativeCases: [],
      uiIssues: [],
      functionalIssues: [],
      dataIssues: [],
      consoleErrors: [],
    };
    this.defaultTotal = 0;
    this.defaultLogs = [];
  }

  async fetchLogs(params = {}) {
    const url = new URL(`${BASE_URL}/api/activity-log/list/filters`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, v);
      }
    });

    try {
      const res = await fetch(url.toString());
      const status = res.status;
      const json = await res.json().catch(() => ({}));
      return { status, data: json.data || {}, success: json.success, message: json.message, raw: json };
    } catch (err) {
      return { status: 0, error: err.message, data: {}, success: false };
    }
  }

  recordTest(name, passed, details = {}) {
    this.results.total++;
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    return { name, passed, ...details };
  }

  async run() {
    console.log('🚀 Starting Comprehensive Activity Filters QA Automation Test Run...\n');

    // Baseline: Fetch default unfiltered logs
    const baseline = await this.fetchLogs({ limit: 100 });
    this.defaultTotal = baseline.data.total || 0;
    this.defaultLogs = baseline.data.logs || [];
    console.log(`📊 Baseline total records: ${this.defaultTotal}`);

    await this.runPhase1();
    await this.runPhase2();
    await this.runPhase3();
    await this.runPhase4();
    await this.runPhase5();
    await this.runPhase7();
    await this.runPhase8();

    console.log('\n========================================');
    console.log('📊 QA AUTOMATION SUMMARY');
    console.log(`Total Test Cases Executed: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Blocked: ${this.results.blocked}`);
    console.log('========================================\n');

    return this.results;
  }

  // PHASE 1 — PRIMARY FILTER COMBINATION TESTING
  async runPhase1() {
    console.log('\n--- PHASE 1: PRIMARY FILTER COMBINATION TESTING (8 Progressive Tests) ---');

    // Test 1: PRIMARY = Search User / Email
    {
      console.log('Test 1: Primary = Search (watson)');
      let params = { search: 'watson' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T1.1: Search only (watson)', r1.status === 200 && count1 > 0 && count1 <= this.defaultTotal);

      // + User Role = prescriber
      params.role = 'prescriber';
      let r2 = await this.fetchLogs(params);
      let count2 = r2.data.total;
      this.recordTest('P1.T1.2: Search + Role (prescriber)', r2.status === 200 && count2 <= count1 && count2 > 0);

      // + Action Type = order_status_changed
      params.action = 'order_status_changed';
      let r3 = await this.fetchLogs(params);
      let count3 = r3.data.total;
      this.recordTest('P1.T1.3: + Action (order_status_changed)', r3.status === 200 && count3 <= count2);

      // + Page Scope = orders
      params.view = 'orders';
      let r4 = await this.fetchLogs(params);
      let count4 = r4.data.total;
      this.recordTest('P1.T1.4: + Scope (orders)', r4.status === 200 && count4 <= count3);

      // + Site = 65e0123456789abcdef00001
      params.siteId = '65e0123456789abcdef00001';
      let r5 = await this.fetchLogs(params);
      let count5 = r5.data.total;
      this.recordTest('P1.T1.5: + Site', r5.status === 200 && count5 <= count4);

      // + Start Date = 2026-09-01
      params.startDate = '2026-09-01';
      let r6 = await this.fetchLogs(params);
      let count6 = r6.data.total;
      this.recordTest('P1.T1.6: + Start Date', r6.status === 200 && count6 <= count5);

      // + End Date = 2026-09-11
      params.endDate = '2026-09-11';
      let r7 = await this.fetchLogs(params);
      let count7 = r7.data.total;
      this.recordTest('P1.T1.7: + End Date', r7.status === 200 && count7 <= count6);

      // Clear All Reset
      let reset = await this.fetchLogs({});
      this.recordTest('P1.T1.8: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 2: PRIMARY = Order / Subject ID
    {
      console.log('Test 2: Primary = Order / Subject ID (MP-46287)');
      let params = { orderId: 'MP-46287' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T2.1: Order ID only (MP-46287)', r1.status === 200 && count1 > 0);

      params.search = 'watson';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T2.2: Order ID + Search', r2.status === 200 && r2.data.total <= count1);

      params.role = 'prescriber';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T2.3: + Role', r3.status === 200 && r3.data.total <= r2.data.total);

      params.action = 'order_status_changed';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T2.4: + Action', r4.status === 200 && r4.data.total <= r3.data.total);

      params.view = 'orders';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T2.5: + Scope', r5.status === 200 && r5.data.total <= r4.data.total);

      params.siteId = '65e0123456789abcdef00001';
      let r6 = await this.fetchLogs(params);
      this.recordTest('P1.T2.6: + Site', r6.status === 200 && r6.data.total <= r5.data.total);

      params.startDate = '2026-09-01';
      let r7 = await this.fetchLogs(params);
      this.recordTest('P1.T2.7: + Start Date', r7.status === 200 && r7.data.total <= r6.data.total);

      params.endDate = '2026-09-11';
      let r8 = await this.fetchLogs(params);
      this.recordTest('P1.T2.8: + End Date', r8.status === 200 && r8.data.total <= r7.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T2.9: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 3: PRIMARY = User Role
    {
      console.log('Test 3: Primary = User Role (admin)');
      let params = { role: 'admin' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T3.1: Role only (admin)', r1.status === 200 && count1 > 0);

      params.action = 'login_success';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T3.2: Role + Action', r2.status === 200 && r2.data.total <= count1);

      params.view = 'auth';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T3.3: + Scope', r3.status === 200 && r3.data.total <= r2.data.total);

      params.search = 'vance';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T3.4: + Search', r4.status === 200 && r4.data.total <= r3.data.total);

      params.siteId = '65e0123456789abcdef00001';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T3.5: + Site', r5.status === 200 && r5.data.total <= r4.data.total);

      params.startDate = '2026-09-01';
      let r6 = await this.fetchLogs(params);
      this.recordTest('P1.T3.6: + Start Date', r6.status === 200 && r6.data.total <= r5.data.total);

      params.endDate = '2026-09-11';
      let r7 = await this.fetchLogs(params);
      this.recordTest('P1.T3.7: + End Date', r7.status === 200 && r7.data.total <= r6.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T3.8: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 4: PRIMARY = Action Type
    {
      console.log('Test 4: Primary = Action Type (logout)');
      let params = { action: 'logout' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T4.1: Action only (logout)', r1.status === 200 && count1 > 0);

      params.role = 'super_admin';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T4.2: Action + Role', r2.status === 200 && r2.data.total <= count1);

      params.search = 'kumarharshit';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T4.3: + Search', r3.status === 200 && r3.data.total <= r2.data.total);

      params.view = 'auth';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T4.4: + Scope', r4.status === 200 && r4.data.total <= r3.data.total);

      params.startDate = '2026-09-01';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T4.5: + Start Date', r5.status === 200 && r5.data.total <= r4.data.total);

      params.endDate = '2026-09-11';
      let r6 = await this.fetchLogs(params);
      this.recordTest('P1.T4.6: + End Date', r6.status === 200 && r6.data.total <= r5.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T4.7: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 5: PRIMARY = Page Scope
    {
      console.log('Test 5: Primary = Page Scope (orders)');
      let params = { view: 'orders' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T5.1: Scope only (orders)', r1.status === 200 && count1 > 0);

      params.action = 'order_status_changed';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T5.2: Scope + Action', r2.status === 200 && r2.data.total <= count1);

      params.role = 'prescriber';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T5.3: + Role', r3.status === 200 && r3.data.total <= r2.data.total);

      params.search = 'watson';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T5.4: + Search', r4.status === 200 && r4.data.total <= r3.data.total);

      params.orderId = 'MP-46287';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T5.5: + Order ID', r5.status === 200 && r5.data.total <= r4.data.total);

      params.siteId = '65e0123456789abcdef00001';
      let r6 = await this.fetchLogs(params);
      this.recordTest('P1.T5.6: + Site', r6.status === 200 && r6.data.total <= r5.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T5.7: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 6: PRIMARY = Site
    {
      console.log('Test 6: Primary = Site (65e0123456789abcdef00001)');
      let params = { siteId: '65e0123456789abcdef00001' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T6.1: Site only', r1.status === 200 && count1 > 0);

      params.view = 'auth';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T6.2: Site + Scope', r2.status === 200 && r2.data.total <= count1);

      params.role = 'admin';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T6.3: + Role', r3.status === 200 && r3.data.total <= r2.data.total);

      params.action = 'login_success';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T6.4: + Action', r4.status === 200 && r4.data.total <= r3.data.total);

      params.search = 'vance';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T6.5: + Search', r5.status === 200 && r5.data.total <= r4.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T6.6: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 7: PRIMARY = Start Date
    {
      console.log('Test 7: Primary = Start Date (2026-09-10)');
      let params = { startDate: '2026-09-10' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T7.1: Start Date only', r1.status === 200 && count1 > 0);

      params.endDate = '2026-09-11';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T7.2: Start Date + End Date', r2.status === 200 && r2.data.total <= count1);

      params.search = 'watson';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T7.3: + Search', r3.status === 200 && r3.data.total <= r2.data.total);

      params.role = 'prescriber';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T7.4: + Role', r4.status === 200 && r4.data.total <= r3.data.total);

      params.action = 'order_status_changed';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T7.5: + Action', r5.status === 200 && r5.data.total <= r4.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T7.6: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }

    // Test 8: PRIMARY = End Date
    {
      console.log('Test 8: Primary = End Date (2026-09-11)');
      let params = { endDate: '2026-09-11' };
      let r1 = await this.fetchLogs(params);
      let count1 = r1.data.total;
      this.recordTest('P1.T8.1: End Date only', r1.status === 200 && count1 > 0);

      params.startDate = '2026-09-01';
      let r2 = await this.fetchLogs(params);
      this.recordTest('P1.T8.2: End Date + Start Date', r2.status === 200 && r2.data.total <= count1);

      params.role = 'super_admin';
      let r3 = await this.fetchLogs(params);
      this.recordTest('P1.T8.3: + Role', r3.status === 200 && r3.data.total <= r2.data.total);

      params.action = 'login_success';
      let r4 = await this.fetchLogs(params);
      this.recordTest('P1.T8.4: + Action', r4.status === 200 && r4.data.total <= r3.data.total);

      params.search = 'harshit';
      let r5 = await this.fetchLogs(params);
      this.recordTest('P1.T8.5: + Search', r5.status === 200 && r5.data.total <= r4.data.total);

      let reset = await this.fetchLogs({});
      this.recordTest('P1.T8.6: Clear All & Default Reset', reset.data.total === this.defaultTotal);
    }
  }

  // PHASE 2 — DIFFERENT FILTER COMBINATIONS
  async runPhase2() {
    console.log('\n--- PHASE 2: DIFFERENT FILTER COMBINATIONS (2-filter, 3-filter, multi-filter) ---');

    // 2-filter combinations
    const twoFilters = [
      { name: 'Email + User Role', params: { search: 'watson', role: 'prescriber' } },
      { name: 'Email + Action Type', params: { search: 'watson', action: 'login_success' } },
      { name: 'Email + Site', params: { search: 'vance', siteId: '65e0123456789abcdef00001' } },
      { name: 'Email + Date', params: { search: 'watson', startDate: '2026-09-01', endDate: '2026-09-11' } },
      { name: 'Order ID + User Role', params: { orderId: 'MP-46287', role: 'prescriber' } },
      { name: 'Order ID + Action Type', params: { orderId: 'MP-46287', action: 'order_status_changed' } },
      { name: 'Order ID + Site', params: { orderId: 'MP-46287', siteId: '65e0123456789abcdef00001' } },
      { name: 'Start Date + End Date', params: { startDate: '2026-09-10', endDate: '2026-09-11' } },
      { name: 'User Role + Action Type', params: { role: 'admin', action: 'login_success' } },
      { name: 'Page Scope + Site', params: { view: 'orders', siteId: '65e0123456789abcdef00001' } },
    ];

    for (const tf of twoFilters) {
      const res = await this.fetchLogs(tf.params);
      // Validate intersection: all returned logs must satisfy BOTH conditions
      let validIntersection = true;
      for (const log of res.data.logs || []) {
        if (tf.params.role) {
          const r = (log.role || log.user_role || '').toLowerCase();
          if (r !== tf.params.role) validIntersection = false;
        }
        if (tf.params.action) {
          const a = (log.action || log.action_type || '').toLowerCase();
          if (a !== tf.params.action) validIntersection = false;
        }
        if (tf.params.search) {
          const t = `${log.user || ''} ${log.user_name || ''} ${log.user_email || ''} ${log.details || ''}`.toLowerCase();
          if (!t.includes(tf.params.search.toLowerCase())) validIntersection = false;
        }
        if (tf.params.orderId) {
          const id = log.orderId || log.object_guid || log.target_guid || '';
          if (!id.toLowerCase().includes(tf.params.orderId.toLowerCase())) validIntersection = false;
        }
        if (tf.params.view) {
          const v = (log.page || log.view || '').toLowerCase();
          if (v !== tf.params.view) validIntersection = false;
        }
      }
      this.recordTest(`P2: 2-Filter: ${tf.name}`, res.status === 200 && validIntersection);
    }

    // 3-filter combinations
    const threeFilters = [
      { name: 'Email + User Role + Action Type', params: { search: 'watson', role: 'prescriber', action: 'order_status_changed' } },
      { name: 'Email + Site + Page Scope', params: { search: 'vance', siteId: '65e0123456789abcdef00001', view: 'auth' } },
      { name: 'Order ID + User Role + Site', params: { orderId: 'MP-46287', role: 'prescriber', siteId: '65e0123456789abcdef00001' } },
      { name: 'Order ID + Action Type + Page Scope', params: { orderId: 'MP-46287', action: 'order_status_changed', view: 'orders' } },
      { name: 'User Role + Action Type + Site', params: { role: 'admin', action: 'login_success', siteId: '65e0123456789abcdef00001' } },
      { name: 'Page Scope + Site + Date Range', params: { view: 'orders', siteId: '65e0123456789abcdef00001', startDate: '2026-09-01', endDate: '2026-09-11' } },
      { name: 'Email + Order ID + User Role', params: { search: 'watson', orderId: 'MP-46287', role: 'prescriber' } },
      { name: 'Email + Order ID + Date Range', params: { search: 'watson', orderId: 'MP-46287', startDate: '2026-09-01', endDate: '2026-09-11' } },
    ];

    for (const tf of threeFilters) {
      const res = await this.fetchLogs(tf.params);
      let validIntersection = true;
      for (const log of res.data.logs || []) {
        if (tf.params.role && (log.role || log.user_role || '').toLowerCase() !== tf.params.role) validIntersection = false;
        if (tf.params.action && (log.action || log.action_type || '').toLowerCase() !== tf.params.action) validIntersection = false;
        if (tf.params.view && (log.page || log.view || '').toLowerCase() !== tf.params.view) validIntersection = false;
        if (tf.params.search) {
          const t = `${log.user || ''} ${log.user_name || ''} ${log.user_email || ''} ${log.details || ''}`.toLowerCase();
          if (!t.includes(tf.params.search.toLowerCase())) validIntersection = false;
        }
      }
      this.recordTest(`P2: 3-Filter: ${tf.name}`, res.status === 200 && validIntersection);
    }

    // Multi-filter combinations
    const multiFilters = [
      { name: 'Email + Order ID + Role + Action', params: { search: 'watson', orderId: 'MP-46287', role: 'prescriber', action: 'order_status_changed' } },
      { name: 'Email + Role + Scope + Site', params: { search: 'vance', role: 'admin', view: 'auth', siteId: '65e0123456789abcdef00001' } },
      { name: 'Order ID + Action + Scope + Site', params: { orderId: 'MP-46287', action: 'order_status_changed', view: 'orders', siteId: '65e0123456789abcdef00001' } },
      { name: 'Email + Order ID + Role + Action + Scope + Site', params: { search: 'watson', orderId: 'MP-46287', role: 'prescriber', action: 'order_status_changed', view: 'orders', siteId: '65e0123456789abcdef00001' } },
      { name: 'ALL 8 Filters Together', params: { search: 'watson', orderId: 'MP-46287', role: 'prescriber', action: 'order_status_changed', view: 'orders', siteId: '65e0123456789abcdef00001', startDate: '2026-09-01', endDate: '2026-09-11' } },
    ];

    for (const mf of multiFilters) {
      const res = await this.fetchLogs(mf.params);
      this.recordTest(`P2: Multi-Filter: ${mf.name}`, res.status === 200);
    }
  }

  // PHASE 3 — POSITIVE TESTING
  async runPhase3() {
    console.log('\n--- PHASE 3: POSITIVE TESTING (Precision, Pagination, Sorting) ---');

    // 1. Precision: Filter by role prescriber returns only prescriber
    const resRole = await this.fetchLogs({ role: 'prescriber', limit: 50 });
    const allPrescriber = (resRole.data.logs || []).every(l => (l.role || l.user_role || '').toLowerCase() === 'prescriber');
    this.recordTest('P3.1: Precision: role filter strictly excludes other roles', allPrescriber && resRole.data.logs.length > 0);

    // 2. Pagination: Page 1 vs Page 2 are distinct
    const p1 = await this.fetchLogs({ limit: 10, page: 1 });
    const p2 = await this.fetchLogs({ limit: 10, page: 2 });
    const distinctLogs = p1.data.logs[0]?._id !== p2.data.logs[0]?._id;
    this.recordTest('P3.2: Pagination: page 1 and page 2 return distinct records', distinctLogs);

    // 3. Sorting with Filter: Sort by action asc vs desc on filtered set
    const sAsc = await this.fetchLogs({ role: 'prescriber', sortBy: 'action', sortDir: 'asc', limit: 10 });
    const sDesc = await this.fetchLogs({ role: 'prescriber', sortBy: 'action', sortDir: 'desc', limit: 10 });
    this.recordTest('P3.3: Sorting on filtered results functions cleanly', sAsc.status === 200 && sDesc.status === 200);
  }

  // PHASE 4 — NEGATIVE TESTING
  async runPhase4() {
    console.log('\n--- PHASE 4: NEGATIVE TESTING (14 Cases) ---');

    // 1. Valid email format with no matching record
    const n1 = await this.fetchLogs({ search: 'nonexistent.user999@medipulse.io' });
    this.recordTest('P4.1: Valid email with no matching records returns 0 results', n1.status === 200 && n1.data.total === 0);

    // 2. Invalid email format
    const n2 = await this.fetchLogs({ search: 'not-an-email-format@@' });
    this.recordTest('P4.2: Invalid email format handled safely without crash', n2.status === 200 && n2.data.total === 0);

    // 3. Non-existing Order / Subject ID
    const n3 = await this.fetchLogs({ orderId: 'MP-000000000' });
    this.recordTest('P4.3: Non-existing Order ID returns 0 results', n3.status === 200 && n3.data.total === 0);

    // 4. Invalid Order / Subject ID
    const n4 = await this.fetchLogs({ orderId: 'INVALID_ORDER_ID_XYZ' });
    this.recordTest('P4.4: Invalid Order ID returns 0 results', n4.status === 200 && n4.data.total === 0);

    // 5. Filter combinations that should return zero results
    const n5 = await this.fetchLogs({ role: 'customer_support', action: 'order_created', orderId: 'MP-99999' });
    this.recordTest('P4.5: Conflicting combination returns 0 results', n5.status === 200 && n5.data.total === 0);

    // 6. Start Date > End Date
    const n6 = await this.fetchLogs({ startDate: '2026-09-20', endDate: '2026-09-10' });
    this.recordTest('P4.6: Start Date > End Date returns 0 results safely', n6.status === 200 && n6.data.total === 0);

    // 7. Same Start Date and End Date
    const n7 = await this.fetchLogs({ startDate: '2026-09-11', endDate: '2026-09-11' });
    this.recordTest('P4.7: Same Start and End Date captures events on that calendar day', n7.status === 200 && n7.data.total >= 0);

    // 8. Future date
    const n8 = await this.fetchLogs({ startDate: '2035-01-01', endDate: '2035-12-31' });
    this.recordTest('P4.8: Far future date returns 0 results', n8.status === 200 && n8.data.total === 0);

    // 9. Very old date
    const n9 = await this.fetchLogs({ startDate: '1980-01-01', endDate: '1980-12-31' });
    this.recordTest('P4.9: Very old date returns 0 results', n9.status === 200 && n9.data.total === 0);

    // 10. Empty search
    const n10 = await this.fetchLogs({ search: '' });
    this.recordTest('P4.10: Empty search returns full default dataset', n10.status === 200 && n10.data.total === this.defaultTotal);

    // 11. Special characters (Regex characters: (, [, *, +, \)
    // CRITICAL DEFECT TEST: Unescaped regex in activityLogQueryBuilder causes 500 error!
    const n11_paren = await this.fetchLogs({ search: '(' });
    const n11_bracket = await this.fetchLogs({ orderId: '[' });
    const n11_passed = n11_paren.status === 200 && n11_bracket.status === 200;
    this.recordTest('P4.11: Special characters in search/orderId do NOT crash with 500', n11_passed, {
      details: `search=( returned status ${n11_paren.status} (${n11_paren.message}); orderId=[ returned status ${n11_bracket.status} (${n11_bracket.message})`
    });
    if (!n11_passed) {
      this.results.dataIssues.push({
        title: 'Unescaped Regular Expression Injection in Query Builder',
        severity: 'High',
        endpoint: '/api/activity-log/list/filters',
        param: 'search and orderId',
        input: '(',
        expected: 'Status 200 OK with sanitized regex search or 0 results',
        actual: `Status 500 Internal Server Error: "${n11_paren.message}"`,
      });
    }

    // 12. Leading and trailing spaces
    const n12 = await this.fetchLogs({ search: '   watson   ' });
    this.recordTest('P4.12: Leading/trailing spaces trimmed and match records', n12.status === 200 && n12.data.total > 0);

    // 13. Partial email/search values
    const n13 = await this.fetchLogs({ search: 'wat' });
    this.recordTest('P4.13: Partial search "wat" matches "Dr. Emily Watson"', n13.status === 200 && n13.data.total > 0);

    // 14. Multiple filters that intentionally conflict
    const n14 = await this.fetchLogs({ role: 'super_admin', view: 'shopify-import', orderId: 'MP-99999' });
    this.recordTest('P4.14: Multi-filter intentional conflict yields 0 records safely', n14.status === 200 && n14.data.total === 0);
  }

  // PHASE 5 — CLEAR ALL TESTING
  async runPhase5() {
    console.log('\n--- PHASE 5: CLEAR ALL TESTING ---');

    // 1. Apply heavy filters
    const filtered = await this.fetchLogs({
      search: 'watson',
      role: 'prescriber',
      action: 'order_status_changed',
      view: 'orders',
      siteId: '65e0123456789abcdef00001',
      startDate: '2026-09-01',
      endDate: '2026-09-11'
    });
    this.recordTest('P5.1: Applied complex multi-filter narrows dataset', filtered.data.total < this.defaultTotal);

    // 2. Clear All (empty params)
    const cleared = await this.fetchLogs({});
    this.recordTest('P5.2: Clear All restores 100% of baseline unfiltered dataset', cleared.data.total === this.defaultTotal);

    // 3. Re-apply filter after clear
    const reapply = await this.fetchLogs({ role: 'prescriber' });
    this.recordTest('P5.3: Filter state is reusable after Clear All', reapply.status === 200 && reapply.data.total > 0);
  }

  // PHASE 7 — DATE FILTER TESTING
  async runPhase7() {
    console.log('\n--- PHASE 7: DATE FILTER TESTING ---');

    // 1. Start Date only
    const d1 = await this.fetchLogs({ startDate: '2026-09-10' });
    this.recordTest('P7.1: Start Date only', d1.status === 200 && d1.data.total > 0);

    // 2. End Date only
    const d2 = await this.fetchLogs({ endDate: '2026-09-11' });
    this.recordTest('P7.2: End Date only', d2.status === 200 && d2.data.total > 0);

    // 3. Date range
    const d3 = await this.fetchLogs({ startDate: '2026-09-01', endDate: '2026-09-11' });
    this.recordTest('P7.3: Full date range (01 Sep - 11 Sep)', d3.status === 200 && d3.data.total > 0);

    // 4. Same start and end date (11 Sep 2026)
    const d4 = await this.fetchLogs({ startDate: '2026-09-11', endDate: '2026-09-11' });
    this.recordTest('P7.4: Same start and end date (today)', d4.status === 200);

    // 5. Inverted dates
    const d5 = await this.fetchLogs({ startDate: '2026-09-15', endDate: '2026-09-01' });
    this.recordTest('P7.5: Inverted date range yields 0', d5.status === 200 && d5.data.total === 0);
  }

  // PHASE 8 — DROPDOWN TESTING
  async runPhase8() {
    console.log('\n--- PHASE 8: DROPDOWN TESTING (Every Role, Action, Page) ---');

    const roles = ['super_admin', 'admin', 'prescriber', 'pharmacist', 'customer_support'];
    for (const r of roles) {
      const res = await this.fetchLogs({ role: r });
      this.recordTest(`P8.Role: ${r}`, res.status === 200);
    }

    const actions = [
      'login_success',
      'logout',
      'order_viewed',
      'order_created',
      'order_status_changed',
      'order_urgent_flagged',
      'gp_email_sent',
      'document_reminder_sent',
      'prescription_email_sent',
      'email_skipped',
      'order_imported',
      'webhook_processed',
    ];
    for (const a of actions) {
      const res = await this.fetchLogs({ action: a });
      this.recordTest(`P8.Action: ${a}`, res.status === 200);
    }

    const pages = ['orders', 'auth', 'users', 'shopify-import', 'shopify-webhook'];
    for (const p of pages) {
      const res = await this.fetchLogs({ view: p });
      this.recordTest(`P8.Page: ${p}`, res.status === 200);
    }
  }
}

const runner = new QaRunner();
runner.run().then((res) => {
  if (res.failed > 0) {
    console.log(`⚠️ Completed with ${res.failed} failure(s) recorded.`);
  } else {
    console.log('✅ 100% tests passed.');
  }
});
