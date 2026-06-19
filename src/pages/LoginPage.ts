import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorDismissButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error"] button');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async enterUsername(username: string): Promise<void> {
    logger.info(`Entering username: ${username}`);
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    logger.info('Entering password');
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    logger.info('Clicking login button');
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    const text = await this.errorMessage.innerText();
    logger.info(`Error message displayed: ${text}`);
    return text;
  }

  async isErrorDisplayed(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async dismissError(): Promise<void> {
    await this.errorDismissButton.click();
    logger.info('Dismissed error message');
  }

  async isUsernameFieldHighlighted(): Promise<boolean> {
    const classes = await this.usernameInput.getAttribute('class') ?? '';
    return classes.includes('error');
  }

  async isPasswordFieldHighlighted(): Promise<boolean> {
    const classes = await this.passwordInput.getAttribute('class') ?? '';
    return classes.includes('error');
  }
}