import { type Page, type Locator, expect } from '@playwright/test';
import { ActiveFiltersModal } from './ActiveFiltersModal';

export interface OrderRowData {
  orderId: string;
  orderHref: string;
  orderDate: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerId: string;
  productName: string;
  isUrgent: boolean;
  isParked: boolean;
}

export class OrdersPage {
  readonly page: Page;
  readonly modal: ActiveFiltersModal;
  readonly filtersButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly emptyStateCell: Locator;
  readonly activeFilterChipsContainer: Locator;
  readonly chipsClearAllButton: Locator;

  private lastSearchApiResponse: any = null;

  constructor(page: Page) {
    this.page = page;
    this.modal = new ActiveFiltersModal(page);
    this.filtersButton = page.getByRole('button', { name: 'Filters', exact: true });
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr').filter({ hasNot: page.locator('td:has-text("Loading data...")') });
    this.emptyStateCell = page.locator('tbody tr td:has-text("No results")');
    this.activeFilterChipsContainer = page.locator('div:has(> div > span > span.text-slate-500)');
    this.chipsClearAllButton = page.getByRole('button', { name: 'Clear All' }).filter({ hasNot: this.modal.modalContainer });
  }

  async setupApiInterceptor(): Promise<void> {
    this.page.on('response', async (response) => {
      if ((response.url().includes('/api/orders/search') || response.url().includes('/api/orders/order-list')) && response.status() === 200) {
        try {
          const json = await response.json();
          this.lastSearchApiResponse = json;
        } catch {
          // ignore non-json
        }
      }
    });
  }

  getLastSearchApiResponse(): any {
    return this.lastSearchApiResponse;
  }

  async goto(): Promise<void> {
    await this.page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await this.waitForTableLoad();
  }

  async waitForTableLoad(): Promise<void> {
    // Wait for any loading spinner to disappear
    const loader = this.page.locator('td:has-text("Loading data...")');
    if (await loader.isVisible()) {
      await loader.waitFor({ state: 'hidden', timeout: 10000 });
    }
    // Ensure table body is mounted
    await this.page.locator('tbody').waitFor({ state: 'visible', timeout: 10000 });
  }

  async openActiveFilters(): Promise<void> {
    if (!(await this.modal.isVisible())) {
      await this.filtersButton.click();
      await this.modal.waitForOpen();
    }
  }

  async closeActiveFilters(): Promise<void> {
    if (await this.modal.isVisible()) {
      await this.modal.closeModal();
    }
  }

  async hasEmptyState(): Promise<boolean> {
    await this.waitForTableLoad();
    return await this.emptyStateCell.isVisible();
  }

  async getResultCount(): Promise<number> {
    await this.waitForTableLoad();
    if (await this.hasEmptyState()) return 0;
    // Exclude note rows
    const regularRows = this.page.locator('tbody tr').filter({ has: this.page.locator('td a[href*="/orders/view/"]') });
    return await regularRows.count();
  }

  async getResults(): Promise<OrderRowData[]> {
    await this.waitForTableLoad();
    if (await this.hasEmptyState()) return [];

    const rows = this.page.locator('tbody tr').filter({ has: this.page.locator('td a span.font-mono') });
    const count = await rows.count();
    const rowsData: OrderRowData[] = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const link = row.locator('td a:has(span.font-mono)').first();

      const orderId = (await link.locator('span.font-mono').textContent())?.trim() || '';
      const orderHref = (await link.getAttribute('href')) || '';
      const isUrgent = (await link.locator('.badge-pro-urgent').isVisible()) || false;
      const isParked = (await link.locator('.badge-pro-parked').isVisible()) || false;

      // Status cell
      const statusCell = row.locator('td').nth(2);
      const status = (await statusCell.textContent())?.trim() || '';

      // Customer cell
      const customerCell = row.locator('td').nth(3);
      const customerName = (await customerCell.locator('span').first().textContent())?.trim() || '';
      const customerEmail = (await customerCell.locator('span').nth(1).textContent())?.trim() || '';
      const customerId = (await customerCell.locator('span').nth(2).textContent())?.trim() || '';

      // Product cell
      const productCell = row.locator('td').nth(5);
      const productName = (await productCell.textContent())?.trim() || '';

      rowsData.push({
        orderId,
        orderHref,
        orderDate: '',
        status,
        customerName,
        customerEmail,
        customerId,
        productName,
        isUrgent,
        isParked,
      });
    }

    return rowsData;
  }

  async getActiveFilterChips(): Promise<{ label: string; value: string }[]> {
    const badges = this.page.locator('span.group.text-indigo-700, div.group.text-indigo-700');
    const count = await badges.count();
    const results: { label: string; value: string }[] = [];

    for (let i = 0; i < count; i++) {
      const badge = badges.nth(i);
      const text = (await badge.textContent())?.trim() || '';
      if (text.includes(':')) {
        const [label, ...valParts] = text.split(':');
        results.push({ label: label.trim(), value: valParts.join(':').trim() });
      } else {
        results.push({ label: text, value: text });
      }
    }

    return results;
  }

  async clearFiltersViaChips(): Promise<void> {
    if (await this.chipsClearAllButton.isVisible()) {
      await this.chipsClearAllButton.click();
      await this.waitForTableLoad();
    }
  }

  // Complete helper to apply filters and search
  async applyFilterAndSearch(action: (modal: ActiveFiltersModal) => Promise<void>): Promise<void> {
    await this.openActiveFilters();
    await action(this.modal);
    await this.modal.clickSearch();
    await this.waitForTableLoad();
  }

  async resetAllFilters(): Promise<void> {
    await this.openActiveFilters();
    await this.modal.clickClearAll();
    await this.modal.clickSearch();
    await this.waitForTableLoad();
  }
}
