# Sprint 0 — Foundation Shell and Design Tokens

## Header

- **Goal:** establish the project skeleton — Next.js scaffolding, global CSS
  with all Swiss International Style design tokens, site header with
  navigation, site footer structure, and typed data-layer stubs. No section
  content yet — just the architectural shell that all later sprints build on.
- **Spec sections:**
  - Design Foundations (Task 1 — Swiss International Style)
  - Architecture: Technology Stack, Navigation Model, CSS Architecture,
    Content Data Model, Metadata Requirements, Reusable Component
    Architecture (SiteHeader, SiteFooter only)
  - Security Considerations
  - Deployment (basePath, static export)
- **Prerequisite:** none
- **Expected test count:** `0 existing + 0 new = 0 total` (build, lint, and
  typecheck are the verification gates for this sprint)

## Available Assets

| Asset | Verified details | How this sprint uses it |
|-------|-----------------|------------------------|
| `reference/package.json` | Contains the full dependency list and npm scripts for the reference Next.js project | Model for creating the project's own `package.json` with correct dependencies and scripts |
| `reference/next.config.ts` | Static export (`output: 'export'`), `basePath` from env var, `images: { unoptimized: true }` | Template for the project's `next.config.ts` — simplified for this site (no remote image patterns needed) |
| `reference/tsconfig.json` | Strict mode, `@/*` path alias, bundler module resolution | Copied and adapted for this project |
| `reference/eslint.config.mjs` | ESLint config for Next.js | Copied for this project |
| `reference/postcss.config.mjs` | PostCSS config for Tailwind | Copied for this project |
| `reference/vitest.config.ts` | Vitest with jsdom, React plugin, `@/` alias, `tests/` include | Copied for this project |
| `reference/playwright.config.ts` | Playwright config for browser tests | Copied for this project |
| `reference/components.json` | shadcn/ui component configuration (New York style) | Copied for this project |
| `reference/app/layout.tsx` | Root layout pattern: `next/font/google`, metadata export, `<html lang="en">`, SiteHeader/SiteFooter wrapping | Structural model for this project's layout (different font, different metadata) |
| `reference/app/globals.css` | CSS custom properties and Tailwind directives | Structural model — tokens will be entirely different (Swiss style nuclear palette) |
| `reference/lib/utils.ts` | `cn()` utility using `clsx` and `tailwind-merge` | Copied directly |
| `reference/tests/setup.ts` | Vitest setup with `@testing-library/jest-dom` | Copied directly |
| `docs/_specs/digital-museum/spec.md` | Complete specification with color system, type scale, spacing scale, grid, and metadata requirements | Source of truth for all design token values |
| `docs/_research/SOURCES.json` | All source entries with IDs, URLs, titles, and section mappings | Referenced by `lib/exhibit-data.ts` type definitions |
| `public/assets/images/` | 3 images: `uranium_vs_fossil_fuels_diagram.png`, `safest_cleanest_sources_of_energy_chart.png`, `nuclearplant.gif` | Already in place — no action needed this sprint; confirmed available for later sprints |

## Tasks

### 1. Initialize the Next.js project

Create the project configuration files at the repository root. These files
establish the Next.js App Router project with TypeScript, static export, and
the full toolchain.

Required files to create:

- `package.json` — based on the reference but with the project name
  `is117004-digital-museum`. Include the same scripts: `dev`, `build`,
  `start`, `lint`, `typecheck`, `test`, `test:browser`, `format`,
  `format:check`. Include the same core dependencies: `next`, `react`,
  `react-dom`, `class-variance-authority`, `clsx`, `tailwind-merge`,
  `lucide-react`, and any Radix UI primitives needed (`@radix-ui/react-accordion`,
  `@radix-ui/react-dialog`, `@radix-ui/react-separator`, `@radix-ui/react-slot`,
  `@radix-ui/react-tooltip`). Include the same dev dependencies: `typescript`,
  `eslint`, `eslint-config-next`, `@types/node`, `@types/react`,
  `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `prettier`,
  `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/jest-dom`,
  `@testing-library/react`, `@playwright/test`, `@lhci/cli`.
- `next.config.ts` — static export with `output: 'export'`, `trailingSlash:
  true`, `basePath` from `process.env.NEXT_PUBLIC_BASE_PATH || ""`, and
  `images: { unoptimized: true }`. No remote image patterns needed — all
  images are local.
- `tsconfig.json` — strict mode, `@/*` path alias, same config as reference.
- `eslint.config.mjs` — same as reference.
- `postcss.config.mjs` — same as reference.
- `vitest.config.ts` — same as reference.
- `playwright.config.ts` — same as reference.
- `components.json` — same as reference (shadcn/ui New York style config).
- `tests/setup.ts` — same as reference.

After creating these files, install dependencies.

**Verify:**

```bash
npm install
npx tsc --noEmit
```

### 2. Create the global CSS with all Swiss International Style design tokens

Create `app/globals.css` with Tailwind directives and a complete `:root`
block defining every CSS custom property from the spec's Design Foundations.

Required token groups in `:root`:

**Colors:**
- `--color-bg-primary: #ffffff`
- `--color-bg-secondary: #f6f8fa`
- `--color-bg-tertiary: #eaeef2`
- `--color-bg-dark: #0d1117`
- `--color-surface-rule: #d0d7de`
- `--color-text-primary: #1f2328`
- `--color-text-secondary: #656d76`
- `--color-accent-blue: #0969da`
- `--color-accent-cyan: #00e5ff`
- `--color-accent-red: #cf222e`
- `--color-accent-amber: #bf8700`
- `--color-accent-green: #1a7f37`
- `--color-text-on-dark: #f0f3f6`
- `--color-text-secondary-on-dark: #9ca3af`

**Typography:**
- `--font-family-primary: var(--font-inter), "Helvetica Neue", Helvetica, Arial, sans-serif`
- `--font-size-display: 48px` (with mobile override `32px`)
- `--font-size-section: 36px` (with mobile override `26px`)
- `--font-size-sub: 24px` (with mobile override `20px`)
- `--font-size-body: 18px` (with mobile override `16px`)
- `--font-size-caption: 14px` (with mobile override `13px`)
- `--font-size-badge: 12px`

**Spacing scale:**
- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-6: 24px`
- `--space-8: 32px`
- `--space-12: 48px`
- `--space-16: 64px`
- `--space-24: 96px`
- `--space-32: 128px`

**Grid:**
- `--grid-max-width: 1200px`
- `--grid-gutter: 24px`
- `--grid-margin-mobile: 24px`
- `--grid-margin-tablet: 48px`

**Base styles:**
- Set `font-family` on `body` to the primary font variable.
- Set `color` to `--color-text-primary`.
- Set `background` to `--color-bg-primary`.
- Set base `font-size` to `--font-size-body` and `line-height: 1.6`.
- Add `prefers-reduced-motion: reduce` media query that disables all
  CSS animations and transitions.
- Add responsive breakpoints for mobile typography overrides at `< 768px`.

**Verify:**

```bash
npm run build
```

### 3. Create the root layout with Inter font and metadata

Create `app/layout.tsx` with:

- Inter font loaded via `next/font/google` with weights 400, 700, 800
  and `variable: "--font-inter"`.
- `<html lang="en">` with the font variable class on `<body>`.
- Metadata export with:
  - `title`: "Nuclear Energy: A Digital Museum Exhibit"
  - `description`: 150–160 character summary in Sage voice
  - `openGraph`: title, description, and `/assets/images/uranium_vs_fossil_fuels_diagram.png` as the OG image
- Viewport export with `width: "device-width"` and `initialScale: 1`.
- Import `./globals.css`.
- Wrap children in a site frame div with `SiteHeader` and `SiteFooter`
  components (created in tasks 5 and 6).
- Include a visually hidden "Skip to main content" link as the first
  focusable element, targeting `#main-content`.

Also create `lib/utils.ts` with the `cn()` utility (same as reference).

**Verify:**

```bash
npx tsc --noEmit
```

### 4. Create the page shell

Create `app/page.tsx` as the single-page exhibit route. For this sprint it
should render a `<main id="main-content">` element containing placeholder
sections for each of the seven exhibit rooms. Each placeholder is a
`<section>` with the correct anchor ID (`hero`, `how-it-works`, `benefits`,
`safety`, `fuel-cycle`, `future-demand`, `timeline`) and an
`aria-labelledby` pointing to a heading ID. Each section contains an `<h2>`
with its spec-defined title as placeholder content.

This establishes the scroll-target anchors the header navigation links to.

**Verify:**

```bash
npm run build
```

### 5. Create the SiteHeader component

Create `components/site/site-header.tsx` implementing the sticky header from
the spec's Navigation Model.

Required behavior:

- Sticky positioning at the top of the viewport.
- Site title text: "Nuclear Energy Museum" (or the short exhibit name).
- Seven anchor links: Hero, How It Works, Benefits, Safety, Fuel Cycle,
  Future Demand, Timeline — linking to `#hero`, `#how-it-works`,
  `#benefits`, `#safety`, `#fuel-cycle`, `#future-demand`, `#timeline`.
- Desktop: horizontal nav visible.
- Mobile (below 768 px): hamburger button that opens a full-width overlay
  with all seven section links. Overlay closes on link tap or an explicit
  close button. Use `aria-expanded`, `aria-controls`, and proper focus
  management.
- Active section highlighting via Intersection Observer API — the nav link
  for the section nearest the top of the viewport receives the active style
  (use `--color-accent-blue` for the active indicator).
- Style using CSS Modules (`site-header.module.css`) or Tailwind utility
  classes. All colors must reference the CSS custom property tokens.

Create the corresponding CSS module file if using CSS Modules approach.

**Verify:**

```bash
npx tsc --noEmit
npm run build
```

### 6. Create the SiteFooter component

Create `components/site/site-footer.tsx` implementing the footer skeleton
from the spec.

Required content:

- A "Sources and Attribution" heading.
- Placeholder structure for the organized source list (to be populated in
  Sprint 4 from `lib/exhibit-data.ts`).
- The reciprocity closing line: "We showed you the evidence. Here is where
  to verify it yourself."
- All external links must include `rel="noopener noreferrer"` and
  `target="_blank"`.
- Use semantic `<footer>` element.

**Verify:**

```bash
npx tsc --noEmit
npm run build
```

### 7. Create the typed data-layer stubs

Create `lib/exhibit-data.ts` with TypeScript interfaces and empty or
minimal data structures. This file will be populated incrementally in
later sprints but the types must be defined now to enforce the content
data model.

Required type definitions:

- `Source` — `id: string`, `type: string`, `title: string`,
  `sourceUrl: string`, `recommendedUse: string`, `notes: string`,
  `licenseNote: string`
- `ExhibitSection` — `id: string`, `title: string`, `eyebrow: string`,
  `lede: string`, `bodyContent: string`, `sourceIds: string[]`,
  `accentColor: string`, `transitionText?: string`
- `TimelineEntry` — `year: number | string`, `title: string`,
  `description: string`, `sourceIds: string[]`
- `ProcessStep` — `stepNumber: number`, `title: string`,
  `description: string`, `icon?: string`
- `StatCard` — `value: string`, `label: string`, `context: string`,
  `sourceId: string`
- `ExhibitData` — `sections: ExhibitSection[]`,
  `timelineEntries: TimelineEntry[]`,
  `processSteps: Record<string, ProcessStep[]>`,
  `statCards: Record<string, StatCard[]>`,
  `sources: Source[]`

Export a stub `exhibitData` constant that satisfies the `ExhibitData`
type with empty arrays. This will be populated in Sprints 1–4.

**Verify:**

```bash
npx tsc --noEmit
```

### 8. Final build and lint verification

Run the full verification suite to confirm the foundation shell is clean.

**Verify:**

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Completion Checklist

- [ ] `package.json` exists at the project root with correct dependencies and scripts
- [ ] `npm install` succeeds and `node_modules/` is populated
- [ ] `next.config.ts` configures static export with `output: 'export'`
- [ ] `tsconfig.json` has strict mode and `@/*` path alias
- [ ] `app/globals.css` contains all Swiss Style design tokens as CSS custom properties
- [ ] `app/layout.tsx` loads Inter via `next/font/google` and exports correct metadata
- [ ] Skip-to-content link is the first focusable element
- [ ] `app/page.tsx` renders 7 placeholder sections with correct anchor IDs
- [ ] `components/site/site-header.tsx` renders sticky nav with 7 section links
- [ ] Mobile hamburger menu opens and closes with proper ARIA attributes
- [ ] Active section highlighting via Intersection Observer is implemented
- [ ] `components/site/site-footer.tsx` renders footer skeleton with source list structure
- [ ] `lib/exhibit-data.ts` exports typed interfaces and stub data
- [ ] `lib/utils.ts` exports the `cn()` utility
- [ ] All colors in components trace to CSS custom property tokens (no hardcoded hex values)
- [ ] `prefers-reduced-motion: reduce` media query is present in `globals.css`
- [ ] `npm run build` completes with exit code 0
- [ ] `npm run lint` reports zero errors
- [ ] `npx tsc --noEmit` reports zero type errors
- [ ] Responsive layout verified at 1440 px, 768 px, and 390 px

## QA Deviations

None.
