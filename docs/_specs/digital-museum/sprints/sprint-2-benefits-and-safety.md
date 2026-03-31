# Sprint 2 — Benefits and Safety Sections

## Header

- **Goal:** build the comparative-evidence room (Benefits) and the
  honest-context room (Safety). These are the two most persuasion-sensitive
  sections and must demonstrate Sage voice discipline, Cialdini's authority
  principle through source attribution, and accurate data presentation.
- **Spec sections:**
  - Section Detail: 3. Benefits, 4. Safety
  - Reusable Component Architecture (DataComparisonCard)
  - Design Foundations: Task 2 (Cialdini — authority, social proof), Task 3
    (Sage voice — how it addresses misconceptions)
  - CSS Architecture: section theming (green for Benefits, red for Safety)
  - Content Data Model
- **Prerequisite:** Sprint 1 — Hero and How It Works Sections
- **Expected test count:** `0 existing + 0 new = 0 total` (build, lint, and
  typecheck remain the primary gates)

## Available Assets

| Asset | Verified details | How this sprint uses it |
|-------|-----------------|------------------------|
| `public/assets/images/safest_cleanest_sources_of_energy_chart.png` | Our World in Data chart comparing deaths and emissions across energy sources | Benefits section primary visual — the exhibit's key evidence display |
| `components/ui/section-header.tsx` | Renders eyebrow + title + lede with light/dark variants | Reused for both section headers |
| `components/ui/exhibit-image.tsx` | Renders images with captions, source badges, and reduced-motion support | Reused for the safety/emissions chart in Benefits |
| `components/ui/stat-card.tsx` | Renders statistics with value, label, context | Reused for benefit highlight cards |
| `components/ui/source-badge.tsx` | Renders source attributions with external link safety | Reused on all data displays |
| `lib/exhibit-data.ts` | Typed interfaces already defined; hero and how-it-works data populated | Extend with benefits and safety section data |
| `docs/_research/SOURCES.json` | Source entries: `safest_cleanest_sources_chart`, `iaea_clean_energy_pdf`, `iaea_smart_stable_reliable`, `ourworldindata_chernobyl_fukushima`, `nrc_spent_fuel_storage` | Data source for all attributions in these sections |
| `app/page.tsx` | Contains placeholder sections for `#benefits` and `#safety` | Replace placeholders with full exhibit content |

## Tasks

### 1. Create the DataComparisonCard component

Create `components/ui/data-comparison-card.tsx`. This component presents
side-by-side or stacked comparison data, used in both Benefits and Safety.

Required behavior:

- Accepts props: `items: Array<{ label: string; value: string; unit?: string }>`,
  `title?: string`, `sourceName?: string`, `sourceUrl?: string`,
  `variant?: "light" | "dark"`.
- Renders a comparison layout: each item shows its label and value,
  visually distinguished so the comparison is immediate.
- On desktop, items can be displayed side-by-side in a row. On mobile,
  items stack vertically.
- Card surface uses `--color-bg-tertiary` with `--color-surface-rule`
  border. No border-radius (Swiss style).
- Values are styled prominently (`--font-size-sub`, weight 700) with the
  section's accent color.
- Include a `SourceBadge` at the bottom of the card.

**Verify:**

```bash
npx tsc --noEmit
```

### 2. Populate exhibit data for Benefits and Safety

Update `lib/exhibit-data.ts` with real content for both sections.

**Benefits section data:**
- `id: "benefits"`, `title: "Why Nuclear Beats Fossil Fuels"`,
  `eyebrow: "The Evidence"`
- Lede: Sage-voice introduction to the comparative data.
- Body content: interpretation of the chart data — measured comparison,
  not promotional claim.
- Source IDs: `["safest_cleanest_sources_chart", "iaea_clean_energy_pdf", "iaea_smart_stable_reliable"]`
- Accent color: `--color-accent-green`
- Transition: "If the safety record is this strong, why do accidents
  dominate the public conversation?"

**Benefits stat cards (4):**
1. "Low Emissions" / "Lifecycle CO₂ comparable to wind and solar" /
   Source: IAEA
2. "~93%" / "Capacity Factor" / "Highest of any energy source — nuclear
   plants run 24/7" / Source: EIA
3. "Extreme Density" / "One uranium pellet contains as much energy as one
   ton of coal" / Source: Visual Capitalist
4. "Fewest Deaths" / "Nuclear has the lowest death rate per TWh of any
   major source" / Source: Our World in Data

**Safety section data:**
- `id: "safety"`, `title: "Addressing Nuclear Safety and Waste"`,
  `eyebrow: "Honest Context"`
- Lede: lead with the correct data, not the misconception (Sage approach).
- Body content: Deaths from Chernobyl and Fukushima in context. Direct
  comparison to routine fossil-fuel mortality. Waste framed as a managed
  volume problem — all U.S. spent fuel from 60+ years fits on a football
  field stacked less than 10 yards high.
