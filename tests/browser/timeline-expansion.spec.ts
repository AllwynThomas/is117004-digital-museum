import { test, expect } from "@playwright/test";

const slugs = [
  {
    slug: "chicago-pile-1",
    year: "1942",
    title: "Chicago Pile-1",
    imageAlt:
      "Photograph of Chicago Pile-1 under construction at Stagg Field, University of Chicago, 1942",
  },
  {
    slug: "obninsk-ussr",
    year: "1954",
    title: "Obninsk, USSR",
    imageAlt:
      "Interior of the Obninsk Nuclear Power Plant reactor hall, USSR",
  },
  {
    slug: "shippingport",
    year: "1957",
    title: "Shippingport, Pennsylvania",
    imageAlt:
      "Aerial photograph of Shippingport Atomic Power Station, Pennsylvania",
  },
  {
    slug: "three-mile-island",
    year: "1979",
    title: "Three Mile Island",
    imageAlt:
      "Aerial view of Three Mile Island cooling towers, Dauphin County, Pennsylvania",
  },
  {
    slug: "chernobyl",
    year: "1986",
    title: "Chernobyl",
    imageAlt:
      "Chernobyl Reactor 4 New Safe Confinement structure, Chornobyl Exclusion Zone",
  },
  {
    slug: "fukushima-daiichi",
    year: "2011",
    title: "Fukushima Daiichi",
    imageAlt:
      "Aerial view of Fukushima Daiichi nuclear power plant following the March 2011 tsunami",
  },
  {
    slug: "nuclear-renaissance",
    year: "2020s",
    title: "Nuclear Renaissance",
    imageAlt: "Conceptual rendering of a Small Modular Reactor facility",
  },
];

// ── Test 29 — All 7 event pages render ──────────────────────────────────────

test.describe("Test 29 — All 7 event pages render with correct title and h1", () => {
  for (const { slug, year, title } of slugs) {
    test(`/timeline/${slug}`, async ({ page }) => {
      await page.goto(`/timeline/${slug}`);
      await expect(page).toHaveTitle(
        `${year} — ${title} | Nuclear Energy Museum`,
      );
      await expect(page.locator("h1")).toContainText(title);
    });
  }
});

// ── Test 29b — No prose (entry.description) on event pages ──────────────────

test.describe(
  "Test 29b — entry.description text is not visible on event pages",
  () => {
    const descriptions = [
      "First controlled nuclear chain reaction",
      "First nuclear power plant connected to an electrical grid",
      "First full-scale commercial nuclear power plant",
      "Partial meltdown of a reactor in Pennsylvania",
      "Worst nuclear accident in history",
      "Tsunami-caused meltdowns at three reactors",
      "Small Modular Reactors enter the licensing pipeline",
    ];

    for (let i = 0; i < slugs.length; i++) {
      const { slug } = slugs[i];
      const description = descriptions[i];
      test(`/timeline/${slug} omits description: "${description.slice(0, 40)}…"`, async ({
        page,
      }) => {
        await page.goto(`/timeline/${slug}`);
        await expect(
          page.getByText(description, { exact: false }),
        ).not.toBeVisible();
      });
    }
  },
);

// ── Test 30 — 404 for unknown slugs ─────────────────────────────────────────

test("Test 30 — 404 for unknown slug", async ({ page }) => {
  await page.goto("/timeline/unknown-slug");
  // out/404.html has <h1 class="next-error-h1">404</h1>
  await expect(page.locator("h1.next-error-h1")).toBeVisible();
  await expect(page.locator("h1.next-error-h1")).toHaveText("404");
});

// ── Test 31 — Dropdown event links navigate correctly ───────────────────────

