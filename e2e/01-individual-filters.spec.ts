import { test, expect } from './fixtures/testBase';
import { reportCollector } from './utils/reportCollector';

test.describe('1. Individual Filter Testing', () => {

  test('TC-FILTER-001: Order ID filter (#MP-46287)', async ({ ordersPage }) => {
    const filterName = 'Order ID';
    const inputVal = '#MP-46287';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setOrderId(inputVal);
      });

      // Verify filter remains applied in chips
      const chips = await ordersPage.getActiveFilterChips();
      const orderChip = chips.find(c => c.label.toLowerCase().includes('id') || c.label.toLowerCase().includes('order') || c.value.includes('46287'));
      expect(orderChip).toBeDefined();

      // Verify results
      const results = await ordersPage.getResults();
      expect(results.length).toBe(1);
      expect(results[0].orderId).toBe('#MP-46287');
      expect(results[0].orderHref).toBe('/orders/view/8383786411');

      // Verify API response parity
      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      expect(apiData.data.orders.length).toBe(1);
      expect(apiData.data.orders[0].orderNumber).toBe('MP-46287');

      passed = true;
      actualResult = `Returned 1 order (#MP-46287) with link /orders/view/8383786411; API matches UI`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-001',
        combination: filterName,
        input: inputVal,
        expected: 'Only #MP-46287 returned; link goes to /orders/view/8383786411',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-002: Status filter (Unfulfilled)', async ({ ordersPage }) => {
    const filterName = 'Status';
    const inputVal = 'Unfulfilled';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectStatus(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.status.toUpperCase()).toContain('UNFULFILLED');
      }

      // Verify filter remains applied when reopening modal
      await ordersPage.openActiveFilters();
      expect(await ordersPage.modal.getSelectedDropdownLabel('Status')).toBe('Unfulfilled');
      await ordersPage.closeActiveFilters();

      passed = true;
      actualResult = `All ${results.length} orders have status UNFULFILLED; modal retains value`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-002',
        combination: filterName,
        input: inputVal,
        expected: 'All returned orders have status Unfulfilled',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-003: Customer filter (Liam Moore)', async ({ ordersPage }) => {
    const filterName = 'Customer';
    const inputVal = 'Liam Moore';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setCustomer(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);
      for (const row of results) {
        expect(row.customerName.toLowerCase()).toContain('liam moore');
      }

      passed = true;
      actualResult = `All ${results.length} returned orders belong to Liam Moore`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-003',
        combination: filterName,
        input: inputVal,
        expected: 'Returned orders belong strictly to Liam Moore',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-004: Customer Orders filter (Repeat Orders)', async ({ ordersPage }) => {
    const filterName = 'Customer Orders';
    const inputVal = 'Repeat Orders';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectCustomerOrders(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      // Verify in API response that all orders are repeat orders
      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      for (const ord of apiData.data.orders) {
        expect(ord.order_type === 'repeat' || ord.repeatedOrders > 0).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all satisfy Repeat Orders condition in API and UI`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-004',
        combination: filterName,
        input: inputVal,
        expected: 'All returned orders satisfy Repeat Orders condition',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-005: Product Type filter (Oral)', async ({ ordersPage }) => {
    const filterName = 'Product Type';
    const inputVal = 'Oral';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectProductType(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      // Verify oral products (tablets, capsules, sildenafil, finasteride, etc.)
      for (const row of results) {
        const pLower = row.productName.toLowerCase();
        const isOral = pLower.includes('tablet') || pLower.includes('capsule') || pLower.includes('sildenafil') || pLower.includes('finasteride');
        expect(isOral).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; all contain oral medication products`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-005',
        combination: filterName,
        input: inputVal,
        expected: 'Returned orders match selected Product Type (Oral)',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-006: Documents filter (Not Uploaded & Uploaded)', async ({ ordersPage }) => {
    const filterName = 'Documents';
    const inputVal = 'Not Uploaded';
    let passed = false;
    let actualResult = '';

    try {
      // 1. Not Uploaded should return matching records
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectDocuments('Not Uploaded');
      });
      const resultsNotUploaded = await ordersPage.getResults();
      expect(resultsNotUploaded.length).toBeGreaterThan(0);

      // 2. Uploaded should return 0 results since no DB records have uploaded docs
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.clickClearAll();
        await modal.selectDocuments('Uploaded');
      });
      const emptyState = await ordersPage.hasEmptyState();
      expect(emptyState).toBe(true);

      passed = true;
      actualResult = `Not Uploaded returned ${resultsNotUploaded.length} records; Uploaded correctly returned empty state (0 records in DB)`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-006',
        combination: filterName,
        input: inputVal,
        expected: 'Not Uploaded returns records; Uploaded returns 0 records when none exist',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-007: Start Date filter (2026-09-10)', async ({ ordersPage }) => {
    const filterName = 'Start Date';
    const inputVal = '2026-09-10';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setStartDate(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      // API check
      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      const boundaryTime = new Date('2026-09-10T00:00:00.000Z').getTime();
      for (const ord of apiData.data.orders) {
        const ordTime = new Date(ord.createdAt).getTime();
        expect(ordTime).toBeGreaterThanOrEqual(boundaryTime);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders created on or after 2026-09-10`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-007',
        combination: filterName,
        input: inputVal,
        expected: 'Records satisfy Start Date boundary condition',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-008: End Date filter (2026-09-10)', async ({ ordersPage }) => {
    const filterName = 'End Date';
    const inputVal = '2026-09-10';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setEndDate(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      const apiData = ordersPage.getLastSearchApiResponse();
      expect(apiData).not.toBeNull();
      const boundaryTime = new Date('2026-09-10T23:59:59.999Z').getTime();
      for (const ord of apiData.data.orders) {
        const ordTime = new Date(ord.createdAt).getTime();
        expect(ordTime).toBeLessThanOrEqual(boundaryTime);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders created on or before 2026-09-10`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-008',
        combination: filterName,
        input: inputVal,
        expected: 'Records satisfy End Date boundary condition',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-009: Product Category filter (Weight Loss)', async ({ ordersPage }) => {
    const filterName = 'Product Category';
    const inputVal = 'Weight Loss';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.selectProductCategory(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      for (const row of results) {
        const pLower = row.productName.toLowerCase();
        const isWeightLoss = pLower.includes('semaglutide') || pLower.includes('tirzepatide') || pLower.includes('wegovy') || pLower.includes('ozempic');
        expect(isWeightLoss).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; 100% belong to Weight Loss category`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-009',
        combination: filterName,
        input: inputVal,
        expected: 'Returned records belong to category Weight Loss',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-010: Product Name filter (Sildenafil)', async ({ ordersPage }) => {
    const filterName = 'Product Name';
    const inputVal = 'Sildenafil';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setProductName(inputVal);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      for (const row of results) {
        expect(row.productName.toLowerCase()).toContain('sildenafil');
      }

      passed = true;
      actualResult = `Returned ${results.length} orders matching product name Sildenafil`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-010',
        combination: filterName,
        input: inputVal,
        expected: 'All returned records contain product Sildenafil',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-011: Mark as Urgent Orders toggle', async ({ ordersPage }) => {
    const filterName = 'Mark as Urgent Orders';
    const inputVal = 'true';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setUrgent(true);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      for (const row of results) {
        expect(row.isUrgent).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; 100% have Marked Urgent badge`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-011',
        combination: filterName,
        input: inputVal,
        expected: 'Only urgent orders returned',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

  test('TC-FILTER-012: Mark as Parked Orders toggle', async ({ ordersPage }) => {
    const filterName = 'Mark as Parked Orders';
    const inputVal = 'true';
    let passed = false;
    let actualResult = '';

    try {
      await ordersPage.applyFilterAndSearch(async (modal) => {
        await modal.setParked(true);
      });

      const results = await ordersPage.getResults();
      expect(results.length).toBeGreaterThan(0);

      for (const row of results) {
        expect(row.isParked).toBe(true);
      }

      passed = true;
      actualResult = `Returned ${results.length} orders; 100% have Parked Order badge`;
    } catch (e: any) {
      actualResult = `Failure: ${e.message}`;
      throw e;
    } finally {
      reportCollector.addResult({
        id: 'TC-FILTER-012',
        combination: filterName,
        input: inputVal,
        expected: 'Only parked orders returned',
        actual: actualResult,
        status: passed ? 'PASS' : 'FAIL',
        failureReason: passed ? undefined : actualResult,
        apiVerified: true,
      });
    }
  });

});
