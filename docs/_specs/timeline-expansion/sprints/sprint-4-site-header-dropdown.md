# Sprint 4 — SiteHeader Timeline Dropdown and Mobile Sub-list

## Header

- **Goal:** update `components/site/site-header.tsx` to replace the flat
  "Timeline" nav link with a keyboard-accessible dropdown (desktop) and an
  inline expandable sub-list (mobile). After this sprint, visitors can jump
  directly to any of the 7 event detail pages from the top navigation bar,
  both on desktop and mobile.
- **Spec sections:**
  - Navigation Dropdown Specification (Desktop Dropdown, Mobile Sub-List)
  - Component Specifications (`components/site/site-header.tsx` — modified)
  - Architecture: Modified Files
  - Security Considerations (no inline event handlers; use React event props)
  - Acceptance Criteria #4 (keyboard accessibility)
- **Prerequisite:** Sprint 3 — TimelineEntry Links and Main Page Update
- **Expected test count:** `25 existing + 0 new = 25 total` (build and lint
  are the verification gates; keyboard behavior is verified in Sprint 5)

## Available Assets

| Asset                                    | Verified details                                                                                                                     | How this sprint uses it                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `components/site/site-header.tsx`        | `"use client"` component; `NAV_SECTIONS` const; `isMobileMenuOpen` state; `closeMobileMenu()` callback; Intersection Observer scroll tracking | Modified to add two new state variables and the Timeline dropdown/sub-list UI                               |
| `lib/exhibit-data.ts`                    | `exhibitData.timelineEntries` — 7 entries, each with `year`, `title`, `slug`                                                         | Event links in the dropdown and mobile sub-list are derived from this array — not hardcoded                  |
| `app/globals.css`                        | CSS custom properties for `--color-bg-primary`, `--color-surface-rule`, `--color-accent-blue`, `--color-text-primary/secondary`, spacing tokens | All dropdown/sub-list styles use CSS custom properties — no hardcoded values                                 |
| `docs/_specs/timeline-expansion/spec.md` | Navigation Dropdown Specification (panel structure, styling table, trigger behavior table, ARIA requirements, WAI-ARIA keyboard pattern) | Source of truth for every behavioral and visual detail in this sprint                                        |

## Tasks

### 1. Add new state variables

At the top of `SiteHeader`, alongside the existing `isMobileMenuOpen` and
`activeSection` state, add two new state variables:

```ts
const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState(false);
const [isTimelineMobileExpanded, setIsTimelineMobileExpanded] = useState(false);
```

**Update `closeMobileMenu`** to reset both mobile states:

```ts
const closeMobileMenu = useCallback(() => {
  setIsMobileMenuOpen(false);
  setIsTimelineMobileExpanded(false);  // new — spec requires this reset
}, []);
```

**Verify:**

```bash
npx tsc --noEmit
```

---

### 2. Add a trigger ref for keyboard focus return

Add a ref for the Timeline trigger button so focus can be returned to it when
the dropdown is closed by Escape:

```ts
import { useEffect, useState, useCallback, useRef } from "react";

const timelineTriggerRef = useRef<HTMLButtonElement>(null);
```

---

### 3. Add the click-outside handler for the desktop dropdown

Add a `useEffect` that attaches a `mousedown` listener to `document` when
`isTimelineDropdownOpen` is `true`, and removes it on cleanup:

```ts
useEffect(() => {
  if (!isTimelineDropdownOpen) return;

  const handleClickOutside = (e: MouseEvent) => {
    if (
      timelineTriggerRef.current &&
      !timelineTriggerRef.current.closest("[data-timeline-container]")?.contains(e.target as Node)
    ) {
      setIsTimelineDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isTimelineDropdownOpen]);
```

> **Implementation note:** the wrapper `<div>` added in Task 4 must carry
> `data-timeline-container` as a data attribute so the click-outside check can
> locate the container boundary. This is the same `position: relative` div
> that holds the trigger button and dropdown panel.

**Verify:**

```bash
npx tsc --noEmit
```

---

### 4. Replace the Timeline nav link with the dropdown composite (desktop)

