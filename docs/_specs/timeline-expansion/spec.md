# Timeline Expansion — Spec

> **Status:** Planned

## Problem Statement

The existing Timeline section presents seven milestone events as a single
scrollable dark panel on the main exhibit page. Each event receives a year, a
title, and two to three sentences of description. This is sufficient to
establish historical scale — the social-proof objective it was designed for —
but it leaves visitors without the depth they need to understand what made each
event significant, what the data shows about its impact, and how it shaped the
nuclear industry.

Three concrete problems motivate expanding the timeline into individual event
pages:

1. **Visitors cannot verify or explore individual events in depth.** The
   current descriptions are too brief to support meaningful understanding. A
   visitor who arrives specifically to learn about Chernobyl or Fukushima finds
   a single paragraph where a well-sourced, data-driven exhibit panel would
   serve them better.

2. **The timeline section has no navigation depth.** The top navigation bar
   reaches the timeline section but provides no way to jump directly to a
   specific event. Visitors who want to navigate to a particular year must
   scroll through the full timeline without guidance.

3. **Event-specific data — death tolls, reactor capacity figures, safety reform
   outcomes — exists in cited sources but is not surfaced anywhere in the
   exhibit.** This data is directly relevant to the exhibit's Sage voice goals:
   show the evidence, name the institutions, let the visitor verify.

### Evidence From Available Sources

| #   | Problem                                                                                                                                  | Evidence                                                                                                                                                      | Impact                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Brief descriptions cannot deliver the depth a historically-curious visitor expects                                                       | The existing `timelineEntries` are 1–3 sentences each — insufficient for self-directed learning                                                               | Visitors leave the timeline section with no more understanding than they arrived with           |
| 2   | No direct navigation to individual events                                                                                                | `NAV_SECTIONS` in `site-header.tsx` has a flat "Timeline" link with no sub-navigation                                                                        | Users must scroll to find a specific event; there is no efficient path for returning visitors   |
| 3   | Event-specific quantitative data goes uncited in the exhibit                                                                             | Source entries in `SOURCES.json` include per-event attribution but the timeline display uses only `sourceIds` for badge rendering, not for surfacing evidence | The Cialdini authority principle is under-applied on the most historically complex section      |
| 4   | The timeline section cannot be linked or shared at the event level                                                                       | The single-page architecture provides no shareable URL for a specific event (e.g., Chernobyl or Fukushima)                                                   | Visitors cannot link a colleague directly to the specific event they want to discuss            |

### What This Expansion Must Do

- Create a dedicated detail page for each of the seven timeline events,
  reachable by URL.
- Surface 2–3 data-backed statistics per event, each sourced to an entry in
  `SOURCES.json`.
- Provide a placeholder image container on each event page, ready for images
  to be added later.
- Add a dropdown to the "Timeline" navigation item so visitors can jump
  directly to any event from any point in the exhibit.
- Add previous/next navigation on each event page so visitors can move
  through the timeline chronologically without returning to the main page.
- Maintain full consistency with the Swiss International Style design system
  and Sage voice established in the parent spec.

### Acceptance Criteria

Each requirement above must be verified against these measurable criteria
before this expansion is considered complete:

| #   | Requirement                                 | Acceptance Criterion                                                                                                                                                                                         |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Individual event pages reachable by URL     | Each of the 7 timeline events has a dedicated page at `/timeline/[slug]`. All 7 pages are pre-rendered by `generateStaticParams()` and reachable by navigating to the URL directly.                         |
| 2   | Event pages display data-backed statistics  | Every event detail page renders 2–3 stat cards, each with a `value`, `label`, and visible `SourceBadge`. No statistic appears without attribution.                                                          |
| 3   | Event pages are not text-heavy              | No event detail page renders any paragraph of prose. The `entry.description` field is intentionally omitted from the detail page layout. The only readable text is structured as stat card values/labels, the image alt caption, and navigation links. |
| 4   | Timeline nav dropdown is keyboard-accessible | The desktop dropdown opens on hover and on Enter/Space when the "Timeline" nav item is focused. Tab navigates through dropdown items. Escape closes the dropdown and returns focus to the "Timeline" trigger. |
| 5   | Previous/next navigation on all event pages | Every event detail page renders an event navigation strip at the bottom with a link to the previous event (if one exists), a "Back to Timeline" link, and a link to the next event (if one exists).          |

---

## Design Foundations

This expansion inherits all three design foundations defined in
[docs/_specs/digital-museum/spec.md](docs/_specs/digital-museum/spec.md):

- **Task 1 — Swiss International Style:** all new surfaces use the established
  color tokens, type scale, spacing scale, and grid. No new design tokens are
  introduced. No border-radius on containers or cards. Event detail pages use
  the light background (`--color-bg-primary`) to distinguish them visually
  from the main dark-panel timeline section.

