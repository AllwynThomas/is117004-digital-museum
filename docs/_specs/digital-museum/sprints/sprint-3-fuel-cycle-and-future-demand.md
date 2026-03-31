# Sprint 3 — Fuel Cycle and Future Demand Sections

## Header

- **Goal:** build the lifecycle room (Fuel Cycle) and the forward-looking room
  (Future Demand). The Fuel Cycle section completes the technical education arc
  by showing the full uranium-to-electricity journey. The Future Demand section
  creates urgency by connecting nuclear to AI data center power needs and SMR
  technology.
- **Spec sections:**
  - Section Detail: 5. Fuel Cycle, 6. Future Demand
  - CSS Architecture: section theming (amber for Fuel Cycle, blue for Future
    Demand)
  - Design Foundations: Task 2 (Cialdini — scarcity/urgency), Task 3 (Sage
    voice — avoids fear-mongering, frames as opportunity)
  - Content Data Model
- **Prerequisite:** Sprint 2 — Benefits and Safety Sections
- **Expected test count:** `0 existing + 0 new = 0 total` (build, lint, and
  typecheck remain the primary gates)

## Available Assets

| Asset | Verified details | How this sprint uses it |
|-------|-----------------|------------------------|
| `components/ui/section-header.tsx` | Renders eyebrow + title + lede with light/dark variants | Reused for both section headers |
| `components/ui/step-card.tsx` | Renders numbered process steps in responsive grid — proven in How It Works | Reused for the 5-step fuel cycle process |
| `components/ui/stat-card.tsx` | Renders statistics with value, label, context — proven in Hero and Benefits | Reused for Future Demand stat cards |
| `components/ui/source-badge.tsx` | Renders source attributions | Reused on all data displays |
| `lib/exhibit-data.ts` | Contains hero, how-it-works, benefits, and safety section data | Extend with fuel-cycle and future-demand data |
| `docs/_research/SOURCES.json` | Source entries: `eia_nuclear_fuel_cycle`, `iaea_science_of_nuclear_power`, `eia_nuclear_explained`, `deloitte_data_center_nuclear`, `doe_smr_overview` | Data source for attributions in these sections |
| `app/page.tsx` | Contains placeholder sections for `#fuel-cycle` and `#future-demand` | Replace placeholders with full exhibit content |

## Tasks

### 1. Populate exhibit data for Fuel Cycle and Future Demand

Update `lib/exhibit-data.ts` with real content for both sections.

**Fuel Cycle section data:**
- `id: "fuel-cycle"`, `title: "From Uranium to Electricity"`,
  `eyebrow: "The Full Journey"`
- Lede: Sage-voice introduction to the nuclear fuel lifecycle.
- Body content: explanation that demystifies each step — emphasize this is
  a carefully regulated industrial process at every stage.
- Source IDs: `["eia_nuclear_fuel_cycle", "iaea_science_of_nuclear_power", "eia_nuclear_explained", "nrc_spent_fuel_storage"]`
- Accent color: `--color-accent-amber`
- Transition: "With this lifecycle in view, the question becomes: where is
  nuclear energy headed next?"

**Fuel Cycle process steps (5):**
1. "Mining & Milling" / "Uranium ore is extracted from the earth and
   processed into uranium oxide concentrate, known as yellowcake."
2. "Conversion & Enrichment" / "Yellowcake is converted to uranium
   hexafluoride gas and enriched to increase the concentration of
   fissile U-235 from about 0.7% to 3–5%."
3. "Fuel Fabrication" / "Enriched uranium is formed into small ceramic
   pellets, stacked into metal fuel rods, and assembled into fuel bundles
   ready for the reactor."
4. "Reactor Operation" / "Fuel assemblies are loaded into the reactor
   core, where controlled fission generates heat that produces
   electricity through the steam-turbine cycle."
5. "Storage & Disposal" / "Spent fuel is first cooled in water pools at
   the reactor site, then transferred to dry cask storage — robust
   concrete and steel containers designed for decades of safe
   containment."

**Future Demand section data:**
- `id: "future-demand"`, `title: "Powering AI and the Future Grid"`,
  `eyebrow: "Looking Ahead"`
- Lede: Sage-voice framing of nuclear as an answer to escalating
  electricity demand.
- Body content: AI data centers as the new demand driver. Real numbers
  from Deloitte analysis. SMR technology as the next-generation solution.
  Frame as opportunity, not crisis.
- Source IDs: `["deloitte_data_center_nuclear", "doe_smr_overview", "iaea_smart_stable_reliable"]`
- Accent color: `--color-accent-blue`
- Transition: "Nuclear power is not new. It has been growing for eight
  decades. Here is how it became a global energy source."

