import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string = ''): Promise<void> {
    const url = `https://www.saucedemo.com${path}`;
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async takeScreenshot(name: string): Promise<void> {
    logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({
      path: `playwright-report/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}