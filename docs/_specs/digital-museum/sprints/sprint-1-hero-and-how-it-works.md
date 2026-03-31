# Sprint 1 — Hero and How It Works Sections

## Header

- **Goal:** build the first two exhibit rooms — the hero section establishing
  the thesis and energy density visual, and the How It Works section teaching
  the reactor process. These two sections prove the core component
  architecture (SectionHeader, ExhibitImage, StepCard, StatCard, SourceBadge)
  before the remaining sections are built.
- **Spec sections:**
  - Section Detail: 1. Hero, 2. How It Works
  - Reusable Component Architecture (SectionHeader, ExhibitImage, StepCard,
    StatCard, SourceBadge)
  - Design Foundations: Task 1 (Swiss Style), Task 2 (Cialdini — commitment/
    consistency, social proof), Task 3 (Sage voice)
  - Image and Media Policy (GIF handling, reduced motion fallback)
  - Content Data Model
- **Prerequisite:** Sprint 0 — Foundation Shell and Design Tokens
- **Expected test count:** `0 existing + 0 new = 0 total` (build, lint, and
  typecheck remain the primary gates; component tests may be added in Sprint 5)

## Available Assets

| Asset | Verified details | How this sprint uses it |
|-------|-----------------|------------------------|
| `public/assets/images/uranium_vs_fossil_fuels_diagram.png` | Visual Capitalist diagram comparing uranium pellet energy density to fossil fuels | Hero section primary visual — full-width, high-impact placement |
| `public/assets/images/nuclearplant.gif` | NEI animated GIF showing PWR reactor cycle (fission → steam → turbine → generator) | How It Works section primary visual — animated reactor process |
| `app/page.tsx` | Contains 7 placeholder `<section>` elements with correct anchor IDs (`#hero`, `#how-it-works`, etc.) | Replace the first two placeholder sections with full exhibit content |
| `app/globals.css` | All Swiss Style design tokens defined as CSS custom properties | All component styles reference these tokens — no hardcoded values |
| `lib/exhibit-data.ts` | Typed interfaces for `ExhibitSection`, `ProcessStep`, `StatCard`, `Source` and stub `exhibitData` | Populate with hero and how-it-works section data, process steps, stat cards, and source entries |
| `docs/_research/SOURCES.json` | Source entries with IDs: `uranium_vs_fossil_fuels_diagram`, `nuclearplant_animation`, `nrc_pwr_overview`, `doe_nuclear_101`, `iaea_science_of_nuclear_power` | Data source for source badge attributions and exhibit-data source entries |
| `components/site/site-header.tsx` | Sticky header with anchor links to all 7 sections | Already links to `#hero` and `#how-it-works`; no changes needed |
| `lib/utils.ts` | `cn()` utility for conditional classnames | Used by all new components |

## Tasks

### 1. Create the SourceBadge component

Create `components/ui/source-badge.tsx`. This is the smallest reusable
component and is needed by every other exhibit component in this sprint.

Required behavior:

- Renders a small inline label showing a source name (e.g., "Source: Visual
  Capitalist").
- Accepts props: `sourceName: string` and optionally `sourceUrl?: string`.
- If `sourceUrl` is provided, renders as an external link (`<a>`) with
  `rel="noopener noreferrer"` and `target="_blank"`.
- Styled at `--font-size-badge` (12 px), `--color-text-secondary` on light
  backgrounds, `--color-text-secondary-on-dark` on dark backgrounds. Accept
  a `variant` prop (`"light" | "dark"`) to control this.
- No border radius (Swiss style). Thin rule border using
  `--color-surface-rule` if desired, or plain text with a subtle background.

**Verify:**

```bash
npx tsc --noEmit
```

### 2. Create the SectionHeader component

Create `components/ui/section-header.tsx`. This component is the repeatable
header grammar for every exhibit section.

Required behavior:

- Accepts props: `eyebrow: string`, `sectionNumber?: number`,
  `title: string`, `lede?: string`, `id: string`,
  `variant?: "light" | "dark"`.
- Renders the eyebrow as a small label (`--font-size-caption`,
  `--color-text-secondary` or the section's accent color).
- Renders the title as an `<h2>` with `id` attribute (for
  `aria-labelledby` on the parent `<section>`). Styled at
  `--font-size-section`, weight 700.
- Renders the lede as a paragraph below the title at `--font-size-body`.
- On dark variant, text colors switch to `--color-text-on-dark` and
  `--color-text-secondary-on-dark`.

**Verify:**

```bash
npx tsc --noEmit
```

### 3. Create the ExhibitImage component

Create `components/ui/exhibit-image.tsx`. This component wraps images and
animations with captions and source attribution.

Required behavior:

- Accepts props: `src: string`, `alt: string`, `caption: string`,
  `sourceName: string`, `sourceUrl?: string`, `priority?: boolean`,
  `reducedMotionSrc?: string`.
- Uses `next/image` for static image rendering. Set `priority={true}` on
  the hero image for LCP optimization.
- Renders a `<figure>` with the image and a `<figcaption>` containing the
  caption text and a `SourceBadge`.
- When `reducedMotionSrc` is provided, implement the
  `prefers-reduced-motion` swap: show the static image instead of the
  animated GIF. Use a CSS media query approach or a React hook checking
  `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- Images render full-width within the grid column. On desktop, the hero
  image should render at a minimum width of 600 px.

**Verify:**

```bash
npx tsc --noEmit
```

### 4. Create the StepCard component

Create `components/ui/step-card.tsx`. Used for the 4-step reactor process
and later reused for the Fuel Cycle section.

Required behavior:

- Accepts props: `stepNumber: number`, `title: string`,
  `description: string`, `icon?: string`, `accentColor?: string`.
- Renders a card with the step number as a prominent numeral (use
  `accentColor` CSS custom property if provided, otherwise
  `--color-accent-blue`), the title in
  `--font-size-sub` weight 700, and the description in `--font-size-body`.
- Card surface uses `--color-bg-tertiary` with a thin `--color-surface-rule`
  border. No border-radius (Swiss style). No drop shadows.
- Cards should be arranged in a responsive grid: 4 columns on desktop
  (1200 px+), 2 columns on tablet (768–1199 px), 1 column on mobile
  (< 768 px).

**Verify:**

```bash
npx tsc --noEmit
```

### 5. Create the StatCard component

Create `components/ui/stat-card.tsx`. Used for global nuclear statistics in
the hero section and later reused in Benefits and Future Demand.

Required behavior:

- Accepts props: `value: string`, `label: string`, `context?: string`,
  `sourceId?: string`, `accentColor?: string`, `variant?: "light" | "dark"`.
- Renders the value as a large numeral (`--font-size-section`, weight 800,
  accent color). Use the `accentColor` prop (a CSS custom property name) if
  provided; otherwise fall back to `--color-accent-blue`.
- Renders the label below at `--font-size-body`.
- Renders optional context at `--font-size-caption`.
- On dark variant, colors switch to the on-dark palette.

**Verify:**

```bash
npx tsc --noEmit
```

### 6. Populate exhibit data for Hero and How It Works

Update `lib/exhibit-data.ts` to populate the hero and how-it-works sections
with real content from the spec.

Required data:

**Hero section data:**
- `id: "hero"`, `title: "The Power of Nuclear Energy"`,
  `eyebrow: "Exhibit Opening"`
- Lede: the hook question — "What if one fuel pellet could replace a ton
  of coal?"
- Body content: core thesis in Sage voice. Brief global scale statistics:
  440+ reactors, 32 countries, ~10% of global electricity.
- Source IDs: `["uranium_vs_fossil_fuels_diagram"]`
- Accent color: `--color-accent-cyan` (dark panel)
- Transition text: "To understand why that pellet is so powerful, you need
  to see what happens inside a reactor."

**Hero stat cards (3):**
- "440+" / "Operating Reactors" / "Worldwide"
- "32" / "Countries" / "With nuclear power programs"
- "~10%" / "Global Electricity" / "From nuclear sources"

**How It Works section data:**
- `id: "how-it-works"`, `title: "How a Reactor Makes Electricity"`,
  `eyebrow: "Inside the Reactor"`
- Lede: plain-language summary of the PWR process.
- Source IDs: `["nuclearplant_animation", "nrc_pwr_overview", "doe_nuclear_101"]`
- Accent color: `--color-accent-blue`
- Transition text: "Now that you see how the energy is made, here is how
  it compares with every other source."

**Process steps (4):**
1. "Fission → Heat" / "Uranium atoms split inside the reactor core,
   releasing tremendous thermal energy."
2. "Steam Generation" / "The heat boils water into high-pressure steam in
   the steam generator."
3. "Turbine & Generator" / "High-pressure steam spins the turbine, and the
   connected generator converts mechanical energy into electricity."
4. "Cooling & Recycling" / "Steam condenses back into water in the cooling
   system and returns to the steam generator to repeat the cycle."

**Source entries** (populate the `sources` array):
- All primary and supporting sources referenced by these two sections,
  pulled from SOURCES.json data.

**Verify:**

```bash
npx tsc --noEmit
```

### 7. Build the Hero section

Replace the hero placeholder in `app/page.tsx` with the full hero section
implementation.

Required structure (from spec):

- `<section id="hero" aria-labelledby="hero-title">` with dark background
  (`--color-bg-dark`).
- `SectionHeader` with eyebrow, title, and hook question lede. Dark variant.
- `ExhibitImage` with `uranium_vs_fossil_fuels_diagram.png`, descriptive
  alt text, caption, and Visual Capitalist source badge. Set `priority={true}`
  for LCP optimization.
- Three `StatCard` components showing global nuclear statistics (440+
  reactors, 32 countries, ~10% global electricity). Dark variant.
- Transition text bridging to the How It Works section.
- All content pulled from `lib/exhibit-data.ts`.

**Verify:**

```bash
npm run build
```

### 8. Build the How It Works section

Replace the how-it-works placeholder in `app/page.tsx` with the full
section implementation.

Required structure (from spec):

- `<section id="how-it-works" aria-labelledby="how-it-works-title">` with
  light background (`--color-bg-primary` or `--color-bg-secondary`).
- `SectionHeader` with eyebrow "Inside the Reactor", title, and lede.
- `ExhibitImage` with `nuclearplant.gif`, descriptive alt text explaining
  the animation shows a PWR reactor cycle, caption, and NEI source badge.
  Include `reducedMotionSrc` pointing to a static fallback image.
- Four `StepCard` components for the reactor process steps.
- Source badges for NEI, NRC, and DOE.
- Transition text bridging to the Benefits section.
- All content pulled from `lib/exhibit-data.ts`.

**GIF reduced-motion handling:** When `prefers-reduced-motion: reduce` is
active, replace the animated GIF with a static image. The simplest
approach is to create a static first-frame image during build or provide
a static poster image. If extracting a frame is not feasible in this
sprint, use the uranium pellet diagram as a temporary fallback and note
the deviation. The important behavior is that animation stops.

**Verify:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

### 9. Responsive layout verification

Verify both sections render correctly at all three spec breakpoints.

Checks:

- **1440 px (desktop):** Hero full-width dark panel, stat cards in a row,
  How It Works step cards in 4-column grid, images at ≥ 600 px width.
- **768 px (tablet):** Stat cards reflow to appropriate layout, step cards
  in 2-column grid, images scale proportionally.
- **390 px (mobile):** Single-column layout, stat cards stack, step cards
  stack, images full-width, all text readable.

**Verify:**

```bash
npm run build
npm run dev
```

Then visually inspect at 1440 px, 768 px, and 390 px in the browser.

## Completion Checklist

- [ ] `components/ui/source-badge.tsx` renders source attribution with external link safety
- [ ] `components/ui/section-header.tsx` renders eyebrow + title + lede with light/dark variants
- [ ] `components/ui/exhibit-image.tsx` renders images with captions, source badges, and reduced-motion support
- [ ] `components/ui/step-card.tsx` renders numbered process steps in a responsive grid
- [ ] `components/ui/stat-card.tsx` renders statistics with light/dark variants
- [ ] `lib/exhibit-data.ts` contains typed, populated data for hero and how-it-works sections
- [ ] Hero section renders with dark background, uranium pellet image, hook question, and 3 stat cards
- [ ] How It Works section renders with reactor animation, 4 step cards, and source badges
- [ ] Reactor GIF is replaced with a static fallback when `prefers-reduced-motion: reduce` is active
- [ ] Hero image has `priority={true}` for LCP optimization
- [ ] All images have descriptive `alt` attributes
- [ ] All source badges show correct attributions
- [ ] Transition text connects hero → how-it-works → (next section)
- [ ] No hardcoded color values — all colors trace to CSS custom property tokens
- [ ] Responsive layout verified at 1440 px, 768 px, and 390 px
- [ ] `npm run build` completes with exit code 0
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors

## QA Deviations

1. **How-It-Works accent color changed from `--color-accent-cyan` to
   `--color-accent-blue`.** The spec’s CSS Architecture assigns cyan to
   How It Works “(on dark panel)”, and the color token definition says
   “Do not use on light backgrounds — fails WCAG AA contrast against
   white and light-gray surfaces.” However, the spec’s light-first
   design principle limits dark panels to Hero and Timeline only. Since
   the How It Works section uses a light background
   (`--color-bg-primary` / `--color-bg-secondary`), cyan cannot be used
   as the accent without violating WCAG AA. Changed to
   `--color-accent-blue`, which passes 4.5:1 on all light surfaces and
   is already the spec’s nav-active indicator color. Cyan remains the
   accent for Hero and Timeline (both dark-panel sections).