In the desktop `<nav>` block, the "Timeline" entry in the `NAV_SECTIONS.map`
is currently rendered as a `<Link>`. Replace the Timeline entry's rendering
with a composite that is outside the `NAV_SECTIONS.map` loop — or handle it
as a conditional inside the map — so that the "Timeline" item becomes a
`<button>`-triggered dropdown.

The recommended approach is to render the Timeline dropdown as a separate
element after the `NAV_SECTIONS.map`, or to break the map and render the
Timeline item separately. Either is acceptable as long as the `NAV_SECTIONS`
const itself is **not modified**.

**Trigger container:**

```tsx
<div
  className="relative"
  data-timeline-container
  onMouseEnter={() => setIsTimelineDropdownOpen(true)}
  onMouseLeave={() => setIsTimelineDropdownOpen(false)}
>
  {/* Trigger button */}
  <button
    ref={timelineTriggerRef}
    type="button"
    aria-haspopup="menu"
    aria-expanded={isTimelineDropdownOpen ? "true" : "false"}
    onFocus={() => setIsTimelineDropdownOpen(true)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsTimelineDropdownOpen((prev) => !prev);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsTimelineDropdownOpen(true);
        // Focus the first menu item after the state update triggers a re-render
        setTimeout(() => {
          const panel = timelineTriggerRef.current
            ?.closest("[data-timeline-container]")
            ?.querySelector<HTMLElement>('[role="menuitem"]');
          panel?.focus();
        }, 0);
      }
      if (e.key === "Escape") {
        setIsTimelineDropdownOpen(false);
      }
      if (e.key === "Tab") {
        setIsTimelineDropdownOpen(false);
      }
    }}
    className={cn(
      "no-underline rounded px-2.5 py-2 transition-colors lg:px-3.5",
      "bg-transparent border-none cursor-pointer",
      "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
      activeSection === "timeline" && "text-[var(--color-accent-blue)] font-semibold",
    )}
    style={{ fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)", lineHeight: 1.25 }}
  >
    Timeline
  </button>

  {/* Dropdown panel */}
  {isTimelineDropdownOpen && (
    <div
      role="menu"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        minWidth: "240px",
        zIndex: 50,
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-surface-rule)",
        borderRadius: 0,
      }}
      onKeyDown={(e) => {
        // WAI-ARIA Menu Button keyboard pattern — implemented below in Task 5
      }}
    >
      {/* Panel contents — implemented in Task 5 */}
    </div>
  )}
</div>
```

**Verify:**

```bash
npx tsc --noEmit
```

---

### 5. Populate the dropdown panel with links and keyboard navigation

Inside the dropdown panel `<div role="menu">`, render:

1. **"Timeline Overview" link** (first item, always present):
   ```tsx
   <Link
     role="menuitem"
     href="/#timeline"
     onClick={() => setIsTimelineDropdownOpen(false)}
     style={{
       display: "block",
       padding: "var(--space-2) var(--space-4)",
       fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)",
       fontWeight: 700,
       color: "var(--color-accent-blue)",
       textDecoration: "none",
       borderBottom: "1px solid var(--color-surface-rule)",
     }}
   >
     Timeline Overview
   </Link>
   ```

2. **Event links** — derived from `exhibitData.timelineEntries`, not
   hardcoded:
   ```tsx
   {exhibitData.timelineEntries.map((entry) => (
     <Link
       key={entry.slug}
       role="menuitem"
       href={`/timeline/${entry.slug}`}
       onClick={() => setIsTimelineDropdownOpen(false)}
       className="block no-underline hover:underline"
       style={{
         display: "block",
         padding: "var(--space-2) var(--space-4)",
         fontSize: "clamp(13px, 0.3vw + 11.5px, 15px)",
         color: "var(--color-text-primary)",
         textDecoration: "none",
       }}
     >
       {entry.year} — {entry.title}
     </Link>
   ))}
   ```

**WAI-ARIA Menu Button keyboard pattern:**

Implement the full keyboard pattern on the panel's `onKeyDown` handler.
The spec requires these keys to work:

