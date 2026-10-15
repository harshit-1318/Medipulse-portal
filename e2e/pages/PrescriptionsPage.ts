import { type Page, type Locator } from '@playwright/test';

export class PrescriptionsPage {
  readonly page: Page;
  readonly filtersButton: Locator;
  readonly modalContainer: Locator;
  readonly closeButton: Locator;
  readonly orderIdInput: Locator;
  readonly customerIdInput: Locator;
  readonly prescriberInput: Locator;
  readonly orderDateInput: Locator;
  readonly reviewDateInput: Locator;
  readonly clearAllButton: Locator;
  readonly searchButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly emptyState: Locator;
  readonly totalBadge: Locator;

  private lastApiResponse: any = null;

  constructor(page: Page) {
    this.page = page;
    this.filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
    this.modalContainer = page.locator('div.fixed.inset-0.z-100');
    this.closeButton = this.modalContainer.getByLabel('Close modal');
    this.orderIdInput = this.modalContainer.getByPlaceholder('Order ID...');
    this.customerIdInput = this.modalContainer.getByPlaceholder('Customer ID...');
    this.prescriberInput = this.modalContainer.getByPlaceholder('Search Prescriber (Name, Email, RegNo)');
    this.orderDateInput = this.modalContainer.locator('div:has(> label:has-text("Order Date")) input[type="date"]');
    this.reviewDateInput = this.modalContainer.locator('div:has(> label:has-text("Review Date")) input[type="date"]');
    this.clearAllButton = this.modalContainer.getByRole('button', { name: 'Clear All' });
    this.searchButton = this.modalContainer.getByRole('button', { name: 'Search' });
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');
    this.emptyState = page.locator('text=No prescriptions found');
    this.totalBadge = page.locator('span.bg-blue-50');
  }

  async setupApiInterceptor(): Promise<void> {
    this.page.on('response', async (res) => {
      if (
        (res.url().includes('/api/orders/search') || res.url().includes('/api/orders/prescription-list')) &&
        res.status() === 200
      ) {
        try {
          this.lastApiResponse = await res.json();
        } catch {}
      }
    });
  }

  getLastApiResponse(): any {
    return this.lastApiResponse;
  }

  async goto(): Promise<void> {
    await this.page.goto('/prescriptions', { waitUntil: 'domcontentloaded' });
    await this.table.waitFor({ state: 'visible', timeout: 10000 });
  }

  async openFiltersModal(): Promise<void> {
    if (!(await this.modalContainer.isVisible())) {
      await this.filtersButton.click();
      await this.modalContainer.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  async closeFiltersModal(): Promise<void> {
    if (await this.modalContainer.isVisible()) {
      await this.closeButton.click();
      await this.modalContainer.waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async clickSearch(): Promise<void> {
    const resPromise = this.page.waitForResponse(
      (res) =>
        (res.url().includes('/api/orders/search') || res.url().includes('/api/orders/prescription-list')) &&
        res.status() === 200,
      { timeout: 5000 }
    ).catch(() => null);
    await this.searchButton.click();
    await this.modalContainer.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
    await resPromise;
    await this.page.waitForTimeout(500);
  }

  async clickClearAll(): Promise<void> {
    await this.clearAllButton.click();
  }

  async resetFilters(): Promise<void> {
    await this.openFiltersModal();
    await this.clearAllButton.click();
    await this.clickSearch();
  }

  async getDisplayedRowsCount(): Promise<number> {
    if (await this.emptyState.isVisible()) return 0;
    return await this.tableRows.count();
  }
}
