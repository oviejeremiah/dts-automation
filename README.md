# DTS Automation Framework

A production-grade Playwright TypeScript automation framework built using the Page Object Model pattern, developed as part of the HMCTS DTS Software Developer in Test technical assessment.

## Tech stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Language  | TypeScript               |
| Framework | Playwright               |
| Pattern   | Page Object Model        |
| Logging   | Winston                  |
| Browsers  | Chromium · Firefox      |
| Reporting | Playwright HTML Reporter |
| CI        | GitHub Actions           |

## Target application

[Sauce Demo](https://www.saucedemo.com) — an industry-standard web application used for automation practice, covering login, inventory, and checkout flows.

## Prerequisites

- Node.js v20 LTS
- npm

## Setup

```bash
git clone https://github.com/oviejeremiah/dts-automation.git
cd dts-automation
npm install
npx playwright install chromium firefox
```

## Running the framework

### All scenarios across all browsers

```bash
npm test
```

### Chromium only

```bash
npm run test:chromium
```

### Firefox only

```bash
npm run test:firefox
```

### Headed mode (watch the browser)

```bash
npm run test:headed
```

### View HTML report

```bash
npm run report
```

## Scenario coverage

| Scenario                      | Type     | Status  |
| ----------------------------- | -------- | ------- |
| Valid credentials login       | Positive | Covered |
| Successful logout after login | Positive | Covered |
| Invalid password              | Negative | Covered |
| Invalid username              | Negative | Covered |
| Empty username field          | Negative | Covered |
| Empty password field          | Negative | Covered |
| Both fields empty             | Negative | Covered |
| Locked out user               | Negative | Covered |

**Total: 8 scenarios × 2 browsers = 16 executions, 0 failures**

## Project structure


dts-automation/

src/

pages/

BasePage.ts          Abstract base class — shared page methods

LoginPage.ts         Login form interactions and assertions

InventoryPage.ts     Post-login inventory page verification

specs/

login.spec.ts        All 8 login scenarios

utils/

test-data.ts         Credentials, URLs, error message constants

logger.ts            Winston structured logger

fixtures/

base.fixture.ts      Playwright fixture — shared setup and teardown

playwright.config.ts     Framework configuration

package.json

tsconfig.json

README.md

## Design decisions

**Page Object Model** — Each page of the application is encapsulated in its own class that extends `BasePage`. This separates element locators and interactions from scenario logic, making the framework maintainable and readable. Adding new pages requires no changes to existing scenarios.

**Data-test attributes** — All locators use `[data-test="..."]` selectors rather than CSS classes or XPath. These are stable, explicit, and unaffected by styling changes — the standard recommended by the Playwright team and widely adopted in production frameworks.

**Fixture-based setup** — Playwright's built-in fixture system handles browser context creation, page navigation, and teardown automatically. Every scenario gets a fresh browser context with no shared state between runs.

**Winston structured logging** — Every significant action is logged with a timestamp and severity level. This produces a clean audit trail in `logs/automation.log` alongside the visual HTML report, making it straightforward to diagnose failures in CI environments where you cannot watch the browser.

**Centralised test data** — All credentials, URLs, and expected error messages live in `src/utils/test-data.ts`. Changing the target environment or updating expected messages requires editing one file only.

**Two browsers, not three** — WebKit is excluded on Windows due to missing system DLLs (a known Playwright limitation on this platform). The framework is designed to run WebKit in Linux CI environments where the dependencies are available. Chromium and Firefox provide complete cross-browser coverage on Windows.

## CI pipeline

GitHub Actions runs all scenarios on every push to `main` and on every pull request.

## Potential improvements

Given additional time the following would be added:

- Accessibility scanning using `axe-core` via `@axe-core/playwright` on each page
- Performance timing assertions measuring page load against a threshold
- Visual regression using Playwright's built-in screenshot comparison
- WebKit coverage restored via Linux CI runner
- Additional scenario coverage for inventory filtering, cart, and checkout flows
- Environment-based configuration supporting staging and production targets via `.env` files