| Key          | Effect                                                                   |
| ------------ | ------------------------------------------------------------------------ |
| `↓` ArrowDown | Move focus to next menu item; wrap from last to first                  |
| `↑` ArrowUp   | Move focus to previous menu item; wrap from first to last              |
| `Home`        | Move focus to first menu item                                          |
| `End`         | Move focus to last menu item                                           |
| `Enter`/`Space` | Activate the focused menu item link                                 |
| `Escape`      | Close the menu; return focus to the trigger button                     |
| `Tab`         | Close the menu; let focus move naturally to next page element          |

Implementation approach — query all `[role="menuitem"]` elements inside the
panel and manage focus programmatically:

```ts
const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const items = Array.from(
    e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')
  );
  const focused = document.activeElement as HTMLElement;
  const currentIndex = items.indexOf(focused);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = (currentIndex + 1) % items.length;
    items[next]?.focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = (currentIndex - 1 + items.length) % items.length;
    items[prev]?.focus();
  } else if (e.key === "Home") {
    e.preventDefault();
    items[0]?.focus();
  } else if (e.key === "End") {
    e.preventDefault();
    items[items.length - 1]?.focus();
  } else if (e.key === "Escape") {
    setIsTimelineDropdownOpen(false);
    timelineTriggerRef.current?.focus();
  } else if (e.key === "Tab") {
    setIsTimelineDropdownOpen(false);
    // Do not call e.preventDefault() — allow natural Tab behavior
  }
};
```

Place `onKeyDown={handleMenuKeyDown}` on the panel `<div role="menu">`.

**Verify:**

```bash
npx tsc --noEmit
npm run lint
```

---

### 6. Add the mobile Timeline sub-list

In the mobile nav `<ul>` rendered inside `<nav id="mobile-nav-menu">`,
replace the "Timeline" `<li>` link with an expandable accordion row.

The "Timeline" item in `NAV_SECTIONS` still maps to an `<a href="#timeline">`.
For mobile, override the rendering of the Timeline item only. The recommended
approach is to check `id === "timeline"` inside the map (or render the
Timeline item separately).

**Timeline accordion row:**

```tsx
<li key="timeline">
  <button
    type="button"
    onClick={() => setIsTimelineMobileExpanded((prev) => !prev)}
    className={cn(
      "w-full flex items-center justify-between no-underline",
      "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
      "border-b border-[var(--color-surface-rule)]",
      activeSection === "timeline" && "text-[var(--color-accent-blue)] font-semibold",
    )}
    style={{
      padding: "var(--space-4) var(--space-6)",
      fontSize: "var(--font-size-body)",
      background: "transparent",
      cursor: "pointer",
    }}
    aria-expanded={isTimelineMobileExpanded ? "true" : "false"}
  >
    Timeline
    <ChevronDown
      size={16}
      aria-hidden="true"
      className={cn(
        "transition-transform duration-200 motion-reduce:transition-none",
        isTimelineMobileExpanded && "rotate-180",
      )}
    />
  </button>

  {isTimelineMobileExpanded && (
    <ul className="list-none m-0 p-0">
      {/* Timeline Overview link */}
      <li>
        <Link
          href="/#timeline"
          onClick={closeMobileMenu}
          className="block no-underline text-[var(--color-accent-blue)] font-bold border-b border-[var(--color-surface-rule)]"
          style={{
            padding: "var(--space-3) var(--space-6)",
            paddingLeft: "var(--space-8)",
            fontSize: "var(--font-size-body)",
          }}
        >
          Timeline Overview
        </Link>
      </li>
      {/* Event links — derived from exhibitData, not hardcoded */}
      {exhibitData.timelineEntries.map((entry) => (
        <li key={entry.slug}>
          <Link
            href={`/timeline/${entry.slug}`}
            onClick={closeMobileMenu}
            className="block no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-b border-[var(--color-surface-rule)]"
            style={{
              padding: "var(--space-3) var(--space-6)",
              paddingLeft: "var(--space-8)",
              fontSize: "var(--font-size-body)",
            }}
          >
            {entry.year} — {entry.title}
          </Link>
        </li>
      ))}
    </ul>
  )}
</li>
```

**Required changes to imports in `site-header.tsx`:**

The existing file already imports `Menu` and `X` from `lucide-react`. Update
that import to add `ChevronDown`; do not add a second `lucide-react` import:

