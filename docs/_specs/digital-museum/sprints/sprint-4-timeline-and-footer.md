# Sprint 4 — Timeline and Footer Completion

## Header

- **Goal:** build the historical scale room (Timeline) with the
  `TimelineEntry` component, complete the site footer with the full organized
  source list from SOURCES.json, finalize all section transition language, and
  confirm the navigation active-state highlighting works across all seven
  sections.
- **Spec sections:**
  - Section Detail: 7. Timeline
  - Footer
  - Navigation Model (active section highlighting)
  - Reusable Component Architecture (TimelineEntry)
  - Design Foundations: Task 2 (Cialdini — social proof through global scale,
    reciprocity through source transparency)
  - CSS Architecture: section theming (dark panel for Timeline)
  - Security Considerations (external links)
- **Prerequisite:** Sprint 3 — Fuel Cycle and Future Demand Sections
- **Expected test count:** `0 existing + 0 new = 0 total` (build, lint, and
  typecheck remain the primary gates)

## Available Assets

| Asset | Verified details | How this sprint uses it |
|-------|-----------------|------------------------|
| `components/ui/section-header.tsx` | Renders eyebrow + title + lede with light/dark variants | Reused for the timeline section header (dark variant) |
| `components/ui/source-badge.tsx` | Renders source attributions with external link safety | Reused on timeline entries and footer source list |
| `components/site/site-footer.tsx` | Skeleton footer from Sprint 0 with placeholder source list structure | Populated with full source data from exhibit-data |
| `components/site/site-header.tsx` | Sticky nav with Intersection Observer active-state highlighting | Verified to work across all 7 sections now that all exist |
| `lib/exhibit-data.ts` | Contains data for 6 sections (hero through future-demand) | Extended with timeline entries and complete source list |
| `docs/_research/SOURCES.json` | All source entries: primary, supporting, and timeline sources | Source of truth for the footer's organized source list |
| `app/page.tsx` | Contains 6 implemented sections + 1 timeline placeholder | Replace timeline placeholder with full section |

## Tasks

### 1. Create the TimelineEntry component

Create `components/ui/timeline-entry.tsx`. This component renders a single
milestone in the nuclear power timeline.

Required behavior:

- Accepts props: `year: number | string`, `title: string`, `description: string`,
  `badge?: string`, `variant?: "light" | "dark"`.
- Renders the year as a prominent numeral (`--font-size-section`, weight
  800, `--color-accent-cyan` on dark panels).
- Renders the title at `--font-size-sub`, weight 700.
- Renders the description at `--font-size-body`.
- On dark variant, text uses `--color-text-on-dark` and
  `--color-text-secondary-on-dark`.
- Layout: vertical timeline with a connecting visual element (a thin
  vertical rule using `--color-surface-rule` or `--color-accent-cyan`
  on dark). Each entry sits alongside the rule. On mobile, simplify to
  a stacked layout with the year above the content.
- No border-radius. Clean, Swiss-precise layout.

**Verify:**

```bash
npx tsc --noEmit
```

### 2. Populate exhibit data for the Timeline

Update `lib/exhibit-data.ts` with the seven timeline milestones from the
spec.

**Timeline entries (7):**

1. **1942** — "Chicago Pile-1" / "First controlled nuclear chain reaction,
   achieved by Enrico Fermi's team at the University of Chicago. Proved
   that sustained fission was possible." /
   Sources: `["iaea_nuclear_power_topic"]`

2. **1954** — "Obninsk, USSR" / "First nuclear power plant connected to
   an electrical grid. A 5-megawatt reactor demonstrated that nuclear
   fission could generate usable electricity." /
   Sources: `["iaea_nuclear_power_topic"]`

3. **1957** — "Shippingport, Pennsylvania" / "First full-scale commercial
   nuclear power plant in the United States. Operated for 25 years,
   proving the viability of civilian nuclear power." /
   Sources: `["iaea_nuclear_power_topic"]`

4. **1979** — "Three Mile Island" / "Partial meltdown of a reactor in
   Pennsylvania. No deaths resulted. The accident led to sweeping safety
   reforms across the U.S. nuclear industry." /
   Sources: `["ourworldindata_chernobyl_fukushima"]`

5. **1986** — "Chernobyl" / "Worst nuclear accident in history, caused by
   design flaws and operator errors during a safety test. Led to a global
   overhaul of nuclear safety standards and reactor design." /
   Sources: `["ourworldindata_chernobyl_fukushima"]`

6. **2011** — "Fukushima Daiichi" / "Tsunami-caused meltdowns at three
   reactors in Japan. Zero deaths from radiation exposure. The accident
   prompted worldwide safety reviews and reinforced the importance of
   natural-disaster preparedness in plant design." /
   Sources: `["ourworldindata_chernobyl_fukushima"]`

7. **2020s** — "Nuclear Renaissance" / "Small Modular Reactors enter the
   licensing pipeline. AI data center demand drives renewed investment.
   Net-zero commitments bring nuclear back to the center of energy
   planning worldwide." /
   Sources: `["doe_smr_overview", "deloitte_data_center_nuclear"]`