- **Task 2 — Cialdini's Persuasion Principles:** event pages apply the
  authority principle (every stat card sourced) and the social proof principle
  (individual pages reinforce nuclear's proven history). The breadcrumb and
  prev/next navigation apply the commitment/consistency principle — visitors
  who begin exploring events are guided through the full timeline.

- **Task 3 — The Sage archetype:** event page content is data-first, calm,
  and evidence-backed. Accident events (Three Mile Island, Chernobyl,
  Fukushima) lead with correct data rather than with sensationalism.

**Key design constraints for event pages:**

| Constraint                       | Rule                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No paragraphs                    | Content is structured as stat cards and labeled data. No prose blocks.                                                                                                    |
| Image placeholder marking        | The bordered container must display the descriptive `imageAlt` text so it is not mistaken for a broken or missing asset.                                                  |
| Cyan accent on light backgrounds | Event detail pages use `--color-accent-blue` for year numerals. `--color-accent-cyan` must not appear on light backgrounds — it fails WCAG AA contrast against white.    |
| Grid consistency                 | Content grid must use the same 1200 px max-width, centered, with the same outer margins as the main exhibit page.                                                         |

---

## Architecture

### Technology Stack

This expansion adds new routes to the existing Next.js 16 static export. No
changes to the technology stack are required.

| Concern              | Choice                                      | Notes                                                                                                     |
| -------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| New route type       | Next.js App Router dynamic segment          | `app/timeline/[slug]/page.tsx`                                                                            |
| Static pre-rendering | `generateStaticParams()`                    | Derives all slugs from `exhibitData.timelineEntries` at build time                                        |
| Base path            | `NEXT_PUBLIC_BASE_PATH` environment variable | All `href` values must use Next.js `<Link>` (which handles the base path automatically)                  |
| Image `src` values   | `prefixAssetPath()` from `lib/asset-path.ts` | Required for any future `next/image` src on event pages to avoid 404s on GitHub Pages                    |
| Styling              | Existing CSS custom properties              | No new tokens introduced                                                                                  |
| Image content        | Placeholder text in bordered container      | Real images added in a future pass via `next/image` + `prefixAssetPath()`                                |

### New Routes

| Route                 | File                              | Description                                                          |
| --------------------- | --------------------------------- | -------------------------------------------------------------------- |
| `/timeline/[slug]`    | `app/timeline/[slug]/page.tsx`    | Individual event detail page, statically pre-rendered for all 7 slugs |

No `/timeline` index page is created. The "Timeline Overview" link in the nav
dropdown routes to `/#timeline` on the main exhibit page.

### Modified Files

| File                                  | Change                                                                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `lib/exhibit-data.ts`                 | Define `TimelineStat` interface; extend `TimelineEntry` interface; populate `slug`, `imageAlt`, and `stats` on all 7 entries |
| `components/site/site-header.tsx`     | Add Timeline dropdown to desktop nav; add collapsible sub-list to mobile hamburger menu                                       |
| `components/ui/timeline-entry.tsx`    | Add optional `slug` prop; wrap year and title in a Next.js `<Link href="/timeline/${slug}">` when slug is provided            |
| `app/page.tsx`                        | Pass `slug={entry.slug}` to each `TimelineEntry` component in the timeline section map                                        |

### New Files

| File                               | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `app/timeline/[slug]/page.tsx`     | Dynamic event detail page                                            |
| `components/ui/event-nav.tsx`      | Prev/next/back navigation component used at the bottom of each event page |

### Governing Metaphor

Event detail pages function as **exhibit case labels** — the deeper
interpretation panels that museum visitors stop to read at a specific display
case. They are not essays or articles. They present the primary object (the
image placeholder), the key data (stat cards), the institutional attribution
(source badges), and the context needed to move to the next case (event
navigation). One teaching job per page. No decoration.

---

## Data Model

### Extended `TimelineEntry` Interface

The `TimelineEntry` interface in `lib/exhibit-data.ts` is extended with three
new required fields:

```
TimelineEntry {
  year: number | string    // existing — year or decade label
  title: string            // existing — short event name
  description: string      // existing — 1–3 sentence summary for the main page
  sourceIds: string[]      // existing — source IDs for SourceBadge on the main page
  slug: string             // new — URL-safe identifier for /timeline/[slug]
  imageAlt: string         // new — descriptive text for the placeholder image container
  stats: TimelineStat[]    // new — 2–3 data-backed statistics for the detail page
}
```

### New `TimelineStat` Interface

```
TimelineStat {
  value: string     // the prominent displayed value (e.g. "0", "5 MW", "~4,000")
  label: string     // the descriptive label below the value (e.g. "Radiation Deaths", "Grid Capacity")
  sourceId: string  // must match an id field in exhibitData.sources
}
```

`TimelineStat` parallels the existing `StatCard` interface but is scoped to
timeline event pages. It intentionally omits the `context` field — event pages
are structured to be lean rather than verbose.

### Slug Conventions

Slugs are lowercase and hyphen-separated. They are derived from the event
title. Slugs must remain stable after publication because they form the
canonical URL for each event page. Do not change a slug once the site is
deployed.

### Event Data Table

All `stats[].sourceId` values must match an existing `id` field in
`exhibitData.sources`. Stats marked `†` require verifying the exact figure
against the cited source URL before publication. If a figure cannot be
confirmed, replace it with a verifiable figure from the same source or remove
that stat card entirely.

| Year   | Title                    | Slug                  | Stat 1                                                              | Stat 2                                                                  | Stat 3                                                                                     | imageAlt                                                                            |
| ------ | ------------------------ | --------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1942   | Chicago Pile-1           | `chicago-pile-1`      | **200 W** — Peak Power Output (`iaea_nuclear_power_topic`) †        | **45** — Team Members (`iaea_nuclear_power_topic`) †                    | **Dec 2, 1942** — Date of First Criticality (`iaea_nuclear_power_topic`)                   | Photograph of Chicago Pile-1 under construction at Stagg Field, University of Chicago, 1942 |
| 1954   | Obninsk, USSR            | `obninsk-ussr`        | **5 MW** — Reactor Capacity (`iaea_nuclear_power_topic`)            | **1954** — Year First Grid-Connected (`iaea_nuclear_power_topic`)       | **48 years** — Years in Operation (`iaea_nuclear_power_topic`) †                           | Interior of the Obninsk Nuclear Power Plant reactor hall, USSR                      |
| 1957   | Shippingport, Pennsylvania | `shippingport`      | **60 MW** — Plant Capacity (`iaea_nuclear_power_topic`) †           | **1958** — Year Commercial Operations Began (`iaea_nuclear_power_topic`) † | **25 years** — Years of Operation (`iaea_nuclear_power_topic`)                          | Aerial photograph of Shippingport Atomic Power Station, Pennsylvania                |
| 1979   | Three Mile Island        | `three-mile-island`   | **0** — Radiation Deaths (`ourworldindata_chernobyl_fukushima`)     | **14 years** — Duration of Cleanup (`ourworldindata_chernobyl_fukushima`) † | **1979** — Year Safety Reforms Enacted (`ourworldindata_chernobyl_fukushima`)          | Aerial view of Three Mile Island cooling towers, Dauphin County, Pennsylvania       |
| 1986   | Chernobyl                | `chernobyl`           | **31** — Acute Deaths (WHO) (`ourworldindata_chernobyl_fukushima`)  | **~4,000** — Long-Term Projected Deaths (WHO) (`ourworldindata_chernobyl_fukushima`) | **600,000+** — Emergency Workers and Evacuees Affected (`ourworldindata_chernobyl_fukushima`) | Chernobyl Reactor 4 New Safe Confinement structure, Chornobyl Exclusion Zone |
| 2011   | Fukushima Daiichi        | `fukushima-daiichi`   | **0** — Confirmed Radiation Deaths (`ourworldindata_chernobyl_fukushima`) | **3** — Reactors Affected (`ourworldindata_chernobyl_fukushima`)    | **154,000** — People Evacuated (`ourworldindata_chernobyl_fukushima`) †                    | Aerial view of Fukushima Daiichi nuclear power plant following the March 2011 tsunami |
| 2020s  | Nuclear Renaissance      | `nuclear-renaissance` | **6+** — SMRs in NRC Licensing Pipeline (`doe_smr_overview`)        | **~30%** — Annual Data Center Power Demand Growth (`deloitte_data_center_nuclear`) | **3×** — Global Capacity Target by 2050 (`iaea_nuclear_power_topic`) †              | Conceptual rendering of a Small Modular Reactor facility                            |

---

## Navigation Dropdown Specification

### Desktop Dropdown

The existing "Timeline" entry in the desktop nav gains a dropdown panel. A new
`isTimelineDropdownOpen` boolean state variable is added to `SiteHeader`.

**Positioning container requirement:**

The "Timeline" trigger button and its dropdown panel must share a single
`position: relative` wrapper `<div>`. The `onMouseEnter` and `onMouseLeave`
handlers that open/close the dropdown must be placed on this wrapper, not on
the trigger button alone. This prevents a gap between the button and the
absolute-positioned panel from closing the dropdown as the mouse moves between
them. A `mouseenter` on the wrapper opens the dropdown; a `mouseleave` from
the wrapper closes it. The `click`-outside listener is attached to `document`
when the dropdown is open (added in the `useEffect` that watches
`isTimelineDropdownOpen`; removed on cleanup).

**Trigger behavior:**

| Trigger                                                  | Effect                                                               |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| `mouseenter` on the Timeline trigger container           | Opens the dropdown                                                   |
| `mouseleave` from the trigger container (trigger + panel) | Closes the dropdown                                                 |
| `focus` on the "Timeline" trigger button (keyboard)      | Opens the dropdown                                                   |
| `Enter` or `Space` on the "Timeline" trigger button      | Opens the dropdown if closed; closes it if open                      |
| `Escape` key while dropdown is open                      | Closes the dropdown; returns focus to the "Timeline" trigger button  |
| `Tab` while dropdown is open                             | Closes the dropdown; focus moves naturally to the next page element  |
| Click outside the trigger container while dropdown is open | Closes the dropdown                                                |

The "Timeline" trigger is a `<button>` element, not an `<a>`. Navigation to
`/#timeline` is provided exclusively by the "Timeline Overview" item inside
the dropdown panel. This keeps the accessible name, `aria-haspopup`, and
`aria-expanded` on a single, unambiguous interactive element.

**Panel structure:**

```
┌────────────────────────────────────────────┐
│  Timeline Overview                         │  ← /#timeline, weight 700, --color-accent-blue
├────────────────────────────────────────────┤  ← 1px --color-surface-rule divider
│  1942 — Chicago Pile-1                     │
│  1954 — Obninsk, USSR                      │
│  1957 — Shippingport, Pennsylvania          │
│  1979 — Three Mile Island                  │
│  1986 — Chernobyl                          │
│  2011 — Fukushima Daiichi                  │
│  2020s — Nuclear Renaissance               │
└────────────────────────────────────────────┘
```

**Panel styling:**

| Property          | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| Background        | `--color-bg-primary`                                           |
| Border            | `1px solid var(--color-surface-rule)`                          |
| Border-radius     | `0` (Swiss style)                                              |
| Box shadow        | None                                                           |
| Position          | `absolute`, top aligned to the bottom of the trigger container |
| Left alignment    | Aligned to the left edge of the "Timeline" trigger container   |
| Min-width         | `240px`                                                        |
| z-index           | `50` (above the sticky header at `z-index: 40`)                |
| Link font size    | `clamp(13px, 0.3vw + 11.5px, 15px)` — matches existing nav    |
| Link color        | `--color-text-primary` default; `--color-accent-blue` on hover/focus |
| "Timeline Overview" | Weight 700, `--color-accent-blue` at rest                  |
| Item padding      | `--space-2` top/bottom, `--space-4` left/right per item        |

**Accessibility:**

- The "Timeline" trigger is a `<button>` element (not an `<a>`). It carries
  `aria-haspopup="menu"` and `aria-expanded` (toggles between `"true"` and
  `"false"`).
- The dropdown panel uses `role="menu"`.
- Each event link inside the panel uses `role="menuitem"`.
- The "Timeline Overview" item is the first focusable element in the panel.
- Event link data is derived from `exhibitData.timelineEntries` — not
  hardcoded in the component.

**Required keyboard interaction for `role="menu"` (WAI-ARIA Menu Button pattern):**

| Key                        | Effect                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| `↓` (ArrowDown)            | Moves focus to the next menu item; wraps from last to first        |
| `↑` (ArrowUp)              | Moves focus to the previous menu item; wraps from first to last    |
| `Home`                     | Moves focus to the first menu item                                 |
| `End`                      | Moves focus to the last menu item                                  |
| `Enter` / `Space`          | Activates the focused menu item link                               |
| `Escape`                   | Closes the menu; returns focus to the trigger button               |
| `Tab`                      | Closes the menu; moves focus to the next focusable element in the page |

Implementing `role="menu"` without this keyboard pattern violates WAI-ARIA
authoring practices and will fail keyboard-only navigation audits.

### Mobile Sub-List

The "Timeline" entry in the mobile hamburger menu becomes an expandable
accordion row. A new `isTimelineMobileExpanded` boolean state variable is
added to `SiteHeader`, independent of `isMobileMenuOpen`.

**Trigger behavior:**

| Trigger                                        | Effect                                                          |
| ---------------------------------------------- | --------------------------------------------------------------- |
| Tap on the "Timeline" row or its chevron icon  | Toggles the sub-list open or closed                             |
| Tap on any link inside the sub-list            | Navigates; closes the hamburger menu; resets both mobile states |
| `closeMobileMenu()` called                     | Closes hamburger menu and also resets `isTimelineMobileExpanded` to `false` |

**Sub-list structure:**

- Same 8 links as the desktop dropdown in the same order.
- Links are indented `--space-8` from the left edge of the overlay.
- Font size and color match existing mobile nav links.
- A chevron icon — `ChevronDown` from `lucide-react` — is placed to the right
  of the "Timeline" label. It rotates 180° when the sub-list is open. The
  rotation transition respects `prefers-reduced-motion`: when
  `prefers-reduced-motion: reduce` is detected the rotation must be instant
  (use the Tailwind `motion-reduce:transition-none` utility or an equivalent
  CSS media query).
- The sub-list expands inline within the existing hamburger overlay — it does
  not open a nested overlay.

---

## Event Detail Page Layout

Event detail pages use the light background (`--color-bg-primary`) and the
standard 1200px-centered grid. The `SiteHeader` and `SiteFooter` are provided
by the root layout at `app/layout.tsx` and require no changes.

The root layout at `app/layout.tsx` contains a skip-navigation link that
targets `#main-content`. Every event detail page must render its outermost
content wrapper as `<main id="main-content">` so the skip link resolves
correctly. Without this, keyboard users who activate the skip link land
nowhere.

`entry.description` is the 1–3 sentence summary shown on the main exhibit
page's timeline section. It is **not rendered** on event detail pages. Event
detail pages are structured content only: breadcrumb, year/title hero, image
placeholder, stat cards, source badges, and EventNav. No prose paragraph of
any kind appears on the page.

### Page Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  SiteHeader (global, unchanged)                                      │
├──────────────────────────────────────────────────────────────────────┤
│  Breadcrumb                                                          │
│  ← Back to Timeline                                                  │
├──────────────────────────────────────────────────────────────────────┤
│  Event Hero                                                          │
│  {year}                    ← --font-size-display, weight 800, blue  │
│  {title}                   ← --font-size-section, weight 700, black │
├──────────────────────────────────────────────────────────────────────┤
│  Content Grid (2 columns desktop / tablet, 1 column mobile)         │
│  ┌──────────────────────────────┐  ┌───────────────────────────────┐│
│  │  Image Placeholder           │  │  Stat Card                    ││
│  │  [bordered 16:9 container]   │  │  Stat Card                    ││
│  │  {imageAlt caption}          │  │  Stat Card                    ││
│  └──────────────────────────────┘  └───────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  Source Badges                                                       │
│  [Source 1]  [Source 2]                                              │
├──────────────────────────────────────────────────────────────────────┤
│  EventNav                                                            │
│  ← {prevYear} — {prevTitle}  |  Back to Timeline  |  {nextYear} — {nextTitle} → │
├──────────────────────────────────────────────────────────────────────┤
│  SiteFooter (global, unchanged)                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Section-by-Section Specification

**Breadcrumb:**

- Single line: `← Back to Timeline`
- Renders as a Next.js `<Link href="/#timeline">`
- Font size: `--font-size-caption`
- Color: `--color-text-secondary`
- Padding above: `--space-8`; padding below: `--space-6`

**Event Hero:**

- Year: `--font-size-display` (48px desktop / 32px mobile), weight 800,
  `--color-accent-blue`, letter-spacing `−0.02em`
- Title: `--font-size-section` (36px desktop / 26px mobile), weight 700,
  `--color-text-primary`, letter-spacing `−0.02em`
- No background panel — both elements sit on `--color-bg-primary`
- Vertical gap between year and title: `--space-2`
- Padding below the hero block before the content grid: `--space-12`

**Content Grid:**

| Breakpoint | Layout                                  | Gap          |
| ---------- | --------------------------------------- | ------------ |
| Desktop    | `grid-template-columns: 1fr 1fr`        | `--space-8`  |
| Tablet     | `grid-template-columns: 1fr 1fr`        | `--space-6`  |
| Mobile     | Single column                           | `--space-6`  |

**Image Placeholder (left column on desktop/tablet; first on mobile):**

- Container: `aspect-ratio: 16 / 9`, `border: 1px solid var(--color-surface-rule)`,
  `border-radius: 0`, background `--color-bg-tertiary`
- Interior: centered text `[Image: {imageAlt}]` in `--color-text-secondary`,
  `--font-size-caption`
- Caption line directly below container: the `imageAlt` value at
  `--font-size-caption`, `--color-text-secondary`
- The container spans the full width of the left column on all breakpoints

**Stat Cards (right column on desktop/tablet; below image on mobile):**

- 2–3 stat cards stacked vertically, gap `--space-4`
- Each card: `value` at `--font-size-section`, weight 700, `--color-text-primary`;
  `label` at `--font-size-caption`, `--color-text-secondary`
- Card surface: `--color-bg-secondary`, `border: 1px solid var(--color-surface-rule)`,
  `border-radius: 0`, padding `--space-4`
- A `SourceBadge` renders inside each card, below the label
- No `context` field — event stat cards are intentionally lean

> **Implementation note:** The existing `StatCard` component (`components/ui/stat-card.tsx`)
> accepts a `sourceId` prop but does not render a `SourceBadge`. Event detail
> page stat cards must be rendered as inline JSX within `page.tsx` rather than
> reusing the `StatCard` component. For each stat, look up the matching source
> with `exhibitData.sources.find(s => s.id === stat.sourceId)` and pass the
> `sourceName` and `sourceUrl` to `<SourceBadge>`. The `StatCard` component is
> **not** listed in Modified Files and must not be changed as part of this spec.

**Source Badges Row:**

- Horizontal flex row, gap `--space-3`, `flex-wrap: wrap`
- Padding above: `--space-8`
- One `SourceBadge` per entry in `entry.sourceIds`

**EventNav Component:**

- Border-top: `1px solid var(--color-surface-rule)`
- Padding: `--space-6` top and bottom
- Three-column flex layout with `justify-content: space-between`

| Column | Content                              | Condition                    |
| ------ | ------------------------------------ | ---------------------------- |
| Left   | `← {prevYear} — {prevTitle}` as Link | Hidden if `prevEntry` is null (first event) |
| Center | `Back to Timeline` as Link to `/#timeline` | Always present         |
| Right  | `{nextYear} — {nextTitle} →` as Link | Hidden if `nextEntry` is null (last event)  |

- Font size: `--font-size-caption`
- Link color: `--color-text-secondary` default; `--color-accent-blue` on hover/focus
- Margin above the strip: `--space-12`

### Page Metadata

Each event detail page sets its own `<title>` and `<meta name="description">`
via `generateMetadata()`. The root layout provides all other head elements.

| Tag                         | Value                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `<title>`                   | `"{year} — {title} \| Nuclear Energy Museum"`                                        |
| `<meta name="description">` | Sage-voice summary specific to the event; see descriptions table below               |

**Per-event `<meta name="description">` values (implement exactly as written):**

| Slug                  | Description (150–160 characters)                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `chicago-pile-1`      | On December 2, 1942, Enrico Fermi's team achieved the first controlled nuclear chain reaction under Stagg Field, opening the nuclear age.        |
| `obninsk-ussr`        | In 1954 the Soviet Union connected the world's first nuclear power plant to an electrical grid, proving fission could generate usable electricity. |
| `shippingport`        | Shippingport became the first full-scale U.S. commercial nuclear plant in 1958, operating for 25 years and validating civilian nuclear power.     |
| `three-mile-island`   | The 1979 Three Mile Island partial meltdown caused zero radiation deaths and triggered sweeping safety reforms that strengthened U.S. nuclear oversight. |
| `chernobyl`           | The 1986 Chernobyl accident caused 31 acute deaths and prompted a global safety overhaul. WHO projects up to 4,000 long-term cancer fatalities.  |
| `fukushima-daiichi`   | A 2011 tsunami triggered meltdowns at three Fukushima reactors. Confirmed radiation deaths: zero. 154,000 people were evacuated as a precaution. |
| `nuclear-renaissance` | SMRs entering the NRC licensing pipeline and rising AI data-center demand are driving a 21st-century nuclear renaissance targeting 3× global capacity by 2050. |

---

## Component Specifications

### `app/timeline/[slug]/page.tsx` (new)

- Async server component — no `"use client"` directive required.
- Exports `generateStaticParams()`: iterates `exhibitData.timelineEntries`
  and returns `{ slug: entry.slug }` for each entry.
- Exports `generateMetadata({ params })`: awaits `params`, matches `slug`
  against entries, and returns `title` and `description` for the matched event.
  If no entry matches, calls `notFound()`.
- **Next.js 16 async params:** in this project `params` is a `Promise`. Both
  `generateMetadata` and the page component must use the signature
  `{ params }: { params: Promise<{ slug: string }> }` and `await params`
  before accessing `slug`. Accessing `params.slug` synchronously will produce
  a TypeScript error and a runtime warning.

  ```ts
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    // ...
  }

  export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    // ...
  }
  ```

- If `slug` does not match any entry in `exhibitData.timelineEntries`, call
  `notFound()` (imported from `next/navigation`). This triggers Next.js to
  render the nearest `not-found.tsx` or the static 404 page. Do not render a
  blank page or throw an unhandled error.
- Derives the current entry, `prevEntry`, and `nextEntry` from the ordered
  array by index. `prevEntry` is `null` for index 0; `nextEntry` is `null` for
  the last index.
- Renders the full layout: breadcrumb → event hero → content grid → source
  badges → `EventNav`.
- No hardcoded event data — all content sourced from `lib/exhibit-data.ts`.
- All internal navigation uses Next.js `<Link>`.

### `components/ui/event-nav.tsx` (new)

**Props:**

```
EventNavProps {
  prevEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null
  nextEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null
}
```

- Renders the three-column navigation strip defined in the layout section.
- Uses Next.js `<Link>` for all navigation.
- Accepts `null` for either prop; the corresponding column renders empty with
  no placeholder text.
- No `"use client"` directive — purely presentational.

### `components/ui/timeline-entry.tsx` (modified)

- Adds an optional `slug?: string` prop to the existing `TimelineEntryProps`
  interface.
- When `slug` is provided, the year numeral and title heading are wrapped in a
  Next.js `<Link href="/timeline/${slug}">`.
- Link styling: no underline by default on dark backgrounds; underline on
  hover. Text color is inherited from the existing year/title styles — no new
  color tokens.
- When `slug` is not provided, the component behaves identically to its
  current implementation (backwards-compatible).
- No layout or spacing changes beyond the link wrapper.

### `components/site/site-header.tsx` (modified)

- Adds `isTimelineDropdownOpen: boolean` state, initialized `false`.
- Adds `isTimelineMobileExpanded: boolean` state, initialized `false`.
- The "Timeline" nav item in the desktop nav becomes a composite: the existing
  anchor for `/#timeline` plus a conditionally rendered dropdown panel beneath
  it.
- The "Timeline" entry in the mobile hamburger menu gains a chevron toggle
  button and an inline sub-list, conditionally rendered based on
  `isTimelineMobileExpanded`.
- Dropdown event data is derived from `exhibitData.timelineEntries` — not
  hardcoded in the component.
- The existing `NAV_SECTIONS` constant is unchanged.
- `closeMobileMenu()` must also reset `isTimelineMobileExpanded` to `false`.

---

## Static Generation

The dynamic route `app/timeline/[slug]/page.tsx` must export
`generateStaticParams()` to pre-render all event pages at build time,
consistent with the `output: 'export'` configuration in `next.config.ts`.

**Pattern:**

```
export async function generateStaticParams() {
  return exhibitData.timelineEntries.map((entry) => ({
    slug: entry.slug,
  }));
}
```

This produces 7 statically exported HTML files at build time:

| Slug                   | Output path                                  |
| ---------------------- | -------------------------------------------- |
| `chicago-pile-1`       | `out/timeline/chicago-pile-1/index.html`     |
| `obninsk-ussr`         | `out/timeline/obninsk-ussr/index.html`       |
| `shippingport`         | `out/timeline/shippingport/index.html`       |
| `three-mile-island`    | `out/timeline/three-mile-island/index.html`  |
| `chernobyl`            | `out/timeline/chernobyl/index.html`          |
| `fukushima-daiichi`    | `out/timeline/fukushima-daiichi/index.html`  |
| `nuclear-renaissance`  | `out/timeline/nuclear-renaissance/index.html` |

**Base path note:** When deployed to GitHub Pages, all routes are served under
`NEXT_PUBLIC_BASE_PATH=/is117004-digital-museum`. Next.js `<Link>` handles the
base path automatically. Any future `next/image` `src` attributes added to
event pages must use `prefixAssetPath()` from `lib/asset-path.ts`, consistent
with the rest of the exhibit.

---

## Security Considerations

This expansion inherits all security requirements from the parent spec. The
following considerations are specific to new surfaces:

- **External links on event pages.** All `<a>` elements linking to external
  domains — including those rendered by `SourceBadge` — must include
  `rel="noopener noreferrer"` and `target="_blank"`. Verify the existing
  `SourceBadge` component already includes these attributes. If not, add them
  as part of this spec.
- **No inline event handlers.** Dropdown and mobile sub-list state must be
  managed via React event props (`onMouseEnter`, `onKeyDown`, `onClick`,
  etc.), never via inline HTML attributes (`onclick`, `onmouseenter`).
- **Image placeholder text is static.** The placeholder string is sourced
  from `lib/exhibit-data.ts` — there is no user input, no injection surface.
- **`generateStaticParams()` operates at build time.** No runtime data
  fetching, no external network calls, no injection surface at request time.
- **Base path handling.** Use Next.js `<Link>` for all internal navigation.
  Do not construct internal URLs with string concatenation — this can
  mishandle the base path on GitHub Pages deployments.

---

## Testing Strategy

All 25 tests from the parent spec remain in force. The following additional
tests apply specifically to this expansion.

### Build and Code Quality

| #   | Test                               | Pass Criterion                                                                                                        | Tool / Method          |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 26  | Build with new routes              | `npm run build` completes with exit code 0 and produces all 7 HTML files under `out/timeline/`                       | Terminal               |
| 27  | TypeScript after interface extension | `npx tsc --noEmit` reports zero errors after `TimelineEntry` and `TimelineStat` interface changes and new components | TypeScript compiler    |
| 28  | Lint on new and modified files     | `npm run lint` reports zero errors in all new and modified files                                                      | ESLint                 |

### Routing and Navigation

| #   | Test                                   | Pass Criterion                                                                                                                        | Tool / Method                                  |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 29  | All 7 event pages render               | Each of the 7 `/timeline/[slug]` URLs returns a rendered page with the correct year and title                                         | Playwright: visit each URL, assert heading content |
| 30  | 404 for unknown slugs                  | Navigating to `/timeline/unknown-slug` returns the static 404 page                                                                   | Playwright: navigate to the URL, assert the page title contains "404" or assert the expected `<h1>` not-found text is present |
| 31  | Dropdown event links navigate correctly | Clicking each of the 7 event links in the desktop dropdown navigates to the correct `/timeline/[slug]` page                          | Playwright: hover dropdown, click each link, assert URL |
| 32  | "Timeline Overview" link in dropdown   | Clicking "Timeline Overview" navigates to `/#timeline`                                                                                | Playwright: hover dropdown, click link, assert URL or scroll position |
| 33  | Mobile sub-list links navigate         | Tapping the Timeline row in the mobile hamburger menu expands the sub-list; tapping any event link navigates correctly and closes the hamburger menu | Playwright at 390 px viewport |

### Accessibility

| #   | Test                              | Pass Criterion                                                                                                                                        | Tool / Method                                       |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 34  | Dropdown keyboard navigation      | Desktop dropdown opens on Enter/Space when the "Timeline" trigger is focused. Arrow keys (↑/↓) move focus between menu items; Home/End reach first/last. Escape closes the menu and returns focus to the trigger. Tab closes the menu and moves focus to the next page element. | Playwright: focus the trigger via keyboard, assert `aria-expanded`, send arrow keys, assert focused element, send Escape, assert focus returned to trigger |
| 35  | `aria-expanded` state             | The "Timeline" nav trigger `aria-expanded` is `"true"` when dropdown is open, `"false"` when closed                                                 | Playwright: assert attribute value on trigger element |
| 36  | Image placeholder descriptive text | All event detail pages render the `imageAlt` value as visible text inside or directly below the placeholder container. An `aria-label` alone does not satisfy this criterion — the text must be in the DOM as visible content. | Playwright: for each of the 7 event pages, query the visible text content of the placeholder region and assert it contains the expected `imageAlt` string |
| 37  | Event detail page color contrast  | All text on event detail pages (blue year, black title, secondary labels) meets WCAG AA (≥ 4.5:1 for normal text)                                    | Lighthouse accessibility audit score ≥ 95           |

### Content Integrity

| #   | Test                               | Pass Criterion                                                                                                                                  | Tool / Method                             |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 38  | Stat card source traceability      | Every `stats[].sourceId` on all 7 entries matches an existing `id` in `exhibitData.sources`                                                    | Manual audit of `lib/exhibit-data.ts`     |
| 39  | Prev/next navigation correctness   | On each event page, the prev link navigates to the chronologically preceding event; the next link navigates to the following event              | Playwright: navigate through all 7 events in sequence |
| 40  | First event has no prev link       | The Chicago Pile-1 page renders no "← prev" link                                                                                                | Playwright: assert element absence        |
| 41  | Last event has no next link        | The Nuclear Renaissance page renders no "next →" link                                                                                           | Playwright: assert element absence        |
| 42  | `SourceBadge` external link security | All `<a>` elements in `SourceBadge` components on event pages include `rel="noopener noreferrer"` and `target="_blank"`                       | Playwright: query all external `<a>` elements, assert attributes |

### Responsive and Visual

| #   | Test                              | Pass Criterion                                                                                                          | Tool / Method                         |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 43  | Desktop event page layout         | At 1440 px, the content grid renders two columns (image left, stats right) with no horizontal overflow                 | Playwright screenshot at 1440 × 900   |
| 44  | Mobile event page layout          | At 390 px, the content grid is single-column (image above stats); all content is visible without horizontal scroll     | Playwright screenshot at 390 × 844    |
| 45  | Desktop dropdown visible          | At 1440 px, hovering the "Timeline" trigger reveals the dropdown panel. The panel element is present in the DOM, has a non-zero bounding rect, and all 8 links are visible within the viewport with no horizontal clipping. | Playwright at 1440 × 900: hover trigger, assert panel is visible, assert no horizontal overflow on panel element |
| 46  | Mobile sub-list visible           | At 390 px, tapping "Timeline" in the hamburger menu reveals the inline sub-list without layout overflow                | Playwright screenshot at 390 × 844    |

---

## Spec Plan

### Definition of Done

A sprint is complete when all of the following are true:

1. All sprint deliverables are implemented and visible at the correct routes.
2. `npm run build` completes with exit code 0 and produces
   `out/timeline/[slug]/index.html` for all 7 slugs.
3. `npm run lint` reports zero errors.
4. `npx tsc --noEmit` reports zero type errors.
5. All placeholder containers have descriptive `imageAlt` text visible in the
   rendered page.
6. Responsive layout verified at 1440 px, 768 px, and 390 px for event detail
   pages and the updated nav.
7. Changes committed to version control with a descriptive commit message.

### Spec — Timeline Expansion

- **Goal:** extend the existing Timeline section with individual event detail
  pages at `/timeline/[slug]`, enrich the event data model, add a dropdown to
  the "Timeline" nav item, and link each `TimelineEntry` on the main page to
  its detail page — without altering any other section or component behavior.
- **Spec sections:**
  - Data Model
  - Navigation Dropdown Specification
  - Event Detail Page Layout
  - Component Specifications
  - Static Generation
  - Security Considerations (new surfaces)
- **Prerequisite:** Sprint 5 — QA, Accessibility, and Polish
- **Expected test count:** `25 existing + 21 new = 46 total`

#### Available Assets

| Asset                              | Verified details                                                                        | How this spec uses it                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `components/ui/timeline-entry.tsx` | Renders year + title + description with dark/light variant; no link behavior currently  | Modified to accept `slug` prop and wrap year/title in `<Link>`                   |
| `components/site/site-header.tsx`  | Sticky nav with flat `NAV_SECTIONS` array; hamburger mobile menu; Intersection Observer | Modified to add dropdown (desktop) and sub-list (mobile) for "Timeline" item     |
| `lib/exhibit-data.ts`              | Contains `TimelineEntry[]` with 7 populated entries                                     | Extended with `TimelineStat` interface and `slug`, `imageAlt`, `stats` fields    |
| `components/ui/stat-card.tsx`      | Renders `value` + `label` + optional `context`; accepts `sourceId` but does **not** render a `SourceBadge` | Informs the visual layout of inline stat card blocks in `page.tsx`; not used directly — see Stat Cards note in Event Detail Page Layout |
| `components/ui/source-badge.tsx`   | Renders source attribution with external link safety                                    | Reused on event detail pages; verify `rel="noopener noreferrer"` is present      |
| `lib/asset-path.ts`                | Exports `prefixAssetPath()` for GitHub Pages base path                                  | Must be used on any future `next/image` `src` added to event pages               |

#### Tasks

**1. Extend the data model**

Update `lib/exhibit-data.ts`:

- Define the `TimelineStat` interface: `{ value: string; label: string; sourceId: string }`.
- Add `slug`, `imageAlt`, and `stats` fields to the `TimelineEntry` interface.
- Populate all 7 existing entries with the values from the Event Data Table in
  this spec. Mark stats needing source verification with a code comment (`// verify`).

Verify:

```bash
npx tsc --noEmit
```

---

**2. Create the `EventNav` component**

Create `components/ui/event-nav.tsx`.

Required behavior:

- Accepts `prevEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null`
  and `nextEntry: Pick<TimelineEntry, "year" | "title" | "slug"> | null`.
- Renders the three-column strip with a top border rule per the layout
  specification in this spec.
- Left: prev link. Center: Back to Timeline link. Right: next link.
- Columns for null entries render empty — no placeholder text.
- Uses Next.js `<Link>` for all navigation.
- No `"use client"` directive.

Verify:

```bash
npx tsc --noEmit
```

---

**3. Create the event detail page**

Create `app/timeline/[slug]/page.tsx`.

Required behavior:

- Export `generateStaticParams()` returning `{ slug }` for each entry in
  `exhibitData.timelineEntries`.
- Export `generateMetadata({ params })` returning the event's `title` and a
  Sage-voice `description` per the Page Metadata table in this spec.
- Derive the current entry, `prevEntry`, and `nextEntry` from the ordered
  `timelineEntries` array using the resolved `slug` (from `await params`).
- Render: breadcrumb → event hero → content grid (image placeholder left,
  stat cards right) → source badges → `EventNav`.
- No hardcoded event data.

Verify:

```bash
npm run build
```

---

**4. Modify `TimelineEntry` to link to event pages**

Update `components/ui/timeline-entry.tsx`:

- Add optional `slug?: string` prop.
- When `slug` is provided, wrap the year and title in a Next.js
  `<Link href="/timeline/${slug}">`.
- When `slug` is not provided, behavior is identical to the current
  implementation.

Update `app/page.tsx` to pass `slug={entry.slug}` to each `TimelineEntry`
in the timeline section map.

Verify:

```bash
npm run build
```

---

**5. Add the Timeline dropdown and mobile sub-list to `SiteHeader`**

Update `components/site/site-header.tsx`:

- Add `isTimelineDropdownOpen` state (desktop dropdown).
- Add `isTimelineMobileExpanded` state (mobile sub-list).
- Derive the 7 event links from `exhibitData.timelineEntries` — not hardcoded.
- Implement the desktop hover/focus dropdown panel per the Navigation Dropdown
  Specification in this spec.
- Implement the mobile chevron toggle and inline sub-list per the Navigation
  Dropdown Specification in this spec.
- Add `aria-expanded` and `aria-haspopup="menu"` to the "Timeline" nav trigger.
- Ensure `closeMobileMenu()` also resets `isTimelineMobileExpanded` to `false`.

Verify:

```bash
npm run build
npm run lint
```

---

**6. Responsive and accessibility verification**

Verify the full testing strategy for this expansion (tests 26–46):

- Desktop event pages at 1440 px: two-column grid, no overflow.
- Mobile event pages at 390 px: single-column, no overflow.
- Desktop dropdown: opens on hover and keyboard focus, Tab-navigable,
  closes on Escape.
- Mobile sub-list: expands/collapses on tap, link tap closes hamburger menu.
- All external links on event pages include `rel="noopener noreferrer"` and
  `target="_blank"`.

Verify:

```bash
npm run build
npx playwright test
```

#### Completion Checklist

- [ ] `TimelineStat` interface defined in `lib/exhibit-data.ts`
- [ ] `TimelineEntry` extended with `slug`, `imageAlt`, `stats` fields
- [ ] All 7 entries populated with slugs, imageAlt, and stats from the Event Data Table
- [ ] All `stats[].sourceId` values verified against `exhibitData.sources`; `†` notes resolved
- [ ] Every entry has exactly 2 or 3 stats (no entry has 0 or 1)
- [ ] `components/ui/event-nav.tsx` created
- [ ] `app/timeline/[slug]/page.tsx` created with `generateStaticParams()` and `generateMetadata()`
- [ ] `page.tsx` uses async `params` signature (`params: Promise<{ slug: string }>`) and awaits before use
- [ ] `page.tsx` calls `notFound()` when `params.slug` matches no entry
- [ ] `page.tsx` renders `<main id="main-content">` as the outermost content wrapper
- [ ] All 7 event detail pages render at their `/timeline/[slug]` URLs
- [ ] Each event page displays: breadcrumb, year, title, image placeholder, stat cards, source badges, EventNav
- [ ] `entry.description` is not rendered anywhere on event detail pages
- [ ] Stat cards are rendered as inline JSX (not via `<StatCard>`); each includes a `<SourceBadge>` from the matching source object
- [ ] `timeline-entry.tsx` modified to accept `slug` prop and wrap year/title in `<Link>`
- [ ] `app/page.tsx` updated to pass `slug` to each `TimelineEntry`
- [ ] Desktop Timeline "Timeline" nav item is a `<button>` (not an `<a>`)
- [ ] Timeline trigger container uses `position: relative`; dropdown panel uses `position: absolute`
- [ ] `onMouseEnter`/`onMouseLeave` handlers are on the wrapper container, not the trigger button alone
- [ ] Click-outside handler closes the dropdown (attached to `document` via `useEffect`)
- [ ] Desktop Timeline dropdown renders on hover/focus with correct links
- [ ] Desktop dropdown supports full WAI-ARIA Menu Button keyboard pattern (↑↓ arrows, Home, End, Escape, Tab)
- [ ] `aria-expanded` and `aria-haspopup="menu"` attributes present on Timeline nav trigger button
- [ ] Mobile Timeline sub-list uses `ChevronDown` from `lucide-react`; rotates 180° when open
- [ ] Chevron rotation respects `prefers-reduced-motion`
- [ ] Mobile Timeline sub-list expands/collapses on tap
- [ ] Closing hamburger menu resets `isTimelineMobileExpanded` to `false`
- [ ] Stat card values verified against cited source URLs; `// verify` comments removed
- [ ] No hardcoded color values — all values use CSS custom properties
- [ ] No inline event handlers
- [ ] All external links include `rel="noopener noreferrer"` and `target="_blank"`
- [ ] `prefixAssetPath()` usage documented in a comment on the image placeholder in `page.tsx`
- [ ] Responsive layout verified at 1440 px, 768 px, and 390 px
- [ ] `npm run build` completes with exit code 0 and produces 7 files under `out/timeline/`
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors
