import { test, expect } from "@playwright/test";

test.describe("Content integrity audit", () => {
  test("no external image URLs — all images served from /assets/", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const images = await page.locator("img").all();
    for (const img of images) {
      const src = await img.getAttribute("src");
      expect(src, `Image has external URL: ${src}`).not.toMatch(/^https?:\/\//);
    }
  });

  test("all external links have rel=noopener noreferrer and target=_blank", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const externalLinks = await page.locator('a[href^="http"]').all();

    expect(externalLinks.length).toBeGreaterThan(0);

    for (const link of externalLinks) {
      const href = await link.getAttribute("href");
      const rel = await link.getAttribute("rel");
      const target = await link.getAttribute("target");

      expect(rel, `Missing rel on link: ${href}`).toContain("noopener");
      expect(rel, `Missing noreferrer on link: ${href}`).toContain(
        "noreferrer",
      );
      expect(target, `Missing target=_blank on link: ${href}`).toBe("_blank");
    }
  });

  test("source badges are present for each section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // SourceBadge renders a span containing "Source: ..."
    const sourceBadges = await page.locator('span:has-text("Source:")').all();
    expect(
      sourceBadges.length,
      "Should have multiple SourceBadge elements throughout the exhibit",
    ).toBeGreaterThanOrEqual(10);
  });

  test("hero image renders at >= 600px width on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heroImage = page.locator("#hero img").first();
    const box = await heroImage.boundingBox();
    expect(box).toBeTruthy();
    expect(
      box!.width,
      "Hero image should be at least 600px wide on desktop",
    ).toBeGreaterThanOrEqual(600);
  });
});

test.describe("Responsive layout verification", () => {
  test("desktop nav anchor lands the section directly below the sticky header", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");
    const benefitsLink = page
      .locator('header nav[aria-label="Exhibit sections"] a[href="#benefits"]')
      .first();
    const benefitsSection = page.locator("section#benefits");

    await benefitsLink.click();
    await page.waitForFunction(() => window.location.hash === "#benefits");
    await page.waitForTimeout(1200);

    const headerBox = await header.boundingBox();
    const sectionBox = await benefitsSection.boundingBox();

    expect(headerBox).toBeTruthy();
    expect(sectionBox).toBeTruthy();
    expect(Math.abs(sectionBox!.y - headerBox!.height)).toBeLessThanOrEqual(2);
  });

  test("desktop nav highlight follows the visible section while scrolling", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const headerNav = page.locator('header nav[aria-label="Exhibit sections"]').first();
    const homeLink = headerNav.locator('a[href="#hero"]');
    const benefitsLink = headerNav.locator('a[href="#benefits"]');
    const timelineLink = headerNav.locator('a[href="#timeline"]');

    await expect(homeLink).toHaveClass(/font-semibold/);

    await page.locator("#benefits").scrollIntoViewIfNeeded();
    await expect(benefitsLink).toHaveClass(/font-semibold/);
    await expect(homeLink).not.toHaveClass(/font-semibold/);

    await page.locator("#timeline").scrollIntoViewIfNeeded();
    await expect(timelineLink).toHaveClass(/font-semibold/);
    await expect(benefitsLink).not.toHaveClass(/font-semibold/);
  });

  test("desktop (1440x900) — no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("tablet (768x1024) — no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("mobile (390x844) — no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("minimum viewport (320x568) — no horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("mobile — hamburger menu is visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const hamburger = page.locator("button[aria-label*='navigation']");
    await expect(hamburger).toBeVisible();
  });

  test("mobile — hamburger opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const hamburger = page.locator("button[aria-label*='navigation']");
    await hamburger.click();

    const mobileNav = page.locator("#mobile-nav-menu");
    await expect(mobileNav).toBeVisible();

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(mobileNav).not.toBeVisible();
  });

  test("all 8 sections render on the page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sectionIds = [
      "hero",
      "energy-density",
      "how-it-works",
      "benefits",
      "safety",
      "fuel-cycle",
      "future-demand",
      "timeline",
    ];

    for (const id of sectionIds) {
      await expect(
        page.locator(`section#${id}`),
        `Section #${id} should exist`,
      ).toHaveCount(1);
    }
  });
});
