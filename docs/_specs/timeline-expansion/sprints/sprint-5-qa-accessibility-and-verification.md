# Sprint 5 — QA, Accessibility, and Verification

## Header

- **Goal:** perform the formal QA pass for the full timeline expansion. Verify
  all 21 new testing strategy items (tests 26–46) as well as the 25 existing
  tests from the parent spec that are affected by the changes in this
  expansion. Write any missing Playwright tests. Resolve any issues found
  before marking the expansion complete.
- **Spec sections:**
  - Testing Strategy (tests 26–46)
  - Acceptance Criteria (#4 — keyboard accessibility; #1 — all 7 event pages
    reachable; #2 — stat cards sourced; #3 — no prose; #5 — prev/next nav)
  - Design Foundations (Swiss Style audit on new surfaces, Sage voice on
    event pages, Cialdini on event pages)
  - Security Considerations (all items for new surfaces)
- **Prerequisite:** Sprint 4 — SiteHeader Timeline Dropdown and Mobile Sub-list
- **Expected test count:** `25 existing + 21 new = 46 total`

## Available Assets

| Asset                                      | Verified details                                                                                                       | How this sprint uses it                                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `app/timeline/[slug]/page.tsx`             | Complete event detail page for all 7 slugs                                                                             | Primary audit target for layout, accessibility, content integrity, and responsive behavior            |
| `components/ui/event-nav.tsx`              | Prev/next navigation component                                                                                         | Audit target for prev/next link correctness and boundary conditions                                   |
| `components/site/site-header.tsx`          | Updated with Timeline dropdown and mobile sub-list                                                                     | Audit target for keyboard navigation, ARIA attributes, mobile behavior                                |
| `components/ui/timeline-entry.tsx`         | Updated with `slug` prop and `<Link>` wrapper                                                                          | Audit target for link behavior on main page timeline                                                  |
| `lib/exhibit-data.ts`                      | Extended `TimelineEntry` with `slug`, `imageAlt`, `stats`                                                              | Audit source for `// verify` stat comments; source traceability check                                 |
| `tests/browser/`                           | Existing Playwright test files                                                                                         | Extended with new tests covering event pages, dropdown, and mobile sub-list                           |
| `docs/_specs/timeline-expansion/spec.md`   | Testing Strategy section (tests 26–46), Acceptance Criteria, Completion Checklist                                      | Source of truth for every pass criterion in this sprint                                               |

## Tasks

### 1. Build and code quality verification (Tests 26–28)

Run all code quality gates and fix any issues before proceeding to functional
tests.

**Test 26 — Build with new routes:**

```bash
npm run build
```

- Exit code must be 0.
- All 7 HTML files must exist under `out/timeline/`:

```
out/timeline/chicago-pile-1/index.html
out/timeline/obninsk-ussr/index.html
out/timeline/shippingport/index.html
out/timeline/three-mile-island/index.html
out/timeline/chernobyl/index.html
out/timeline/fukushima-daiichi/index.html
out/timeline/nuclear-renaissance/index.html
```

**Test 27 — TypeScript after interface extension:**

```bash
npx tsc --noEmit
```

- Zero errors after `TimelineEntry`, `TimelineStat`, `EventNavProps`, and
  all new component changes.

**Test 28 — Lint on new and modified files:**

```bash
npm run lint
```

- Zero errors in:
  - `lib/exhibit-data.ts`
  - `components/ui/event-nav.tsx`
  - `app/timeline/[slug]/page.tsx`
  - `components/ui/timeline-entry.tsx`
  - `components/site/site-header.tsx`
  - `app/page.tsx`

Fix any build, type, or lint errors before proceeding.

---

### 2. Source traceability audit (Test 38)

**Test 38 — Stat card source traceability (manual):**

Open `lib/exhibit-data.ts` and audit every `stats[].sourceId` value across
all 7 timeline entries. Verify each matches an existing `id` in
`exhibitData.sources`.

Required source IDs:
- `iaea_nuclear_power_topic` — must exist in `exhibitData.sources`
- `ourworldindata_chernobyl_fukushima` — must exist in `exhibitData.sources`
- `doe_smr_overview` — must exist in `exhibitData.sources`
- `deloitte_data_center_nuclear` — must exist in `exhibitData.sources`

**Resolve all `// verify` comments:**

Every stat marked `// verify` in Sprint 1 requires confirmation against the
cited source URL before this sprint is complete. For each marked stat:

1. Visit the `sourceUrl` for the cited `sourceId`.
2. Confirm the figure is accurate as written.
3. If confirmed: remove the `// verify` comment.
4. If the figure cannot be confirmed: replace it with a verifiable figure
   from the same source, or remove the stat card entirely.

The `// verify` comments must not be present in the production codebase at
sprint completion.

---

### 3. Routing and navigation tests (Tests 29–33)

Write or update Playwright tests in `tests/browser/` to cover the following.

**Test 29 — All 7 event pages render:**

For each slug, navigate to `/timeline/[slug]` and assert:
- The page title `<title>` matches the format `"{year} — {title} | Nuclear Energy Museum"`.
- An `<h1>` containing the event title is present in the DOM.

```ts
const slugs = [
  { slug: "chicago-pile-1", year: "1942", title: "Chicago Pile-1" },
  { slug: "obninsk-ussr", year: "1954", title: "Obninsk, USSR" },
  { slug: "shippingport", year: "1957", title: "Shippingport, Pennsylvania" },
  { slug: "three-mile-island", year: "1979", title: "Three Mile Island" },
  { slug: "chernobyl", year: "1986", title: "Chernobyl" },
  { slug: "fukushima-daiichi", year: "2011", title: "Fukushima Daiichi" },
  { slug: "nuclear-renaissance", year: "2020s", title: "Nuclear Renaissance" },
];

for (const { slug, title } of slugs) {
  await page.goto(`/timeline/${slug}`);
  await expect(page.locator("h1")).toContainText(title);
}
```

**Test 30 — 404 for unknown slugs:**

```ts
await page.goto("/timeline/unknown-slug");
// Assert the page title contains "404" OR the not-found <h1> text is present
```

**Test 31 — Dropdown event links navigate correctly:**

At 1440 × 900 viewport, hover the "Timeline" trigger button, then click
each of the 7 event links in the dropdown. Assert the resulting URL matches
`/timeline/[slug]`.

**Test 32 — "Timeline Overview" link in dropdown:**

Hover the "Timeline" trigger, click "Timeline Overview". Assert the URL
contains `/#timeline` or verify the timeline section is in the viewport.

**Test 33 — Mobile sub-list links navigate:**

At 390 × 844 viewport:
1. Open the hamburger menu.
2. Tap the "Timeline" accordion row.
3. Assert the sub-list is visible.
4. Tap one event link.
5. Assert navigation to the correct `/timeline/[slug]` URL.
6. Assert the hamburger menu is closed after navigation.

---

### 4. Accessibility tests (Tests 34–37)

**Test 34 — Dropdown keyboard navigation:**

Write a Playwright test that:
1. Focuses the "Timeline" trigger button via keyboard (`page.keyboard.press("Tab")` until the trigger is focused, or use `page.focus()`).
2. Asserts `aria-expanded` is initially `"false"`.
3. Presses `Enter` — asserts `aria-expanded` becomes `"true"`.
4. Presses `ArrowDown` — asserts the first menu item is focused.
5. Presses `ArrowDown` again — asserts the second menu item is focused.
6. Presses `ArrowUp` — asserts focus returns to the first menu item.
7. Presses `End` — asserts the last menu item is focused.
8. Presses `Home` — asserts the first menu item is focused.
9. Presses `Escape` — asserts `aria-expanded` is `"false"` and focus returns to the trigger.
10. Presses `Enter` again to open, then `Tab` — asserts the dropdown closes.

```ts
// Focus the Timeline trigger
await page.focus('[aria-haspopup="menu"]');
await expect(page.locator('[aria-haspopup="menu"]')).toHaveAttribute("aria-expanded", "false");

await page.keyboard.press("Enter");
await expect(page.locator('[aria-haspopup="menu"]')).toHaveAttribute("aria-expanded", "true");

await page.keyboard.press("ArrowDown");
// Assert first menuitem is focused
const items = page.locator('[role="menuitem"]');
await expect(items.first()).toBeFocused();

await page.keyboard.press("Escape");
await expect(page.locator('[aria-haspopup="menu"]')).toHaveAttribute("aria-expanded", "false");
await expect(page.locator('[aria-haspopup="menu"]')).toBeFocused();
```

**Test 35 — `aria-expanded` state:**

Assert the "Timeline" nav trigger has:
- `aria-expanded="false"` when the dropdown is closed.
- `aria-expanded="true"` when the dropdown is open (after hover or Enter).

**Test 36 — Image placeholder descriptive text:**

For each of the 7 event pages, assert that the `imageAlt` text is present as
visible DOM content — not just as an `aria-label`:

```ts
for (const { slug, imageAlt } of slugData) {
  await page.goto(`/timeline/${slug}`);
  // Assert visible text in the placeholder region
  const placeholderText = page.locator("text=" + imageAlt).first();
  await expect(placeholderText).toBeVisible();
}
```

The spec explicitly requires: "the text must be in the DOM as visible content."
An `aria-label` alone does not satisfy this criterion.

**Test 37 — Event detail page color contrast:**

Run a Lighthouse accessibility audit on at least one event detail page
(e.g., `/timeline/chernobyl`). Assert the accessibility score is ≥ 95.

If Lighthouse CI is configured, include the event detail page URL in
`lighthouserc.json`. Otherwise run manually:

```bash
npm run build
npx @lhci/cli autorun
```

Specific color combinations to verify on event detail pages (light
background `--color-bg-primary`):
- Year numeral: `--color-accent-blue` (#0969da) on white — must be ≥ 4.5:1 ✓
- Title: `--color-text-primary` (#1f2328) on white — must be ≥ 4.5:1 ✓
- Stat value: `--color-text-primary` on `--color-bg-secondary` — verify passes
- Stat label: `--color-text-secondary` (#656d76) on `--color-bg-secondary` — verify ≥ 4.5:1
- `--color-accent-cyan` must NOT appear on any light background — search and confirm

---

### 5. Prev/next navigation tests (Tests 39–41)

**Test 39 — Prev/next navigation correctness:**

Navigate through all 7 events in sequence using only the next link:
1. Go to `/timeline/chicago-pile-1`.
2. Click the next link — verify navigation to `/timeline/obninsk-ussr`.
3. Continue through all 7 events in chronological order.
4. Also verify the prev link navigates backwards correctly.

**Test 40 — First event has no prev link:**

On `/timeline/chicago-pile-1`, assert that no element matching the prev link
pattern (`← `) is present in the `EventNav` strip:

```ts
await page.goto("/timeline/chicago-pile-1");
const prevLink = page.locator("text=←").first();
await expect(prevLink).not.toBeVisible();
```

**Test 41 — Last event has no next link:**

On `/timeline/nuclear-renaissance`, assert that no element matching the next
link pattern (` →`) is present in the `EventNav` strip:

```ts
await page.goto("/timeline/nuclear-renaissance");
const nextLink = page.locator("text=→").first();
await expect(nextLink).not.toBeVisible();
```

---

### 6. Security verification (Test 42)

**Test 42 — `SourceBadge` external link security:**

On at least two event detail pages (e.g., `/timeline/chernobyl` and
`/timeline/chicago-pile-1`), query all `<a>` elements that link to external
domains and assert they carry both `rel="noopener noreferrer"` and
`target="_blank"`:

```ts
await page.goto("/timeline/chernobyl");
const externalLinks = page.locator('a[href^="http"]');
const count = await externalLinks.count();

for (let i = 0; i < count; i++) {
  const link = externalLinks.nth(i);
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(link).toHaveAttribute("rel", /noreferrer/);
  await expect(link).toHaveAttribute("target", "_blank");
}
```

Also verify the main `SourceBadge` component directly — open
`components/ui/source-badge.tsx` and confirm the attributes are present in
the source.

---

### 7. Responsive and visual verification (Tests 43–46)

**Test 43 — Desktop event page layout (1440 × 900):**

At 1440 px viewport width, for at least one event page:
- Assert the content grid renders two columns (image left, stat cards right).
- Assert no horizontal overflow (check `document.body.scrollWidth` ≤
  `window.innerWidth`).

```ts
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("/timeline/chernobyl");
const overflow = await page.evaluate(() =>
  document.body.scrollWidth > window.innerWidth
);
expect(overflow).toBe(false);
```

**Test 44 — Mobile event page layout (390 × 844):**

At 390 px viewport width, for at least one event page:
- Assert the content grid is single-column (image above stats).
- Assert no horizontal overflow.
- Assert all stat cards are visible without horizontal scroll.

**Test 45 — Desktop dropdown visible (1440 × 900):**

At 1440 × 900:
1. Hover the "Timeline" trigger.
2. Assert the dropdown panel is visible (`toBeVisible()`).
3. Assert the panel's bounding rect has a non-zero width and height.
4. Assert all 8 links (Timeline Overview + 7 events) are visible within
   the viewport with no horizontal clipping.

```ts
await page.setViewportSize({ width: 1440, height: 900 });
const trigger = page.locator('[aria-haspopup="menu"]');
await trigger.hover();
const panel = page.locator('[role="menu"]');
await expect(panel).toBeVisible();
const links = panel.locator('[role="menuitem"]');
await expect(links).toHaveCount(8);
```

**Test 46 — Mobile sub-list visible (390 × 844):**

At 390 × 844:
1. Open the hamburger menu.
2. Tap the "Timeline" accordion row.
3. Assert the sub-list is visible and contains 8 links.
4. Assert no horizontal overflow from the sub-list.

---

### 8. Swiss Style and Sage voice audit on new surfaces

Verify new surfaces adhere to all design constraints.

**Swiss Style checks for event detail pages:**

- [ ] No `border-radius` on image placeholder container or stat cards
- [ ] No drop shadows or gradients on any surface
- [ ] All colors use CSS custom properties (no hardcoded hex values in `page.tsx` or `event-nav.tsx`)
- [ ] Spacing uses `var(--space-*)` tokens — no arbitrary pixel values
- [ ] Max-width 1200 px (`var(--grid-max-width)`) consistently applied

**Sage voice checks for event detail pages:**

- [ ] No prose paragraphs — `entry.description` is not rendered on any event page
- [ ] Accident events (Three Mile Island, Chernobyl, Fukushima) lead with correct data — not sensationalism
- [ ] Every stat card has a visible `SourceBadge`
- [ ] Breadcrumb and EventNav text is neutral and functional

**Swiss Style checks for SiteHeader changes:**

- [ ] Dropdown panel: `border-radius: 0`, `box-shadow: none`
- [ ] Dropdown panel background: `--color-bg-primary`
- [ ] Dropdown panel border: `1px solid var(--color-surface-rule)`
- [ ] Dropdown `z-index: 50` (above sticky header at `z-index: 40`)
- [ ] Dropdown `min-width: 240px`

---

### 9. Acceptance criteria validation

Verify each acceptance criterion from the spec:

| #   | Criterion                                                                                                         | Verification method                                                                               | Pass |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---- |
| 1   | Each of the 7 events has a dedicated page at `/timeline/[slug]`, pre-rendered by `generateStaticParams()`        | Check `out/timeline/` for 7 HTML files; test 29                                                   | [ ]  |
| 2   | Every event page renders 2–3 stat cards, each with value, label, and visible SourceBadge                         | Visual inspection + test 42                                                                       | [ ]  |
| 3   | No event page renders any paragraph of prose; `entry.description` not rendered                                    | Playwright: search for description text on each event page; assert not present                    | [ ]  |
| 4   | Dropdown opens on hover and Enter/Space; Arrow keys navigate; Escape closes and returns focus; Tab closes menu    | Test 34                                                                                           | [ ]  |
| 5   | Every event page renders EventNav with prev link (or absent if first), Back to Timeline, next link (or absent if last) | Tests 39–41                                                                                   | [ ]  |

---

### 10. Final build and commit check

Run all gates one final time:

```bash
npx tsc --noEmit
npm run lint
npm run build
npx playwright test
```

All four commands must exit with code 0.

Confirm the final `out/` directory contains:

```
out/index.html
out/timeline/chicago-pile-1/index.html
out/timeline/obninsk-ussr/index.html
out/timeline/shippingport/index.html
out/timeline/three-mile-island/index.html
out/timeline/chernobyl/index.html
out/timeline/fukushima-daiichi/index.html
out/timeline/nuclear-renaissance/index.html
```

## Completion Checklist

- [ ] All `// verify` comments removed from `lib/exhibit-data.ts`; every stat confirmed against its source URL
- [ ] All 46 tests pass (25 existing + 21 new)
- [ ] Test 26: `npm run build` exits 0; 7 HTML files under `out/timeline/`
- [ ] Test 27: `npx tsc --noEmit` reports zero errors
- [ ] Test 28: `npm run lint` reports zero errors
- [ ] Test 29: All 7 `/timeline/[slug]` URLs render correct year and title
- [ ] Test 30: `/timeline/unknown-slug` returns the static 404 page
- [ ] Test 31: Each of the 7 dropdown event links navigates to the correct `/timeline/[slug]`
- [ ] Test 32: "Timeline Overview" link navigates to `/#timeline`
- [ ] Test 33: Mobile sub-list expands, event link navigates correctly, hamburger closes
- [ ] Test 34: Full WAI-ARIA Menu Button keyboard pattern verified (↑↓, Home, End, Escape, Tab, focus return)
- [ ] Test 35: `aria-expanded` toggles correctly on the Timeline trigger
- [ ] Test 36: `imageAlt` text is visible DOM content on all 7 event pages
- [ ] Test 37: Lighthouse accessibility score ≥ 95 on event detail pages
- [ ] Test 38: All `stats[].sourceId` values match existing entries in `exhibitData.sources`
- [ ] Test 39: Prev/next navigation correct through all 7 events in sequence
- [ ] Test 40: Chicago Pile-1 page has no prev link
- [ ] Test 41: Nuclear Renaissance page has no next link
- [ ] Test 42: All external `<a>` on event pages have `rel="noopener noreferrer"` and `target="_blank"`
- [ ] Test 43: Desktop (1440 px) two-column layout; no horizontal overflow
- [ ] Test 44: Mobile (390 px) single-column layout; no horizontal overflow
- [ ] Test 45: Desktop dropdown panel visible with 8 links; no clipping
- [ ] Test 46: Mobile sub-list visible with 8 links; no horizontal overflow
- [ ] Acceptance criterion 1: 7 pre-rendered pages reachable by URL
- [ ] Acceptance criterion 2: 2–3 sourced stat cards on every event page
- [ ] Acceptance criterion 3: No prose paragraphs on any event page
- [ ] Acceptance criterion 4: Dropdown keyboard navigation fully functional
- [ ] Acceptance criterion 5: Prev/next/back navigation present and correct on all event pages
- [ ] No `--color-accent-cyan` on any light background
- [ ] No hardcoded hex or color values in new/modified files
- [ ] No `border-radius` on event page containers or dropdown panel
- [ ] Swiss Style and Sage voice audit passed on all new surfaces
