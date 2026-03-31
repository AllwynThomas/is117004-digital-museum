# Sprint 5 — QA, Accessibility, and Polish

## Header

- **Goal:** perform the formal QA pass against the entire spec. Verify all 25
  testing strategy items. Audit accessibility, responsive behavior, voice
  consistency, performance, content integrity, and security. This sprint
  touches no new content — it verifies and polishes what exists.
- **Spec sections:**
  - All sections of `docs/_specs/digital-museum/spec.md`
  - Testing Strategy (all 25 items)
  - Acceptance Criteria (all 5 items)
  - Design Foundations (Swiss Style audit, Sage voice audit, Cialdini audit)
  - Security Considerations
  - Browser and Environment Support
- **Prerequisite:** Sprint 4 — Timeline and Footer Completion
- **Expected test count:** `0 existing + new tests as needed for automated
  verification`

## Available Assets

| Asset | Verified details | How this sprint uses it |
|-------|-----------------|------------------------|
| `docs/_specs/digital-museum/spec.md` | Complete specification — source of truth for all acceptance criteria | Primary audit source for every check in this sprint |
| `docs/_research/SOURCES.json` | All source entries with IDs, titles, URLs | Verification source for content traceability audit |
| `app/page.tsx` | Complete single-page exhibit with all 7 sections | Primary audit target |
| `app/layout.tsx` | Root layout with metadata, font, skip-to-content link | Audit target for metadata and accessibility |
| `app/globals.css` | All CSS custom properties and design tokens | Audit target for token completeness and consistency |
| `components/` | All exhibit components (SectionHeader, ExhibitImage, StepCard, StatCard, DataComparisonCard, TimelineEntry, SourceBadge, SiteHeader, SiteFooter) | Audit targets for accessibility, responsive behavior, and code quality |
| `lib/exhibit-data.ts` | All exhibit content data | Audit target for source traceability and content completeness |
| `public/assets/images/` | 3 images: uranium diagram, safety chart, reactor GIF | Audit targets for alt text, optimization, and integrity |
| `reference/lighthouserc.json` | Lighthouse CI configuration from reference project | Model for this project's lighthouse config |
| `reference/playwright.config.ts` | Playwright configuration | Already copied in Sprint 0 |

## Tasks

### 1. Build and code quality verification

Run all code quality gates and fix any issues.

**Test items covered:** Testing Strategy #1–4

**Checks:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

- Build produces static output in `out/` with exit code 0.
- Lint reports zero errors.
- TypeScript reports zero type errors.
- Code formatting matches project configuration.

```bash
npx prettier --check .
```

Fix any issues found before proceeding.

### 2. Accessibility audit — automated

Run automated accessibility checks across the full exhibit page.

**Test items covered:** Testing Strategy #5–6, #8

**Checks:**

- Install `@axe-core/playwright` if not already present.
- Write or run a Playwright test that:
  - Loads the full exhibit page.
  - Runs axe-core accessibility scan.
  - Verifies zero critical or serious violations.
- Verify all `<img>` elements have non-empty, descriptive `alt` attributes.
  Decorative images (if any) use `alt=""` with `role="presentation"`.
- Verify HTML landmarks: `<main>`, `<nav>`, `<header>`, `<footer>` present.
  Each `<section>` has `aria-labelledby` pointing to its heading.

```bash
npx playwright test
```

### 3. Accessibility audit — manual keyboard and screen reader

**Test items covered:** Testing Strategy #7, #9

**Keyboard navigation walkthrough:**

- [ ] Tab moves focus through: skip link → nav links → hamburger button
      (mobile) → all interactive elements in section order → footer links
- [ ] Enter activates all focused interactive elements
- [ ] Escape closes the mobile nav overlay
- [ ] Focus order follows visual reading order (top to bottom, left to right)
- [ ] Focus indicators are visible on every interactive element
- [ ] Skip-to-content link works and jumps to `#main-content`

**Reduced motion verification:**

- Enable `prefers-reduced-motion: reduce` in browser developer tools.
- [ ] Reactor GIF is replaced with a static fallback image.
- [ ] No CSS animations or transitions play.

### 4. Color contrast audit

**Test items covered:** Testing Strategy #6

Verify WCAG 2.1 AA contrast ratios for all text-background combinations:

**Light backgrounds (`#ffffff`, `#f6f8fa`, `#eaeef2`):**
- `--color-text-primary` (#1f2328) on white: must be ≥ 4.5:1
- `--color-text-secondary` (#656d76) on white: must be ≥ 4.5:1 for normal
  text, ≥ 3:1 for large text
- `--color-accent-blue` (#0969da) on white: must be ≥ 4.5:1
- `--color-accent-red` (#cf222e) on white: must be ≥ 4.5:1
- `--color-accent-amber` (#bf8700) on white: must be ≥ 3:1 for large text.
  **Must NOT be used for normal-size text on light backgrounds** (fails
  4.5:1). Verify amber is only applied to headings, step numbers, or other
  large text elements in the Fuel Cycle section.
- `--color-accent-green` (#1a7f37) on white: must be ≥ 4.5:1

**Dark backgrounds (`#0d1117`):**
- `--color-text-on-dark` (#f0f3f6) on dark: must be ≥ 4.5:1
- `--color-text-secondary-on-dark` (#9ca3af) on dark: must be ≥ 4.5:1 for
  normal text, ≥ 3:1 for large text
- `--color-accent-cyan` (#00e5ff) on dark: verify ≥ 3:1 for large text

**Forbidden combination:**
- `--color-accent-cyan` (#00e5ff) must NOT appear on light backgrounds.
  Search all component files to verify.

Fix any contrast failures.

### 5. Content integrity audit

**Test items covered:** Testing Strategy #10–14

**Image integrity:**

```bash
# Verify all img src attributes resolve to files in public/assets/images/
npx playwright test
```

- Write or run a Playwright test that queries all `img[src]` elements and
  verifies HTTP 200 responses.
- No broken image icons in the rendered page.

**No external image URLs:**

```bash
# Search for external image sources
grep -rn "src=\"http" app/ components/ --include="*.tsx"
```

- Zero matches expected. All images served from `public/`.

**Source traceability:**

- For every statistic and data claim displayed in the exhibit, verify it
  maps to an entry in SOURCES.json by source ID.
- For every `SourceBadge` rendered, verify the source name matches a valid
  entry in `lib/exhibit-data.ts`.

**External link integrity:**

- All external `<a href>` in the footer and anywhere in the site must
  include `rel="noopener noreferrer"` and `target="_blank"`.

```bash
grep -rn "href=\"http" app/ components/ --include="*.tsx" --include="*.ts"
```

- Verify each external link returns HTTP 200 or 301 redirect.

**HTML validation (Testing Strategy #14):**

- Build the static output and validate the generated `out/index.html`
  against the W3C Nu HTML Checker.
- Zero errors required. Warnings are acceptable.

```bash
npm run build
npx vnu-jar out/index.html
```

- If `vnu-jar` is not available locally, upload `out/index.html` to the
  online W3C Nu HTML Checker (https://validator.w3.org/nu/) and confirm
  zero errors.

### 6. Responsive and visual verification

**Test items covered:** Testing Strategy #15–18

Run Playwright screenshot tests or manual verification at each breakpoint:

- **1440 × 900 (desktop):** All sections render multi-column grid. No
  horizontal overflow.
- **768 × 1024 (tablet):** Layout collapses to tablet grid. Nav usable.
  No horizontal overflow.
- **390 × 844 (mobile):** Single-column layout. Hamburger menu opens and
  closes. All content reachable.
- **320 × 568 (minimum):** No content clipped or horizontally scrollable.

Write Playwright tests if possible:

```bash
npx playwright test
```

### 7. Performance audit

**Test items covered:** Testing Strategy #19–23

Create `lighthouserc.json` in the project root (model from reference) and
run Lighthouse CI:

**Required scores:**
- Performance score ≥ 90 on mobile emulation
- LCP ≤ 2.5 s
- CLS ≤ 0.1
- FCP ≤ 1.8 s

**Image optimization:**
- All PNG images are optimized (lossless compression applied).
- The GIF is ≤ 2 MB.
- Total image payload ≤ 5 MB.

```bash
# Check image sizes
ls -la public/assets/images/
```

```bash
# Build and run lighthouse
npm run build
npx @lhci/cli autorun
```

If performance scores are below threshold, investigate and fix:
- Verify hero image has `priority={true}` for LCP.
- Verify `next/font/google` eliminates FOUT.
- Check for unnecessary JavaScript bundles.
- Verify static export produces minimal client-side JS.

### 8. Voice and copy review

**Test items covered:** Testing Strategy #24–25

Read through every piece of visible exhibit text and verify against the
Sage voice checklist:

**Sage voice checks:**
- [ ] No unsourced superlatives ("best," "amazing," "incredible")
- [ ] No promotional language ("Nuclear is the answer!")
- [ ] No fear language ("disaster," "doomed," "catastrophe" without data)
- [ ] No dismissive phrasing ("People who think X are wrong")
- [ ] Every factual claim has a visible source attribution
- [ ] Tone is calm, confident, measured throughout
- [ ] Technical terms defined on first use

**Spelling and grammar:**
- [ ] Zero spelling errors in exhibit copy
- [ ] Zero grammar errors in exhibit copy

### 9. Swiss Style visual audit

Verify the complete exhibit adheres to the Swiss International Style
specifications:

- [ ] Every color value traces to a declared CSS custom property token
- [ ] Every spacing value traces to the 4 px scale
- [ ] Every font traces to the Inter family
- [ ] No border-radius on cards or containers (0 on all)
- [ ] No drop shadows or gradients on surfaces
- [ ] Thin, precise rule borders using `--color-surface-rule`
- [ ] Generous whitespace and consistent vertical rhythm
- [ ] Motion is minimal — clean fades or slides only; no bouncing,
      wobbling, or particle effects

### 10. Acceptance criteria validation

Verify each acceptance criterion from the spec is met:

| # | Criterion | Check |
|---|-----------|-------|
| 1 | How It Works contains labeled 4-step process with animation and step cards | Visual inspection |
| 2 | Every quantitative claim links to a SOURCES.json entry; no statistic appears without a source badge | Content traceability audit |
| 3 | Hero displays uranium pellet comparison at ≥ 600 px width on desktop with caption and source badge | Measure rendered width at 1440 px |
| 4 | Future Demand cites ≥ 2 dated projections from Deloitte or DOE | Content review |
| 5 | Safety names Chernobyl and Fukushima, states death toll figures, provides ≥ 1 fossil-fuel mortality comparison | Content review |

### 11. Produce the QA report

Document the outcome of the full QA pass.

Required format — append to this sprint doc under a `QA Report` section:

- **Verdict:** `PASS (0 issues)` or `PASS (N issues resolved)` with a
  concise list of what was fixed.
- **Spec coverage:** Confirm all 25 testing strategy items were checked.
- **Acceptance criteria:** Confirm all 5 acceptance criteria are met.
- **Deviations:** Any intentional departures from the spec, with rationale.

**Verify:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Completion Checklist

- [ ] `npm run build` produces static output in `out/` with exit code 0
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors
- [ ] Code formatting passes (`npx prettier --check .`)
- [ ] Axe-core accessibility scan: zero critical or serious violations
- [ ] All images have descriptive `alt` attributes
- [ ] HTML landmarks present: `<main>`, `<nav>`, `<header>`, `<footer>`
- [ ] All `<section>` elements have `aria-labelledby` pointing to their heading
- [ ] Keyboard navigation works: Tab, Enter, Escape on all interactive elements
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip-to-content link functional
- [ ] `prefers-reduced-motion: reduce` swaps GIF for static image and disables animations
- [ ] Color contrast meets WCAG AA: ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] `--color-accent-cyan` not used on light backgrounds
- [ ] All `img[src]` resolve to local files in `public/` — no external image URLs
- [ ] Source traceability: every statistic maps to a SOURCES.json entry
- [ ] All external links have `rel="noopener noreferrer"` and `target="_blank"`
- [ ] External links return HTTP 200 or valid redirects
- [ ] HTML validation: `out/index.html` passes W3C Nu HTML Checker with zero errors
- [ ] Desktop layout (1440 px) — no horizontal overflow, multi-column grid
- [ ] Tablet layout (768 px) — correct collapse, nav usable
- [ ] Mobile layout (390 px) — single column, hamburger functional
- [ ] Minimum viewport (320 px) — no content clipped
- [ ] Lighthouse Performance ≥ 90 on mobile
- [ ] LCP ≤ 2.5 s, CLS ≤ 0.1, FCP ≤ 1.8 s
- [ ] Images optimized, GIF ≤ 2 MB, total payload ≤ 5 MB
- [ ] Sage voice: zero violations (no superlatives, fear language, or dismissive phrasing)
- [ ] Zero spelling or grammar errors
- [ ] Swiss Style: all tokens, spacing, fonts traced to design system
- [ ] All 5 acceptance criteria from the spec are met
- [ ] QA report appended to this sprint doc

## QA Deviations

None.
