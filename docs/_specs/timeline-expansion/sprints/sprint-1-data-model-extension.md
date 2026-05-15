# Sprint 1 — Data Model Extension

## Header

- **Goal:** extend `lib/exhibit-data.ts` with the `TimelineStat` interface and
  three new fields on `TimelineEntry` (`slug`, `imageAlt`, `stats`), then
  populate all 7 existing timeline entries with the values specified in the
  Event Data Table. No new routes or components are created in this sprint —
  only the data layer is changed.
- **Spec sections:**
  - Data Model
  - Static Generation (slug conventions)
  - Security Considerations (stat card source traceability)
- **Prerequisite:** Sprint 5 — QA, Accessibility, and Polish (parent spec)
- **Expected test count:** `25 existing + 0 new = 25 total` (build, lint, and
  typecheck are the verification gates for this sprint)

## Available Assets

| Asset                                       | Verified details                                                                                            | How this sprint uses it                                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `lib/exhibit-data.ts`                       | Contains `TimelineEntry[]` with 7 populated entries; `Source[]` with all cited sources                     | Extended with `TimelineStat` interface and `slug`, `imageAlt`, `stats` fields            |
| `docs/_research/SOURCES.json`               | All source entries with `id`, `sourceUrl`, `title`                                                          | Verify that every `stats[].sourceId` matches an existing entry `id`                      |
| `docs/_specs/timeline-expansion/spec.md`    | Event Data Table (all 7 slugs, imageAlts, and stats); Slug Conventions section; `TimelineStat` interface   | Source of truth for every value populated in this sprint                                 |

## Tasks

### 1. Define the `TimelineStat` interface

In `lib/exhibit-data.ts`, add the `TimelineStat` interface immediately before
the `TimelineEntry` interface:

```ts
export interface TimelineStat {
  value: string;
  label: string;
  sourceId: string;
}
```

`TimelineStat` intentionally omits the `context` field that `StatCard` has —
event pages are structured to be lean rather than verbose.

**Verify:**

```bash
npx tsc --noEmit
```

---

### 2. Extend the `TimelineEntry` interface

Add three new required fields to the `TimelineEntry` interface:

```ts
export interface TimelineEntry {
  year: number | string;    // existing
  title: string;            // existing
  description: string;      // existing
  sourceIds: string[];      // existing
  slug: string;             // new — URL-safe identifier for /timeline/[slug]
  imageAlt: string;         // new — descriptive text for the image placeholder
  stats: TimelineStat[];    // new — 2–3 data-backed statistics for the detail page
}
```

Because these fields are added as required (not optional), TypeScript will
immediately report errors on all 7 existing entries. That is expected — the
next task resolves every error.

**Verify:**

```bash
npx tsc --noEmit
# Expected: errors on all 7 entries (will be resolved in Task 3)
```

---

### 3. Populate all 7 timeline entries

Update every entry in `exhibitData.timelineEntries` to include `slug`,
`imageAlt`, and `stats`. Use the Event Data Table from the spec as the source
of truth. Entries are listed below in chronological order.

**Entry 1 — Chicago Pile-1 (1942)**

```ts
slug: "chicago-pile-1",
imageAlt: "Photograph of Chicago Pile-1 under construction at Stagg Field, University of Chicago, 1942",
stats: [
  { value: "200 W", label: "Peak Power Output", sourceId: "iaea_nuclear_power_topic" }, // verify
  { value: "45", label: "Team Members", sourceId: "iaea_nuclear_power_topic" }, // verify
  { value: "Dec 2, 1942", label: "Date of First Criticality", sourceId: "iaea_nuclear_power_topic" },
],
```

**Entry 2 — Obninsk, USSR (1954)**

```ts
slug: "obninsk-ussr",
imageAlt: "Interior of the Obninsk Nuclear Power Plant reactor hall, USSR",
stats: [
  { value: "5 MW", label: "Reactor Capacity", sourceId: "iaea_nuclear_power_topic" },
  { value: "1954", label: "Year First Grid-Connected", sourceId: "iaea_nuclear_power_topic" },
  { value: "48 years", label: "Years in Operation", sourceId: "iaea_nuclear_power_topic" }, // verify
],
```

**Entry 3 — Shippingport, Pennsylvania (1957)**

```ts
slug: "shippingport",
imageAlt: "Aerial photograph of Shippingport Atomic Power Station, Pennsylvania",
stats: [
  { value: "60 MW", label: "Plant Capacity", sourceId: "iaea_nuclear_power_topic" }, // verify
  { value: "1958", label: "Year Commercial Operations Began", sourceId: "iaea_nuclear_power_topic" }, // verify
  { value: "25 years", label: "Years of Operation", sourceId: "iaea_nuclear_power_topic" },
],
```