> **Note:** The `TimelineEntry` type defines `year: number | string`.
> Entry 7 uses the string `"2020s"` rather than a single year number.

**Closing statement** (displayed after the timeline):
"Nuclear energy is not a hypothetical. It is a proven, global-scale,
low-carbon power source — and the evidence is here for you to verify."

**Verify:**

```bash
npx tsc --noEmit
```

### 3. Build the Timeline section

Replace the timeline placeholder in `app/page.tsx` with the full section.

Required structure (from spec):

- `<section id="timeline" aria-labelledby="timeline-title">` with dark
  background (`--color-bg-dark`).
- `SectionHeader` with eyebrow "History", title "The Rise of Nuclear
  Power", dark variant.
- Seven `TimelineEntry` components arranged in chronological order with
  a vertical timeline connecting element.
- Cyan accent (`--color-accent-cyan`) for year numerals and the timeline
  rule — this is acceptable on dark backgrounds per the spec's color
  constraint.
- Source badges: IAEA, Our World in Data, World Nuclear Association, DOE.
- Closing Sage-voice statement after the final entry.
- All content pulled from `lib/exhibit-data.ts`.

**Verify:**

```bash
npm run build
```

### 4. Complete the site footer with full source list

Update `components/site/site-footer.tsx` to render the complete organized
source list from `lib/exhibit-data.ts`.

Required structure (from spec):

- Organize sources by type: Government & Regulatory (NRC, DOE, EIA),
  Data & Research (Our World in Data, IAEA), Industry Analysis (Deloitte,
  World Nuclear Association), Media (Visual Capitalist, NEI).
- Each source entry shows: title, source organization, and a direct link
  to the source URL.
- All external `<a>` elements must include `rel="noopener noreferrer"`
  and `target="_blank"`.
- The reciprocity closing line: "We showed you the evidence. Here is
  where to verify it yourself."
- Visual asset credits: attribution for the three primary images
  (Visual Capitalist diagram, Our World in Data chart, NEI animation).
- Footer uses `--color-bg-dark` background with `--color-text-on-dark`
  text for visual weight and distinction from the main content.

**Verify:**

```bash
npm run build
```

### 5. Review and finalize all section transitions

Read through all seven sections in sequence and verify the transition
text creates a coherent narrative thread:

1. Hero → How It Works: "To understand why that pellet is so powerful,
   you need to see what happens inside a reactor."
2. How It Works → Benefits: "Now that you see how the energy is made,
   here is how it compares with every other source."
3. Benefits → Safety: "If the safety record is this strong, why do
   accidents dominate the public conversation?"
4. Safety → Fuel Cycle: "Nuclear fuel has one of the most carefully
   managed lifecycles of any energy source. Here is how it works from
   start to finish."
5. Fuel Cycle → Future Demand: "With this lifecycle in view, the
   question becomes: where is nuclear energy headed next?"
6. Future Demand → Timeline: "Nuclear power is not new. It has been
   growing for eight decades. Here is how it became a global energy
   source."

Verify each transition appears in the rendered page and reads naturally
in sequence.

**Verify:**

```bash
npm run dev
```

Manual scroll-through of the complete exhibit.

### 6. Verify navigation active-state highlighting

With all seven sections now implemented, verify the Intersection Observer
active-state highlighting in `SiteHeader` works correctly:

- As the visitor scrolls through the exhibit, the nav link for the
  current section receives the active style.
- Active style uses `--color-accent-blue` (underline or background).
- On mobile, the hamburger menu links also reflect active state when
  the overlay is open.
- Smooth transition between active states — no flickering at section
  boundaries.

**Verify:**

```bash
npm run dev
```

Manual scroll test at 1440 px and 390 px.

### 7. External link security audit

Verify all external links in the footer (and anywhere else in the site)
include the required security attributes:

```bash
# Search for external links missing security attributes
grep -rn "href=\"http" app/ components/ --include="*.tsx" --include="*.ts"
```

Every `<a>` with an external `href` (starting with `http://` or
`https://`) must have `rel="noopener noreferrer"` and `target="_blank"`.

**Verify:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Completion Checklist

- [ ] `components/ui/timeline-entry.tsx` renders milestones with year, title, description, and timeline visual
- [ ] `lib/exhibit-data.ts` contains 7 timeline entries with accurate historical data
- [ ] Timeline section renders on dark background with cyan accent and vertical timeline
- [ ] Timeline closing statement is present in Sage voice
- [ ] Site footer renders organized source list by category (Government, Data, Industry, Media)
- [ ] All footer source links include `rel="noopener noreferrer"` and `target="_blank"`
- [ ] Footer shows reciprocity closing line
- [ ] Footer shows visual asset credits for 3 primary images
- [ ] All 6 section transitions are present and read naturally in sequence
- [ ] Navigation active-state highlighting works across all 7 sections
- [ ] Active nav state uses `--color-accent-blue` indicator
- [ ] All external links across the entire site have security attributes
- [ ] No hardcoded color values in new code
- [ ] Responsive layout verified at 1440 px, 768 px, and 390 px
- [ ] `npm run build` completes with exit code 0
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors

## QA Deviations

None.
