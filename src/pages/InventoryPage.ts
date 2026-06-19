import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class InventoryPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly inventoryList: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.inventoryList.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getPageTitle(): Promise<string> {
    const title = await this.pageTitle.innerText();
    logger.info(`Inventory page title: ${title}`);
    return title;
  }

  async getInventoryItemCount(): Promise<number> {
    const items = this.page.locator('[data-test="inventory-item"]');
    const count = await items.count();
    logger.info(`Inventory item count: ${count}`);
    return count;
  }

  async logout(): Promise<void> {
    logger.info('Logging out');
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}