**Future Demand stat cards (3):**
1. "~30%" / "Annual Growth" / "Data center power demand is increasing
   at roughly 30% per year" / Source: Deloitte
2. "24/7" / "Carbon-Free Power" / "Data centers require round-the-clock,
   high-density, low-carbon electricity — precisely the profile nuclear
   delivers" / Source: Deloitte
3. "SMRs" / "Small Modular Reactors" / "Flexible, scalable, factory-built
   reactors designed for incremental capacity additions. Deployed near
   demand centers." / Source: DOE

**Additional source entries** as needed.

**Verify:**

```bash
npx tsc --noEmit
```

### 2. Build the Fuel Cycle section

Replace the fuel-cycle placeholder in `app/page.tsx` with the full section.

Required structure (from spec):

- `<section id="fuel-cycle" aria-labelledby="fuel-cycle-title">` with
  light background (`--color-bg-secondary` or `--color-bg-primary`).
- `SectionHeader` with eyebrow "The Full Journey", title, and lede.
- Five `StepCard` components arranged as a process flow. The step cards
  are the same component proven in How It Works — this confirms reusability.
- On desktop, consider a visually distinct arrangement (e.g., a vertical
  flow or 3+2 grid) to differentiate from the How It Works 4-card grid
  while using the same component.
- Amber accent (`--color-accent-amber`) for step numbers and highlights.
- Source badges: EIA, IAEA, NRC.
- Transition text bridging to Future Demand.
- All content pulled from `lib/exhibit-data.ts`.

**Verify:**

```bash
npm run build
```

### 3. Build the Future Demand section

Replace the future-demand placeholder in `app/page.tsx` with the full
section.

Required structure (from spec):

- `<section id="future-demand" aria-labelledby="future-demand-title">`
  with light background.
- `SectionHeader` with eyebrow "Looking Ahead", title, and lede.
- Body text framing AI data centers as the demand driver, with real
  growth projections from Deloitte: data center power consumption
  growing ~30% annually, potential to consume 8% of U.S. electricity
  by 2030.
- Three `StatCard` components for the key forward-looking statistics.
- SMR context: brief explanation of Small Modular Reactors as
  next-generation technology — flexible, scalable, factory-built.
- Blue accent (`--color-accent-blue`) for data highlights and card values.
- Source badges: Deloitte, DOE.
- Transition text bridging to the Timeline section.
- All content pulled from `lib/exhibit-data.ts`.

**Copy review checkpoint:** Sage voice — frame urgency through factual
demand projections, not fear. "Data center power demand is growing at
~30% per year" is factual urgency. "If we don't build nuclear, we're
doomed" is fear language — avoid.

**Verify:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

### 4. Component reuse confirmation

This sprint validates that `StepCard` and `StatCard` are genuinely
reusable:

- `StepCard` used in How It Works (4 steps) and Fuel Cycle (5 steps)
  without component modification.
- `StatCard` used in Hero (3 cards), Benefits (4 cards), and Future
  Demand (3 cards) without component modification.

If either component required modification to support these new sections,
document the changes and update the component's interface contract.

**Verify:**

```bash
npx tsc --noEmit
```

### 5. Responsive layout verification

Verify both sections render correctly at all three breakpoints.

- **1440 px (desktop):** Fuel Cycle step cards in readable flow layout,
  Future Demand stat cards in row.
- **768 px (tablet):** Step cards and stat cards reflow to appropriate
  tablet layout.
- **390 px (mobile):** Single-column stacking for all cards.

**Verify:**

```bash
npm run build
npm run dev
```

Visual inspection at 1440 px, 768 px, and 390 px.

## Completion Checklist

- [ ] `lib/exhibit-data.ts` contains typed, populated data for fuel-cycle and future-demand sections
- [ ] Fuel Cycle section renders with 5 process step cards and amber accent
- [ ] Future Demand section renders with 3 stat cards and blue accent
- [ ] Future Demand cites at least two dated projections (growth rate, year-target) from Deloitte or DOE
- [ ] SMR context is present in the Future Demand section
- [ ] `StepCard` reused without modification from Sprint 1
- [ ] `StatCard` reused without modification from Sprint 1
- [ ] All source badges show correct attributions (EIA, IAEA, DOE, Deloitte)
- [ ] Transition text connects fuel-cycle → future-demand → (next section)
- [ ] All copy reviewed against Sage voice guidelines — no fear language, no unsourced claims
- [ ] Section accent colors correctly applied (amber for Fuel Cycle, blue for Future Demand)
- [ ] No hardcoded color values in new code
- [ ] Responsive layout verified at 1440 px, 768 px, and 390 px
- [ ] `npm run build` completes with exit code 0
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors

## QA Deviations

None.
