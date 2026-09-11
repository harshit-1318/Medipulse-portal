import { test, expect } from './fixtures/activityTestBase';

test.describe('Phase 1 — Progressive Primary Filter Combinations', () => {
  test('Test 1: PRIMARY = Search User / Email progressive chain with Clear All reset', async ({ activityLogsPage }) => {
    const initialTotal = await activityLogsPage.getTotalCount();
    expect(initialTotal).toBeGreaterThan(0);

    // 1. Open Active Filters
    await activityLogsPage.openFiltersModal();

    // 2. Primary: Search User / Email
    await activityLogsPage.setSearch('watson');
    await activityLogsPage.closeFiltersModal();
    const count1 = await activityLogsPage.getTotalCount();
    expect(count1).toBeLessThanOrEqual(initialTotal);

    // 3. Add User Role
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.selectRole('Prescriber');
    await activityLogsPage.closeFiltersModal();
    const count2 = await activityLogsPage.getTotalCount();
    expect(count2).toBeLessThanOrEqual(count1);

    // 4. Add Action Type
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.selectAction('Order Status Changed');
    await activityLogsPage.closeFiltersModal();
    const count3 = await activityLogsPage.getTotalCount();
    expect(count3).toBeLessThanOrEqual(count2);

    // 5. Add Page Scope
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.selectPageScope('Orders');
    await activityLogsPage.closeFiltersModal();
    const count4 = await activityLogsPage.getTotalCount();
    expect(count4).toBeLessThanOrEqual(count3);

    // 6. Add Site
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.selectSite('MediPulse Healthcare Portal');
    await activityLogsPage.closeFiltersModal();
    const count5 = await activityLogsPage.getTotalCount();
    expect(count5).toBeLessThanOrEqual(count4);

    // 7. Add Start Date & End Date
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.setStartDate('2026-09-01');
    await activityLogsPage.setEndDate('2026-09-11');
    await activityLogsPage.closeFiltersModal();
    const count6 = await activityLogsPage.getTotalCount();
    expect(count6).toBeLessThanOrEqual(count5);

    // 8. Clear All and verify complete unfiltered dataset restored
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.clickClearAll();
    await activityLogsPage.closeFiltersModal();
    const resetTotal = await activityLogsPage.getTotalCount();
    expect(resetTotal).toBeGreaterThanOrEqual(initialTotal);
    expect(resetTotal).toBeLessThanOrEqual(initialTotal + 2);
  });

  test('Test 2: PRIMARY = Order ID progressive chain with Clear All reset', async ({ activityLogsPage }) => {
    const initialTotal = await activityLogsPage.getTotalCount();

    // 1. Primary: Order ID
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.setOrderId('MP-46287');
    await activityLogsPage.closeFiltersModal();
    const count1 = await activityLogsPage.getTotalCount();
    expect(count1).toBeLessThanOrEqual(initialTotal);

    // 2. Add Search User / Email
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.setSearch('watson');
    // 3. Add User Role
    await activityLogsPage.selectRole('Prescriber');
    // 4. Add Action Type
    await activityLogsPage.selectAction('Order Status Changed');
    await activityLogsPage.closeFiltersModal();
    const count2 = await activityLogsPage.getTotalCount();
    expect(count2).toBeLessThanOrEqual(count1);

    // Clear All
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.clickClearAll();
    await activityLogsPage.closeFiltersModal();
    expect(await activityLogsPage.getTotalCount()).toBe(initialTotal);
  });
});