- Source IDs: `["ourworldindata_chernobyl_fukushima", "nrc_spent_fuel_storage", "safest_cleanest_sources_chart"]`
- Accent color: `--color-accent-red`
- Transition: "Nuclear fuel has one of the most carefully managed
  lifecycles of any energy source. Here is how it works from start to
  finish."

**Safety comparison data:**
- Deaths per TWh comparison: Nuclear vs. Coal vs. Oil vs. Gas
  (from Our World in Data)
- Waste volume context: "All U.S. spent fuel from 60+ years of operation
  would fit on a single football field, stacked less than 10 yards high"

**Additional source entries** for the `sources` array as needed.

**Verify:**

```bash
npx tsc --noEmit
```

### 3. Build the Benefits section

Replace the benefits placeholder in `app/page.tsx` with the full section.

Required structure (from spec):

- `<section id="benefits" aria-labelledby="benefits-title">` with light
  background (`--color-bg-secondary`).
- `SectionHeader` with eyebrow "The Evidence", title, and lede.
- `ExhibitImage` with `safest_cleanest_sources_of_energy_chart.png`,
  descriptive alt text explaining the chart shows deaths and emissions by
  energy source, caption, and Our World in Data source badge.
- Four stat/benefit cards using `StatCard` components, each with a source
  badge.
- Green accent (`--color-accent-green`) for data highlights and card
  accents.
- Transition text bridging to the Safety section.
- All content pulled from `lib/exhibit-data.ts`.

**Copy review checkpoint:** Before committing, verify all text in this
section against the Sage voice checklist:
- No unsourced superlatives ("best," "amazing")
- No promotional language ("Nuclear is the answer!")
- Every claim tied to a named source
- Measured, declarative phrasing

**Verify:**

```bash
npm run build
```

### 4. Build the Safety section

Replace the safety placeholder in `app/page.tsx` with the full section.

Required structure (from spec):

- `<section id="safety" aria-labelledby="safety-title">` with light
  background (`--color-bg-primary`).
- `SectionHeader` with eyebrow "Honest Context", title, and lede.
- Body text naming Chernobyl and Fukushima, stating peer-reviewed death
  toll figures, and providing at least one direct comparison to fossil-fuel
  mortality per TWh. Lead with the correct fact (Sage approach), then
  address the misconception.
- `DataComparisonCard` showing nuclear vs. fossil fuel deaths per TWh.
- Waste management context: volume comparison and NRC spent-fuel-storage
  reference.
- Red accent (`--color-accent-red`) for safety context highlights. Note:
  red signals contextual honesty, not danger.
- Source badges: Our World in Data, NRC.
- Transition text bridging to the Fuel Cycle section.
- All content pulled from `lib/exhibit-data.ts`.

**Copy review checkpoint:** This is the most voice-sensitive section.
Verify against Sage guidelines:
- Names Chernobyl and Fukushima — does not avoid them
- States actual data — does not minimize or exaggerate
- Compares to fossil-fuel mortality — provides perspective
- Frames waste as managed engineering challenge — not unsolved crisis
- No dismissive language ("People who fear nuclear are wrong")
- No fear language ("disaster," "catastrophe" without data context)

**Verify:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

### 5. Section theming verification

Verify the accent color system is correctly applied:

- Benefits section: `--color-accent-green` on stat card values, eyebrow,
  and data highlights.
- Safety section: `--color-accent-red` on contextual highlights, eyebrow,
  and comparison card accents.
- No accent colors used on inappropriate backgrounds (e.g.,
  `--color-accent-cyan` must not appear on light backgrounds per spec).

**Verify:**

```bash
npm run build
npm run dev
```

Visual inspection at 1440 px, 768 px, and 390 px.

## Completion Checklist

- [ ] `components/ui/data-comparison-card.tsx` renders comparison data with responsive layout
- [ ] `lib/exhibit-data.ts` contains typed, populated data for benefits and safety sections
- [ ] Benefits section renders with emissions chart, 4 benefit cards, and green accent
- [ ] Safety section renders with accident data, fossil-fuel comparison, and waste context
- [ ] Safety section names Chernobyl and Fukushima with peer-reviewed death figures
- [ ] Safety section includes at least one direct comparison to fossil-fuel mortality per TWh
- [ ] `DataComparisonCard` shows nuclear vs. fossil fuel deaths comparison
- [ ] All images have descriptive `alt` attributes
- [ ] All source badges show correct attributions (Our World in Data, IAEA, NRC)
- [ ] Transition text connects benefits → safety → (next section)
- [ ] All copy reviewed against Sage voice guidelines — zero violations
- [ ] Section accent colors correctly applied (green for Benefits, red for Safety)
- [ ] No hardcoded color values in new components
- [ ] Responsive layout verified at 1440 px, 768 px, and 390 px
- [ ] `npm run build` completes with exit code 0
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors

## QA Deviations

None.
