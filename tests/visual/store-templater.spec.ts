import { expect, type Page, test, type TestInfo } from "@playwright/test";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const defaultAuthStorage = path.join("tests", ".auth", "user.json");
const authStorage = process.env.PLAYWRIGHT_STORAGE_STATE ?? defaultAuthStorage;
const hasAuthStorage = existsSync(authStorage);
const sharePath = process.env.VISUAL_QA_SHARE_PATH;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("store-templater:welcome-dismissed", "true");
    window.localStorage.setItem("store-templater:builder-tour-dismissed", "true");
    window.localStorage.setItem("store-templater:dashboard-tour-dismissed", "true");
  });
});

test.describe("public visual QA", () => {
  test("landing page desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Landing desktop is captured once on desktop.");

    await openStablePage(page, "/");
    await expect(page.getByRole("heading", { name: "Store Templater" })).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "landing-desktop");
  });

  test("landing page mobile French", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile French state only runs on the mobile project.");

    await setLocale(page, "fr");
    await openStablePage(page, "/");
    await expect(page.getByRole("heading", { name: "Store Templater" })).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "landing-mobile-fr");
  });

  test("public share preview desktop", async ({ page }, testInfo) => {
    test.skip(!sharePath, "Set VISUAL_QA_SHARE_PATH=/s/<shareId> to include a real published share preview.");
    test.skip(testInfo.project.name !== "desktop", "Share preview is captured once on desktop.");

    await openStablePage(page, sharePath ?? "/");
    await expect(page.locator("main")).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "share-preview-desktop");
  });

  test("public share preview mobile", async ({ page }, testInfo) => {
    test.skip(!sharePath, "Set VISUAL_QA_SHARE_PATH=/s/<shareId> to include a real published share preview.");
    test.skip(testInfo.project.name !== "mobile", "Mobile share preview only runs on the mobile project.");

    await openStablePage(page, sharePath ?? "/");
    await expect(page.locator("main")).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "share-preview-mobile");
  });
});

test.describe("authenticated visual QA", () => {
  test.use({ storageState: hasAuthStorage ? authStorage : undefined });

  test.beforeEach(() => {
    test.skip(!hasAuthStorage, `Create ${defaultAuthStorage} or set PLAYWRIGHT_STORAGE_STATE to include protected routes.`);
  });

  test("builder desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Builder shell is captured once on desktop.");

    await openStablePage(page, "/builder");
    await expect(page.locator('[data-tour="builder-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-tour="builder-preview"]')).toBeVisible();
    await expect(page.locator('[data-tour="builder-inspector"]')).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "builder-desktop");
  });

  test("builder French desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Builder French state is captured once on desktop.");

    await setLocale(page, "fr");
    await openStablePage(page, "/builder");
    await expect(page.getByText(/mod[eè]les/i).first()).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "builder-desktop-fr");
  });

  test("templates dashboard desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Dashboard is captured once on desktop.");

    await openStablePage(page, "/templates");
    await expect(page.locator('[data-tour="dashboard-filters"]')).toBeVisible();
    await expect(page.locator('[data-tour="dashboard-new-template"]')).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "templates-dashboard-desktop");
  });

  test("private preview desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Private preview desktop is captured once.");

    await openStablePage(page, "/preview");
    await expect(page.getByRole("link", { name: /back to builder/i })).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "private-preview-desktop");
  });

  test("private preview mobile French", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Private preview mobile French state only runs on mobile.");

    await setLocale(page, "fr");
    await openStablePage(page, "/preview");
    await expect(page.locator("main")).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, "private-preview-mobile-fr");
  });
});

async function setLocale(page: Page, locale: "en" | "fr") {
  await page.addInitScript((nextLocale) => {
    window.localStorage.setItem("store-templater:locale", nextLocale);
  }, locale);
}

async function openStablePage(page: Page, url: string) {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("/_next/webpack-hmr")) {
      return;
    }

    if (message.type() === "error" && /hydration|react|failed|error/i.test(message.text())) {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });
  await page.waitForLoadState("networkidle").catch(() => undefined);
  await page.waitForTimeout(250);

  expect(consoleErrors).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    return documentWidth > window.innerWidth + 2;
  });

  expect(overflow).toBe(false);
}

async function saveScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const screenshotDir = path.join(testInfo.project.outputDir, "screenshots");
  await mkdir(screenshotDir, { recursive: true });

  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: path.join(screenshotDir, `${name}.png`),
  });
}
