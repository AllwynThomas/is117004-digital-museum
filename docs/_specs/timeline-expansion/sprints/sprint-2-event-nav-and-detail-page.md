# Sprint 2 — EventNav Component and Event Detail Page

## Header

- **Goal:** create the `EventNav` reusable component and the
  `app/timeline/[slug]/page.tsx` dynamic route. After this sprint, all 7
  event detail pages are accessible at `/timeline/[slug]`, statically
  pre-rendered at build time, and fully laid out with breadcrumb, hero,
  image placeholder, inline stat cards with `SourceBadge`, source badges
  row, and event navigation.
- **Spec sections:**
  - Event Detail Page Layout (all sub-sections)
  - Component Specifications (`app/timeline/[slug]/page.tsx`, `event-nav.tsx`)
  - Static Generation
  - Security Considerations (external links, no inline event handlers,
    image placeholder text, base path handling)
  - Page Metadata
- **Prerequisite:** Sprint 1 — Data Model Extension
- **Expected test count:** `25 existing + 0 new = 25 total` (build, lint, and
  typecheck are the verification gates for this sprint)

## Available Assets

| Asset                                    | Verified details                                                                                                             | How this sprint uses it                                                                                       |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `lib/exhibit-data.ts`                    | `TimelineEntry` now includes `slug`, `imageAlt`, `stats: TimelineStat[]`; `Source[]` includes all required source entries  | All content on event pages is sourced exclusively from this file — no hardcoded data                          |
| `components/ui/source-badge.tsx`         | Renders `sourceName` + optional `sourceUrl`; external links include `rel="noopener noreferrer"` and `target="_blank"`       | Reused inside inline stat card blocks and in the source badges row on event pages                             |
| `lib/asset-path.ts`                      | Exports `prefixAssetPath()` for GitHub Pages base path handling                                                              | Must be used for any future `next/image` `src` on event pages; import it and leave a comment in the placeholder |
| `app/layout.tsx`                         | Root layout; provides skip-link targeting `#main-content`; wraps all pages in `SiteHeader` + `SiteFooter`                   | Event pages must render `<main id="main-content">` so the skip link resolves correctly                        |
| `app/globals.css`                        | All CSS custom properties: `--font-size-display`, `--font-size-section`, `--font-size-caption`, spacing tokens, color tokens | All styling on event pages uses CSS custom properties — no hardcoded values                                   |
| `docs/_specs/timeline-expansion/spec.md` | Event Detail Page Layout, Component Specifications, Page Metadata table, per-event meta descriptions                        | Source of truth for layout structure, spacing, typography, and metadata values                                |

## Tasks

### 1. Verify `SourceBadge` external link security

Before building any new components, open `components/ui/source-badge.tsx` and
confirm that every `<a>` element rendering an external link includes both
`rel="noopener noreferrer"` and `target="_blank"`.

If either attribute is missing, add it now. This is a security requirement
per the spec's Security Considerations section and must be satisfied before
event pages that render `SourceBadge` are built.

**Verify:**

```bash
npx tsc --noEmit
```

---

### 2. Create the `EventNav` component

Create `components/ui/event-nav.tsx`.

**Props:**

```ts
import { TimelineEntry } from "@/lib/exhibit-data";

interface EventNavProps {
  prevEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null;
  nextEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null;
}
```

**Required behavior:**

- No `"use client"` directive — this is a purely presentational server
  component.
- Renders a three-column flex row with `justify-content: space-between`.
- Top border: `1px solid var(--color-surface-rule)`.
- Padding: `var(--space-6)` top and bottom.
- Margin above the strip: `var(--space-12)`.
- **Left column:** when `prevEntry` is not `null`, render a Next.js `<Link>`
  with text `← {prevEntry.year} — {prevEntry.title}` pointing to
  `/timeline/{prevEntry.slug}`. When `prevEntry` is `null`, render an empty
  `<span>` (preserves the three-column layout).
- **Center column:** always render a Next.js `<Link href="/#timeline">` with
  text `Back to Timeline`. Centered with `text-align: center`.
- **Right column:** when `nextEntry` is not `null`, render a Next.js `<Link>`
  with text `{nextEntry.year} — {nextEntry.title} →` pointing to
  `/timeline/{nextEntry.slug}`. When `nextEntry` is `null`, render an empty
  `<span>`.
- Font size for all links: `var(--font-size-caption)`.
- Link color: `var(--color-text-secondary)` default; `var(--color-accent-blue)`
  on hover and focus.
- No underline by default; underline on hover.
- All navigation uses Next.js `<Link>` — no `<a>` elements with hardcoded
  hrefs.

**Verify:**

```bash
npx tsc --noEmit
```

---

### 3. Create the event detail page

Create `app/timeline/[slug]/page.tsx`.

This is an async server component. Do not add `"use client"`.

#### 3a. `generateStaticParams`

Export `generateStaticParams()` so Next.js pre-renders all 7 event pages at
build time:

```ts
import { exhibitData } from "@/lib/exhibit-data";

export async function generateStaticParams() {
  return exhibitData.timelineEntries.map((entry) => ({
    slug: entry.slug,
  }));
}
```

#### 3b. `generateMetadata`

Export `generateMetadata` using the async params signature required by
Next.js 16. Call `notFound()` (imported from `next/navigation`) if the slug
does not match any entry. Use the exact metadata values from the Page Metadata
table in the spec:

```ts
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = exhibitData.timelineEntries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const descriptions: Record<string, string> = {
    "chicago-pile-1":
      "On December 2, 1942, Enrico Fermi's team achieved the first controlled nuclear chain reaction under Stagg Field, opening the nuclear age.",
    "obninsk-ussr":
      "In 1954 the Soviet Union connected the world's first nuclear power plant to an electrical grid, proving fission could generate usable electricity.",
    shippingport:
      "Shippingport became the first full-scale U.S. commercial nuclear plant in 1958, operating for 25 years and validating civilian nuclear power.",
    "three-mile-island":
      "The 1979 Three Mile Island partial meltdown caused zero radiation deaths and triggered sweeping safety reforms that strengthened U.S. nuclear oversight.",
    chernobyl:
      "The 1986 Chernobyl accident caused 31 acute deaths and prompted a global safety overhaul. WHO projects up to 4,000 long-term cancer fatalities.",
    "fukushima-daiichi":
      "A 2011 tsunami triggered meltdowns at three Fukushima reactors. Confirmed radiation deaths: zero. 154,000 people were evacuated as a precaution.",
    "nuclear-renaissance":
      "SMRs entering the NRC licensing pipeline and rising AI data-center demand are driving a 21st-century nuclear renaissance targeting 3× global capacity by 2050.",
  };

  return {
    title: `${entry.year} — ${entry.title} | Nuclear Energy Museum`,
    description: descriptions[slug],
  };
}
```

#### 3c. Page component

Export the page as the default async function using the same async params
pattern:

```ts
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = exhibitData.timelineEntries;
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) notFound();

  const entry = entries[index];
  const prevEntry = index > 0 ? entries[index - 1] : null;
  const nextEntry = index < entries.length - 1 ? entries[index + 1] : null;

  // ... render layout
}
```

#### 3d. Page layout

Render the full page layout inside `<main id="main-content">`. Follow this
exact structure:

**Breadcrumb:**

```tsx
<Link href="/#timeline">← Back to Timeline</Link>
```

- Font size: `var(--font-size-caption)`
- Color: `var(--color-text-secondary)`
- Padding above: `var(--space-8)`; padding below: `var(--space-6)`
- No underline by default; underline on hover

**Event Hero:**

```tsx
<p style={{ fontSize: "var(--font-size-display)", fontWeight: 800, color: "var(--color-accent-blue)", letterSpacing: "-0.02em" }}>
  {entry.year}
</p>
<h1 style={{ fontSize: "var(--font-size-section)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
  {entry.title}
</h1>
```

- The year is a `<p>` (not an `<h1>`) — `<h1>` is the title
- Vertical gap between year and title: `var(--space-2)`
- Padding below the hero block before the content grid: `var(--space-12)`
- No background panel — both sit on `var(--color-bg-primary)`

**Content Grid:**

Two-column grid on desktop/tablet, single column on mobile:

```tsx
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
  {/* Left column: image placeholder */}
  {/* Right column: stat cards */}
</div>
```

Use a responsive CSS approach (media query or Tailwind responsive utility) to
collapse to a single column below the tablet breakpoint (768 px).

**Image Placeholder (left column):**

```tsx
<div>
  <div
    style={{
      aspectRatio: "16 / 9",
      border: "1px solid var(--color-surface-rule)",
      borderRadius: 0,
      background: "var(--color-bg-tertiary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-caption)" }}>
      {/* prefixAssetPath() from lib/asset-path.ts must be used when a real
          next/image src is added here in a future pass */}
      [Image: {entry.imageAlt}]
    </span>
  </div>
  <p style={{ fontSize: "var(--font-size-caption)", color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>
    {entry.imageAlt}
  </p>
</div>
```

The caption line directly below the container renders the `imageAlt` value as
visible DOM text. Both the interior text and this caption must be present
so the spec requirement (visible text, not `aria-label` alone) is satisfied.

**Stat Cards (right column):**

Render stat cards as inline JSX — do **not** use the `<StatCard>` component
(it does not render a `SourceBadge`).

For each stat in `entry.stats`, look up the matching source:

```ts
const source = exhibitData.sources.find((s) => s.id === stat.sourceId);
```

Then render:

```tsx
<div
  key={stat.label}
  style={{
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--color-surface-rule)",
    borderRadius: 0,
    padding: "var(--space-4)",
  }}
>
  <p style={{ fontSize: "var(--font-size-section)", fontWeight: 700, color: "var(--color-text-primary)" }}>
    {stat.value}
  </p>
  <p style={{ fontSize: "var(--font-size-caption)", color: "var(--color-text-secondary)" }}>
    {stat.label}
  </p>
  {source && (
    <SourceBadge sourceName={source.title} sourceUrl={source.sourceUrl} />
  )}
</div>
```

Stack the cards vertically with `gap: var(--space-4)`.

**Source Badges Row:**

Below the content grid, render one `SourceBadge` per entry in
`entry.sourceIds`:

```tsx
<div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", paddingTop: "var(--space-8)" }}>
  {entry.sourceIds.map((id) => {
    const source = exhibitData.sources.find((s) => s.id === id);
    return source ? (
      <SourceBadge key={id} sourceName={source.title} sourceUrl={source.sourceUrl} />
    ) : null;
  })}
</div>
```

**EventNav:**

```tsx
<EventNav prevEntry={prevEntry} nextEntry={nextEntry} />
```

Pass the full `prevEntry` and `nextEntry` objects (or `null`). The component
renders the navigation strip with the top border, prev/next links, and the
back link.

#### 3e. Grid layout constraint

The content section must use the same `1200 px` max-width, centered, with the
same outer margins as the main exhibit page. Wrap the entire page content
(breadcrumb through EventNav) in a container that matches the existing grid:

```tsx
<div
  style={{
    maxWidth: "var(--grid-max-width)",
    margin: "0 auto",
    padding: "0 var(--space-6)",
  }}
>
  {/* page content */}
</div>
```

**Verify:**

```bash
npm run build
# Expected: exits with code 0; out/timeline/[slug]/index.html produced for all 7 slugs
```

---

### 4. Final verification

Run all code quality gates:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected outcomes:
- TypeScript: zero errors
- Lint: zero errors
- Build: exits with code 0 and produces 7 files under `out/timeline/`

Verify the 7 output files exist:

```
out/timeline/chicago-pile-1/index.html
out/timeline/obninsk-ussr/index.html
out/timeline/shippingport/index.html
out/timeline/three-mile-island/index.html
out/timeline/chernobyl/index.html
out/timeline/fukushima-daiichi/index.html
out/timeline/nuclear-renaissance/index.html
```

## Completion Checklist

- [ ] `components/ui/source-badge.tsx` confirmed to include `rel="noopener noreferrer"` and `target="_blank"` on all external `<a>` elements
- [ ] `components/ui/event-nav.tsx` created
- [ ] `EventNav` accepts `prevEntry` and `nextEntry` (both nullable)
- [ ] `EventNav` renders empty `<span>` (not placeholder text) for null entries
- [ ] `EventNav` uses Next.js `<Link>` for all navigation; no raw `<a>` hrefs
- [ ] `EventNav` has no `"use client"` directive
- [ ] `app/timeline/[slug]/page.tsx` created
- [ ] `generateStaticParams()` exported and returns all 7 slugs
- [ ] `generateMetadata()` uses async params signature and returns correct title and description per spec
- [ ] Page component uses async params signature and awaits before accessing `slug`
- [ ] `notFound()` called when slug matches no entry
- [ ] `<main id="main-content">` is the outermost content wrapper
- [ ] Breadcrumb renders `← Back to Timeline` as `<Link href="/#timeline">`
- [ ] Year rendered as `<p>` at `--font-size-display`, weight 800, `--color-accent-blue`
- [ ] Title rendered as `<h1>` at `--font-size-section`, weight 700, `--color-text-primary`
- [ ] `entry.description` is **not** rendered anywhere on the page
- [ ] Image placeholder renders `[Image: {entry.imageAlt}]` as visible text inside the container
- [ ] Caption line below placeholder renders `entry.imageAlt` as visible DOM text
- [ ] Comment on placeholder documents future `prefixAssetPath()` usage
- [ ] Stat cards rendered as inline JSX (not via `<StatCard>` component)
- [ ] Each stat card includes a `<SourceBadge>` resolved from `exhibitData.sources`
- [ ] Source badges row renders one `<SourceBadge>` per `entry.sourceIds` entry
- [ ] `<EventNav>` rendered at the bottom with correct `prevEntry` and `nextEntry`
- [ ] Content max-width is `var(--grid-max-width)` centered with `var(--space-6)` outer padding
- [ ] No hardcoded color values — all values use CSS custom properties
- [ ] All 7 `out/timeline/[slug]/index.html` files produced by build
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run lint` reports zero errors
- [ ] `npm run build` exits with code 0
