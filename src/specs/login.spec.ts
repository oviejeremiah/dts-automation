import { test, expect } from '../fixtures/base.fixture';
import { USERS, ERROR_MESSAGES, INVENTORY_URL, INVENTORY_TITLE } from '../utils/test-data';
import { logger } from '../utils/logger';

test.describe('Login functionality', () => {

  test.beforeEach(async ({ loginPage }) => {
    logger.info('Starting login scenario');
    await loginPage.goto();
  });

  test('successful login with valid credentials', async ({ loginPage, inventoryPage }) => {
    logger.info('Scenario: successful login');
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    expect(await inventoryPage.isLoaded()).toBe(true);
    expect(await inventoryPage.getCurrentUrl()).toBe(INVENTORY_URL);
    expect(await inventoryPage.getPageTitle()).toBe(INVENTORY_TITLE);
    logger.info('Scenario passed: successful login');
  });

  test('successful logout after login', async ({ loginPage, inventoryPage }) => {
    logger.info('Scenario: logout after successful login');
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    expect(await inventoryPage.isLoaded()).toBe(true);
    await inventoryPage.logout();
    expect(await loginPage.getCurrentUrl()).toBe('https://www.saucedemo.com/');
    logger.info('Scenario passed: logout');
  });

  test('login fails with invalid password', async ({ loginPage }) => {
    logger.info('Scenario: invalid password');
    await loginPage.login(USERS.standard.username, USERS.invalid.password);
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(ERROR_MESSAGES.invalidCredentials);
    logger.info('Scenario passed: invalid password');
  });

  test('login fails with invalid username', async ({ loginPage }) => {
    logger.info('Scenario: invalid username');
    await loginPage.login(USERS.invalid.username, USERS.standard.password);
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(ERROR_MESSAGES.invalidCredentials);
    logger.info('Scenario passed: invalid username');
  });

  test('login fails with empty username', async ({ loginPage }) => {
    logger.info('Scenario: empty username');
    await loginPage.enterPassword(USERS.standard.password);
    await loginPage.clickLogin();
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(ERROR_MESSAGES.usernameRequired);
    logger.info('Scenario passed: empty username');
  });

  test('login fails with empty password', async ({ loginPage }) => {
    logger.info('Scenario: empty password');
    await loginPage.enterUsername(USERS.standard.username);
    await loginPage.clickLogin();
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(ERROR_MESSAGES.passwordRequired);
    logger.info('Scenario passed: empty password');
  });

  test('login fails with both fields empty', async ({ loginPage }) => {
    logger.info('Scenario: both fields empty');
    await loginPage.clickLogin();
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(ERROR_MESSAGES.usernameRequired);
    logger.info('Scenario passed: both fields empty');
  });

  test('login fails for locked out user', async ({ loginPage }) => {
    logger.info('Scenario: locked out user');
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(ERROR_MESSAGES.lockedOut);
    logger.info('Scenario passed: locked out user');
  });

});