```ts
// Before (existing):
import { Menu, X } from "lucide-react";

// After (updated):
import { Menu, X, ChevronDown } from "lucide-react";
```

Add `exhibitData` as a new import (it is not currently imported):

```ts
import { exhibitData } from "@/lib/exhibit-data";
```

> **`prefers-reduced-motion` compliance:** the `motion-reduce:transition-none`
> Tailwind utility on the chevron ensures the rotation animation is instant
> when the visitor has reduced motion enabled. This is a spec requirement.

> **`closeMobileMenu` call on sub-list links:** all links inside the mobile
> sub-list call `closeMobileMenu()` (not a custom close function), so that
> `isTimelineMobileExpanded` is also reset via the updated `closeMobileMenu`
> callback from Task 1.

**Verify:**

```bash
npx tsc --noEmit
npm run lint
```

---

### 7. Final verification

Run all code quality gates:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected outcomes:
- TypeScript: zero errors
- Lint: zero errors
- Build: exits with code 0
- Desktop "Timeline" nav item is a `<button>` (not an `<a>`)
- Desktop dropdown panel renders with `role="menu"` and 8 `role="menuitem"` links
- Mobile "Timeline" row renders a chevron and an expandable sub-list
- Closing the hamburger menu resets `isTimelineMobileExpanded` to `false`

## Completion Checklist

- [ ] `isTimelineDropdownOpen` state added, initialized `false`
- [ ] `isTimelineMobileExpanded` state added, initialized `false`
- [ ] `closeMobileMenu` updated to also reset `isTimelineMobileExpanded` to `false`
- [ ] `timelineTriggerRef` added and attached to the Timeline trigger `<button>`
- [ ] Click-outside handler attached to `document` via `useEffect`, removed on cleanup
- [ ] `data-timeline-container` attribute on the wrapper `<div>` for click-outside boundary
- [ ] Timeline trigger container uses `position: relative` (Tailwind `relative` class)
- [ ] `onMouseEnter`/`onMouseLeave` handlers are on the wrapper `<div>`, not the trigger button alone
- [ ] Desktop "Timeline" trigger is a `<button>` element (not an `<a>`)
- [ ] Trigger carries `aria-haspopup="menu"` and `aria-expanded` (toggles `"true"`/`"false"`)
- [ ] Dropdown panel uses `role="menu"`
- [ ] All event links in panel use `role="menuitem"`
- [ ] "Timeline Overview" is the first item in the panel, weight 700, `--color-accent-blue`
- [ ] Event link data derived from `exhibitData.timelineEntries` — not hardcoded
- [ ] Full WAI-ARIA Menu Button keyboard pattern implemented (↑↓, Home, End, Escape, Tab)
- [ ] `ArrowDown` on the trigger button opens the dropdown and focuses the first `[role="menuitem"]` element
- [ ] Escape closes dropdown and returns focus to trigger button via `timelineTriggerRef.current?.focus()`
- [ ] Tab closes dropdown without preventing default tab behavior
- [ ] `NAV_SECTIONS` const is unchanged
- [ ] `ChevronDown` added to the existing `lucide-react` import (not a duplicate import)
- [ ] `exhibitData` imported from `@/lib/exhibit-data`
- [ ] Mobile "Timeline" row renders chevron icon to the right of the label
- [ ] Chevron rotates 180° when sub-list is open
- [ ] Chevron rotation transition uses `motion-reduce:transition-none` (or equivalent CSS media query)
- [ ] Mobile accordion button carries `aria-expanded` using string values `"true"` / `"false"` (not boolean)
- [ ] Mobile sub-list includes "Timeline Overview" link first, then all 7 event links
- [ ] Mobile sub-list links indented `--space-8` from left edge
- [ ] All mobile sub-list links call `closeMobileMenu()` on click
- [ ] No inline HTML event handlers (`onclick`, `onmouseenter`) — all use React event props
- [ ] No hardcoded color values — all values use CSS custom properties
- [ ] `npx tsc --noEmit` reports zero errors
- [ ] `npm run lint` reports zero errors
- [ ] `npm run build` exits with code 0