test("Test 31 — Dropdown event links navigate to correct /timeline/[slug]", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const trigger = page.locator('[aria-haspopup="menu"]');

  for (const { slug, year, title } of slugs) {
    await page.goto("/");
    await trigger.hover();
    await expect(page.locator('[role="menu"]')).toBeVisible();
    const link = page
      .locator('[role="menuitem"]')
      .filter({ hasText: `${year} — ${title}` });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/timeline/${slug}`));
  }
});

// ── Test 32 — "Timeline Overview" link in dropdown ──────────────────────────

test("Test 32 — Timeline Overview link in dropdown navigates to /#timeline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const trigger = page.locator('[aria-haspopup="menu"]');
  await trigger.hover();
  await expect(page.locator('[role="menu"]')).toBeVisible();
  const overviewLink = page
    .locator('[role="menuitem"]')
    .filter({ hasText: "Timeline Overview" });
  await overviewLink.click();
  await expect(page).toHaveURL(/#timeline/);
});

// ── Test 33 — Mobile sub-list links navigate ────────────────────────────────

test("Test 33 — Mobile sub-list expands, event link navigates, menu closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // Open hamburger menu
  const hamburger = page.locator('[aria-label="Open navigation menu"]');
  await hamburger.click();

  // Expand Timeline accordion row (scope to mobile nav to avoid desktop button)
  const timelineAccordion = page
    .locator("nav#mobile-nav-menu")
    .getByRole("button", { name: "Timeline" });
  await timelineAccordion.click();

  // Sub-list should be visible
  const subList = page.locator("nav#mobile-nav-menu ul ul");
  await expect(subList).toBeVisible();

  // Tap the first event link
  const eventLink = page
    .locator("nav#mobile-nav-menu a")
    .filter({ hasText: "1942 — Chicago Pile-1" });
  await eventLink.click();

  // Assert correct navigation
  await expect(page).toHaveURL(/\/timeline\/chicago-pile-1/);

  // Assert hamburger menu is closed after navigation
  await expect(page.locator("nav#mobile-nav-menu")).not.toBeVisible();
});

// ── Test 34 — Dropdown keyboard navigation (WAI-ARIA Menu Button pattern) ───

test("Test 34 — Full WAI-ARIA Menu Button keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const trigger = page.locator('[aria-haspopup="menu"]');

  // 1. Focus trigger — dropdown must be closed
  await page.focus('[aria-haspopup="menu"]');
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  // 2. Enter — opens dropdown
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  // 3. ArrowDown from trigger — focuses first menu item
  await page.keyboard.press("ArrowDown");
  const items = page.locator('[role="menuitem"]');
  await expect(items.first()).toBeFocused();

  // 4. ArrowDown — focuses second menu item
  await page.keyboard.press("ArrowDown");
  await expect(items.nth(1)).toBeFocused();

  // 5. ArrowUp — returns to first menu item
  await page.keyboard.press("ArrowUp");
  await expect(items.first()).toBeFocused();

  // 6. End — focuses last menu item
  await page.keyboard.press("End");
  await expect(items.last()).toBeFocused();

  // 7. Home — focuses first menu item
  await page.keyboard.press("Home");
  await expect(items.first()).toBeFocused();

  // 8. Escape — closes dropdown, returns focus to trigger
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();

  // 9. Enter to open again, Tab — closes dropdown
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

// ── Test 35 — aria-expanded state ────────────────────────────────────────────

test("Test 35 — aria-expanded toggles correctly on Timeline trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const trigger = page.locator('[aria-haspopup="menu"]');

  // Initially closed
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  // Hover opens dropdown
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  // Move mouse away — dropdown closes
  await page.mouse.move(0, 0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

// ── Test 36 — imageAlt visible as DOM content on all 7 event pages ───────────

test.describe(
  "Test 36 — imageAlt text is visible DOM content on event pages",
  () => {
    for (const { slug, imageAlt } of slugs) {
      test(`/timeline/${slug} shows imageAlt as visible text`, async ({
        page,
      }) => {
        await page.goto(`/timeline/${slug}`);
        const placeholderText = page
          .getByText(imageAlt, { exact: false })
          .first();
        await expect(placeholderText).toBeVisible();
      });
    }
  },
);

// ── Test 38 — Stat card source traceability ──────────────────────────────────

test("Test 38 — Every event page renders stat cards with SourceBadge", async ({
  page,
}) => {
  for (const { slug } of slugs) {
    await page.goto(`/timeline/${slug}`);
    // The page renders 3 stat card badges + 1 or more section-level sourceId badges
    const sourceBadges = page.locator('span:has-text("Source:")');
    const count = await sourceBadges.count();
    expect(count).toBeGreaterThanOrEqual(3);
  }
});

// ── Test 39 — Prev/next navigation correctness ───────────────────────────────

test("Test 39 — Prev/next navigation chains through all 7 events", async ({
  page,
}) => {
  // Forward: chicago-pile-1 → obninsk → shippingport → three-mile-island →
  //          chernobyl → fukushima-daiichi → nuclear-renaissance
  await page.goto("/timeline/chicago-pile-1");

  await page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/obninsk-ussr/);

  await page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/shippingport/);

  await page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/three-mile-island/);

  await page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/chernobyl/);

  await page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/fukushima-daiichi/);

  await page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/nuclear-renaissance/);

  // Backward: nuclear-renaissance → fukushima-daiichi
  await page
    .locator('a[href^="/timeline/"]:has-text("←")')
    .first()
    .click();
  await expect(page).toHaveURL(/\/timeline\/fukushima-daiichi/);
});

// ── Test 40 — First event has no prev link ───────────────────────────────────

test("Test 40 — Chicago Pile-1 has no prev link in EventNav", async ({
  page,
}) => {
  await page.goto("/timeline/chicago-pile-1");
  const prevLink = page
    .locator('a[href^="/timeline/"]:has-text("←")')
    .first();
  await expect(prevLink).not.toBeVisible();
});

// ── Test 41 — Last event has no next link ────────────────────────────────────

test("Test 41 — Nuclear Renaissance has no next link in EventNav", async ({
  page,
}) => {
  await page.goto("/timeline/nuclear-renaissance");
  const nextLink = page
    .locator('a[href^="/timeline/"]:has-text("→")')
    .first();
  await expect(nextLink).not.toBeVisible();
});

// ── Test 42 — SourceBadge external link security ─────────────────────────────

test("Test 42 — External links on event pages have rel=noopener noreferrer and target=_blank", async ({
  page,
}) => {
  for (const testSlug of ["chernobyl", "chicago-pile-1"]) {
    await page.goto(`/timeline/${testSlug}`);
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  }
});

// ── Test 43 — Desktop event page layout (1440 × 900) ────────────────────────

test("Test 43 — Desktop (1440px): two-column layout, no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/timeline/chernobyl");

  // No horizontal overflow
  const overflow = await page.evaluate(
    () => document.body.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);

  // Two-column: scope to main to avoid matching footer grid
  const grid = page.locator('main .grid').first();
  // Use computed style to verify two-column layout
  const gridTemplateColumns = await grid.evaluate(
    (el) => window.getComputedStyle(el).gridTemplateColumns,
  );
  // Two columns produce two space-separated values (e.g. "576px 576px")
  const columnValues = gridTemplateColumns.trim().split(/\s+/);
  expect(columnValues.length).toBe(2);
});

// ── Test 44 — Mobile event page layout (390 × 844) ──────────────────────────

test("Test 44 — Mobile (390px): single-column layout, no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/timeline/chernobyl");

  // No horizontal overflow
  const overflow = await page.evaluate(
    () => document.body.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);

  // Single-column: stats container below image container
  const gridChildren = page.locator(
    '.grid.grid-cols-1.md\\:grid-cols-2 > div',
  );
  const imageBox = await gridChildren.first().boundingBox();
  const statsBox = await gridChildren.last().boundingBox();
  expect(imageBox).toBeTruthy();
  expect(statsBox).toBeTruthy();
  expect(statsBox!.y).toBeGreaterThan(imageBox!.y + imageBox!.height / 2);
});

// ── Test 45 — Desktop dropdown visible (1440 × 900) ─────────────────────────

test("Test 45 — Desktop dropdown panel visible with 8 links and no clipping", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const trigger = page.locator('[aria-haspopup="menu"]');
  await trigger.hover();

  const panel = page.locator('[role="menu"]');
  await expect(panel).toBeVisible();

  const box = await panel.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);

  const links = panel.locator('[role="menuitem"]');
  await expect(links).toHaveCount(8);

  // All links visible within viewport
  for (let i = 0; i < 8; i++) {
    await expect(links.nth(i)).toBeVisible();
  }
});

// ── Test 46 — Mobile sub-list visible (390 × 844) ───────────────────────────

test("Test 46 — Mobile sub-list shows 8 links with no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // Open hamburger
  const hamburger = page.locator('[aria-label="Open navigation menu"]');
  await hamburger.click();

  // Expand Timeline accordion (scope to mobile nav to avoid desktop button)
  const timelineAccordionBtn = page
    .locator("nav#mobile-nav-menu")
    .getByRole("button", { name: "Timeline" });
  await timelineAccordionBtn.click();

  // Sub-list visible
  const subList = page.locator("nav#mobile-nav-menu ul ul");
  await expect(subList).toBeVisible();

  // 8 links: Timeline Overview + 7 events
  const subLinks = page.locator("nav#mobile-nav-menu ul ul a");
  await expect(subLinks).toHaveCount(8);

  // No horizontal overflow
  const overflow = await page.evaluate(
    () => document.body.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
