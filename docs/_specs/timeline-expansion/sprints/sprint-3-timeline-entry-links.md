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

**d. Wrap the year `<p>` and title `<h3>` in `<Link>` elements when `slug` is
provided.**

The existing component uses an `md:grid-cols-[120px_1fr]` grid where the year
`<p>` occupies the 120 px column and a `<div>` containing the title `<h3>` and
description `<p>` occupies the 1fr column. A single `<Link>` wrapping both year
and title would collapse both grid cells into one element, making the title
render inside the 120 px column. To preserve the exact layout, use **two
separate `<Link>` elements pointing to the same destination** — one around the
year, one around the title.

Each link must:

- Use Next.js `<Link href={\`/timeline/${slug}\`}>`.
- Apply `no-underline` by default.
- Apply `underline` on hover.
- Inherit the existing year/title text color from the parent element — do not
  add new color tokens.
- Have no `border-radius` (Swiss style).

Implement conditionally. When `slug` is defined:

```tsx
{/* Year numeral */}
{slug ? (
  <Link href={`/timeline/${slug}`} className="no-underline hover:underline">
    <p
      className={cn(
        "text-[length:var(--font-size-section)] font-extrabold leading-none md:text-right",
        isDark
          ? "text-[var(--color-accent-cyan)]"
          : "text-[var(--color-accent-blue)]",
      )}
    >
      {year}
    </p>
  </Link>
) : (
  <p
    className={cn(
      "text-[length:var(--font-size-section)] font-extrabold leading-none md:text-right",
      isDark
        ? "text-[var(--color-accent-cyan)]"
        : "text-[var(--color-accent-blue)]",
    )}
  >
    {year}
  </p>
)}

{/* Content */}
<div>
  {slug ? (
    <Link href={`/timeline/${slug}`} className="no-underline hover:underline">
      <h3
        className={cn(
          "text-[length:var(--font-size-sub)] font-bold leading-tight mb-[var(--space-2)]",
          isDark
            ? "text-[var(--color-text-on-dark)]"
            : "text-[var(--color-text-primary)]",
        )}
      >
        {title}
      </h3>
    </Link>
  ) : (
    <h3
      className={cn(
        "text-[length:var(--font-size-sub)] font-bold leading-tight mb-[var(--space-2)]",
        isDark
          ? "text-[var(--color-text-on-dark)]"
          : "text-[var(--color-text-primary)]",
      )}
    >
      {title}
    </h3>
  )}
  <p
    className={cn(
      "text-[length:var(--font-size-body)] leading-relaxed",
      isDark
        ? "text-[var(--color-text-secondary-on-dark)]"
        : "text-[var(--color-text-secondary)]",
    )}
  >
    {description}
  </p>
</div>
```

> **Why two links instead of one?** The existing grid requires the year `<p>`
> to be a direct grid child in the 120 px column and the title `<h3>` to remain
> inside the content `<div>` in the 1fr column. A single `<Link>` wrapping
> both would collapse them into one grid cell, breaking the layout. Two links
> to the same destination is a well-established card-linking pattern.

> **Backwards compatibility:** when `slug` is not provided, the component
> renders identically to its current implementation — the year `<p>` and
> title `<h3>` appear as plain text. This satisfies the spec requirement:
> "When slug is not provided, the component behaves identically to its current
> implementation."

> **Layout:** no spacing or layout changes are introduced. The `description`
> `<p>` remains inside the content `<div>` and unchanged.

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
- [ ] Year `<p>` wrapped in `<Link href={\`/timeline/${slug}\`}>` when `slug` is defined; renders as plain `<p>` when `slug` is not provided
- [ ] Title `<h3>` wrapped in `<Link href={\`/timeline/${slug}\`}>` when `slug` is defined; renders as plain `<h3>` when `slug` is not provided
- [ ] Each link has no underline by default; underline on hover
- [ ] Each link inherits existing color tokens — no new color values introduced
- [ ] No `border-radius` on either link wrapper
- [ ] Both links point to the same `/timeline/${slug}` destination (same-destination two-link pattern)
- [ ] Existing grid structure preserved — year `<p>` remains in the 120 px column; title `<h3>` remains inside the content `<div>` in the 1fr column
- [ ] When `slug` is not provided, the component renders identically to its pre-Sprint-3 state (backwards-compatible)
- [ ] `description` `<p>` remains inside the content `<div>` and is unchanged
- [ ] No layout or spacing changes
- [ ] `app/page.tsx` passes `slug={entry.slug}` to each `<TimelineEntry>` in the timeline map
- [ ] No other changes made to `app/page.tsx`
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run lint` reports zero errors
- [ ] `npm run build` exits with code 0
