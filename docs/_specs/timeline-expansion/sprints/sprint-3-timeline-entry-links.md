# Sprint 3 — TimelineEntry Links and Main Page Update

## Header

- **Goal:** modify `components/ui/timeline-entry.tsx` to accept an optional
  `slug` prop and link the year and title to the corresponding event detail
  page when the prop is provided; then update `app/page.tsx` to pass
  `slug={entry.slug}` to each `TimelineEntry` in the timeline section map.
  After this sprint, every timeline card on the main exhibit page links to
  its individual event detail page.
- **Spec sections:**
  - Component Specifications (`components/ui/timeline-entry.tsx` — modified)
  - Architecture: Modified Files (`app/page.tsx`)
  - Design Foundations (no border-radius, link inherits existing color tokens)
  - Security Considerations (no inline event handlers; use `<Link>`)
- **Prerequisite:** Sprint 2 — EventNav Component and Event Detail Page
- **Expected test count:** `25 existing + 0 new = 25 total` (build, lint, and
  typecheck are the verification gates for this sprint)

## Available Assets

| Asset                                    | Verified details                                                                                                               | How this sprint uses it                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `components/ui/timeline-entry.tsx`       | Renders year `<p>` and title `<h3>` + description `<p>`; accepts `year`, `title`, `description`, `variant`, `className` props | Extended with optional `slug?: string` prop; year and title wrapped in `<Link>` when slug present |
| `app/page.tsx`                           | Maps over `exhibitData.timelineEntries` passing `year`, `title`, `description` to `<TimelineEntry>`                           | Updated to also pass `slug={entry.slug}` on each `<TimelineEntry>` in the map                |
| `lib/exhibit-data.ts`                    | `TimelineEntry` now includes `slug: string` (added in Sprint 1)                                                                | Source of `slug` values passed through `app/page.tsx` down to the component                  |
| `app/globals.css`                        | CSS custom properties for color, font, and spacing tokens                                                                      | Link styles on dark background use existing year/title tokens — no new tokens introduced     |
| `docs/_specs/timeline-expansion/spec.md` | Component Specifications section for `timeline-entry.tsx`                                                                      | Source of truth for link behavior, style rules, and backwards-compatibility requirement      |

## Tasks

### 1. Add the `slug` prop to `TimelineEntry`

Open `components/ui/timeline-entry.tsx` and make the following changes:

**a. Add `import Link from "next/link";` at the top of the file.**

**b. Add `slug?: string` to the `TimelineEntryProps` interface:**

```ts
interface TimelineEntryProps {
  year: number | string;
  title: string;
  description: string;
  badge?: string;
  variant?: "light" | "dark";
  className?: string;
  slug?: string;   // new — URL-safe identifier for /timeline/[slug]
}
```

**c. Destructure `slug` in the function signature:**

```ts
export function TimelineEntry({
  year,
  title,
  description,
  variant = "dark",
  className,
  slug,      // new
}: TimelineEntryProps) {
```

**d. Wrap the year `<p>` and title `<h3>` in a `<Link>` when `slug` is
provided.**

The spec requires both the year numeral and the event title to be wrapped
together in a single link. The link must:

- Use Next.js `<Link href={\`/timeline/${slug}\`}>`.
- Apply `no-underline` by default on the dark background.
- Apply `underline` on hover.
- Inherit the existing year/title text color from the parent element — do not
  add new color tokens.
- Have no `border-radius` (Swiss style).

Implement this as a conditional wrapper. When `slug` is defined, wrap:

```tsx
{slug ? (
  <Link
    href={`/timeline/${slug}`}
    className="group no-underline"
  >
    {/* year numeral */}
    <p className={cn("... existing year classes ...", "group-hover:underline")}>
      {year}
    </p>
    {/* title heading */}
    <h3 className={cn("... existing title classes ...", "group-hover:underline")}>
      {title}
    </h3>
  </Link>
) : (
  <>
    {/* year numeral — existing, unchanged */}
    <p className="... existing year classes ...">{year}</p>
    {/* title heading — existing, unchanged */}
    <h3 className="... existing title classes ...">{title}</h3>
  </>
)}
```

> **Backwards compatibility:** when `slug` is not provided, the component
> renders identically to its current implementation — the year `<p>` and
> title `<h3>` appear as plain text. This satisfies the spec requirement:
> "When slug is not provided, the component behaves identically to its current
> implementation."

> **Layout:** no spacing or layout changes are introduced beyond the link
> wrapper itself. The `description` `<p>` remains outside the link and
> unchanged.

**Verify:**

```bash
npx tsc --noEmit
```

---

### 2. Update `app/page.tsx` to pass `slug`

Open `app/page.tsx` and locate the `timelineEntries.map` call in the timeline
section. It currently renders:

```tsx
{timelineEntries.map((entry) => (
  <TimelineEntry
    key={String(entry.year)}
    year={entry.year}
    title={entry.title}
    description={entry.description}
    variant="dark"
  />
))}
```

Add the `slug` prop:

```tsx
{timelineEntries.map((entry) => (
  <TimelineEntry
    key={String(entry.year)}
    year={entry.year}
    title={entry.title}
    description={entry.description}
    variant="dark"
    slug={entry.slug}
  />
))}
```

No other changes to `app/page.tsx` are needed in this sprint. Do not
restructure, reformat, or modify any other part of the file.

**Verify:**

```bash
npx tsc --noEmit
```

---

### 3. Final verification

Run all code quality gates and confirm the build succeeds:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected outcomes:
- TypeScript: zero errors
- Lint: zero errors
- Build: exits with code 0
- All 7 timeline entries on the main page (`/`) now wrap their year and
  title in a link to `/timeline/[slug]`
- The `description` paragraph in each `TimelineEntry` is plain text (not
  a link) and unchanged from the original

## Completion Checklist

- [ ] `import Link from "next/link"` added to `components/ui/timeline-entry.tsx`
- [ ] `slug?: string` added to `TimelineEntryProps` interface
- [ ] `slug` destructured in `TimelineEntry` function signature
- [ ] Year `<p>` and title `<h3>` wrapped in `<Link href={\`/timeline/${slug}\`}>` when `slug` is defined
- [ ] Link has no underline by default; underline on hover
- [ ] Link inherits existing color tokens — no new color values introduced
- [ ] No `border-radius` on the link wrapper
- [ ] When `slug` is not provided, the component renders identically to its pre-Sprint-3 state (backwards-compatible)
- [ ] `description` `<p>` remains outside the link and is unchanged
- [ ] No layout or spacing changes beyond the link wrapper
- [ ] `app/page.tsx` passes `slug={entry.slug}` to each `<TimelineEntry>` in the timeline map
- [ ] No other changes made to `app/page.tsx`
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run lint` reports zero errors
- [ ] `npm run build` exits with code 0
