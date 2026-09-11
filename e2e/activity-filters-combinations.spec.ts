import { test, expect } from './fixtures/activityTestBase';

test.describe('Active Filters Modal — Comprehensive Combination & E2E Validation', () => {
  test('Phase 9: Modal UI Elements and Layout Validation', async ({ activityLogsPage }) => {
    await activityLogsPage.openFiltersModal();
    expect(await activityLogsPage.isModalVisible()).toBe(true);

    // Header and inputs check
    await expect(activityLogsPage.headerTitle).toBeVisible();
    await expect(activityLogsPage.searchInput).toBeVisible();
    await expect(activityLogsPage.orderIdInput).toBeVisible();
    await expect(activityLogsPage.startDateInput).toBeVisible();
    await expect(activityLogsPage.endDateInput).toBeVisible();
    await expect(activityLogsPage.clearAllButton).toBeVisible();
    await expect(activityLogsPage.closeButton).toBeVisible();

    // Verify placeholder text
    await expect(activityLogsPage.searchInput).toHaveAttribute('placeholder', 'e.g. john@example.com');
    await expect(activityLogsPage.orderIdInput).toHaveAttribute('placeholder', 'e.g. 1277551893');

    // Close via header button
    await activityLogsPage.closeViaHeader();
    expect(await activityLogsPage.isModalVisible()).toBe(false);
  });

  test('Phase 1 & 2: Progressive Combination Filter Application and Intersection', async ({ activityLogsPage }) => {
    const initialTotal = await activityLogsPage.getTotalCount();
    expect(initialTotal).toBeGreaterThan(0);

    await activityLogsPage.openFiltersModal();

    // 1. Primary filter: Search
    await activityLogsPage.setSearch('watson');
    // 2. Add Role
    await activityLogsPage.selectRole('Prescriber');
    // 3. Add Action
    await activityLogsPage.selectAction('Order Status Changed');
    // 4. Add Scope
    await activityLogsPage.selectPageScope('Orders');
    // 5. Add Dates
    await activityLogsPage.setStartDate('2026-09-01');
    await activityLogsPage.setEndDate('2026-09-11');

    await activityLogsPage.closeFiltersModal();

    // Check filtered results
    const filteredTotal = await activityLogsPage.getTotalCount();
    expect(filteredTotal).toBeLessThanOrEqual(initialTotal);

    // Re-open and verify persistence
    await activityLogsPage.openFiltersModal();
    expect(await activityLogsPage.getSearch()).toBe('watson');
    expect(await activityLogsPage.getDropdownValue('User Role')).toBe('Prescriber');
    expect(await activityLogsPage.getDropdownValue('Action Type')).toBe('Order Status Changed');
    expect(await activityLogsPage.getDropdownValue('Page Scope')).toBe('Orders');
    expect(await activityLogsPage.getStartDate()).toBe('2026-09-01');
    expect(await activityLogsPage.getEndDate()).toBe('2026-09-11');

    // Clear all
    await activityLogsPage.clickClearAll();
    await activityLogsPage.closeFiltersModal();

    // Reset restored
    const resetTotal = await activityLogsPage.getTotalCount();
    expect(resetTotal).toBe(initialTotal);
  });

  test('Phase 4: Negative No-Result Empty State Handling', async ({ activityLogsPage }) => {
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.setSearch('nonexistent.qa.test@medipulse.io');
    await activityLogsPage.closeFiltersModal();

    // Empty state should be visible
    await expect(activityLogsPage.emptyState).toBeVisible({ timeout: 5000 });
    expect(await activityLogsPage.getTotalCount()).toBe(0);

    // Reset
    await activityLogsPage.openFiltersModal();
    await activityLogsPage.clickClearAll();
    await activityLogsPage.closeFiltersModal();

    await expect(activityLogsPage.emptyState).toBeHidden({ timeout: 5000 });
  });

  test('Phase 6: Modal Dismiss via Escape Key', async ({ activityLogsPage }) => {
    await activityLogsPage.openFiltersModal();
    expect(await activityLogsPage.isModalVisible()).toBe(true);

    await activityLogsPage.closeViaEscape();
    expect(await activityLogsPage.isModalVisible()).toBe(false);
  });
});