**Entry 4 — Three Mile Island (1979)**

```ts
slug: "three-mile-island",
imageAlt: "Aerial view of Three Mile Island cooling towers, Dauphin County, Pennsylvania",
stats: [
  { value: "0", label: "Radiation Deaths", sourceId: "ourworldindata_chernobyl_fukushima" },
  { value: "14 years", label: "Duration of Cleanup", sourceId: "ourworldindata_chernobyl_fukushima" }, // verify
  { value: "1979", label: "Year Safety Reforms Enacted", sourceId: "ourworldindata_chernobyl_fukushima" },
],
```

**Entry 5 — Chernobyl (1986)**

```ts
slug: "chernobyl",
imageAlt: "Chernobyl Reactor 4 New Safe Confinement structure, Chornobyl Exclusion Zone",
stats: [
  { value: "31", label: "Acute Deaths (WHO)", sourceId: "ourworldindata_chernobyl_fukushima" },
  { value: "~4,000", label: "Long-Term Projected Deaths (WHO)", sourceId: "ourworldindata_chernobyl_fukushima" },
  { value: "600,000+", label: "Emergency Workers and Evacuees Affected", sourceId: "ourworldindata_chernobyl_fukushima" },
],
```

**Entry 6 — Fukushima Daiichi (2011)**

```ts
slug: "fukushima-daiichi",
imageAlt: "Aerial view of Fukushima Daiichi nuclear power plant following the March 2011 tsunami",
stats: [
  { value: "0", label: "Confirmed Radiation Deaths", sourceId: "ourworldindata_chernobyl_fukushima" },
  { value: "3", label: "Reactors Affected", sourceId: "ourworldindata_chernobyl_fukushima" },
  { value: "154,000", label: "People Evacuated", sourceId: "ourworldindata_chernobyl_fukushima" }, // verify
],
```

**Entry 7 — Nuclear Renaissance (2020s)**

```ts
slug: "nuclear-renaissance",
imageAlt: "Conceptual rendering of a Small Modular Reactor facility",
stats: [
  { value: "6+", label: "SMRs in NRC Licensing Pipeline", sourceId: "doe_smr_overview" },
  { value: "~30%", label: "Annual Data Center Power Demand Growth", sourceId: "deloitte_data_center_nuclear" },
  { value: "3×", label: "Global Capacity Target by 2050", sourceId: "iaea_nuclear_power_topic" }, // verify
],
```

> **`// verify` comments:** Stats marked `// verify` require confirming the
> exact figure against the cited source URL before publication. If a figure
> cannot be confirmed, replace it with a verifiable figure from the same source
> or remove that stat card entirely. The `// verify` comments must be removed
> once the stat is confirmed. They must not be present in the production
> codebase.

**Verify:**

```bash
npx tsc --noEmit
# Expected: zero errors — all 7 entries now satisfy the extended interface
```

---

### 4. Verify source traceability (manual audit)

Open `docs/_research/SOURCES.json` (or `lib/exhibit-data.ts`'s `sources`
array) and confirm that every `sourceId` used in any `stats` entry matches
an existing `id` in `exhibitData.sources`.

Required IDs used across the 7 entries:
- `iaea_nuclear_power_topic`
- `ourworldindata_chernobyl_fukushima`
- `doe_smr_overview`
- `deloitte_data_center_nuclear`

All four must be present in `exhibitData.sources`. If any are missing, add
them from `docs/_research/SOURCES.json` before continuing.

---

### 5. Final verification

Run all code quality gates:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected outcomes:
- TypeScript: zero errors
- Lint: zero errors
- Build: exits with code 0 (the new `slug`, `imageAlt`, and `stats` fields
  are currently unused by routes or components, but the build must still pass)

## Completion Checklist

- [ ] `TimelineStat` interface defined and exported from `lib/exhibit-data.ts`
- [ ] `TimelineEntry` extended with `slug: string`, `imageAlt: string`, `stats: TimelineStat[]`
- [ ] All 7 entries populated with correct slugs from the Event Data Table
- [ ] All 7 entries populated with correct `imageAlt` values from the Event Data Table
- [ ] Every entry has exactly 2 or 3 stats (no entry has 0 or 1)
- [ ] All `stats[].sourceId` values match an existing `id` in `exhibitData.sources`
- [ ] `// verify` comments present on stats requiring source confirmation (not yet removed)
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run lint` reports zero errors
- [ ] `npm run build` exits with code 0
