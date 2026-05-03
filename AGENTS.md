# Mobiliteitskeuze Rekentool — Agent Instructions

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run test     # run Vitest unit tests (non-watch)
npm run lint     # Next.js ESLint
```

## Architecture

- **Client-side only** — no API routes, no database, no server state. Everything runs in the browser.
- Entry point: `src/app/page.tsx` (`'use client'`) — holds all `useState`, computes results with `useMemo`.
- Calculation engine: pure functions in `src/lib/calculations.ts` — no side effects.
- Types: `src/lib/types.ts` — `InputState` is the single source of truth for all inputs.
- Defaults: `src/lib/defaults.ts` — realistic Dutch defaults (37% tax, 48-month horizon, etc.).
- Format helpers: `src/lib/format.ts` (euro formatting).
- Reusable inputs: `src/components/` (`NumberInput`, `CheckboxInput`, `SelectInput`).
- Tests: `src/tests/calculations.test.ts` — Vitest, import alias `@/` maps to `src/`.

## Domain: Three EV Scenarios (Dutch)

| Key | Title | What it models |
|-----|-------|---------------|
| A | Zakelijke lease EV | Company lease car: bijtelling tax + employee contribution + optional charging cost |
| B | Mobiliteitsbudget + eigen EV | Mobility budget + buying own EV: depreciation, financing, insurance, MRB, maintenance, charging, charging station depreciation |
| C | Mobiliteitsbudget + private lease EV | Mobility budget + private lease: monthly lease cost + extra-km cost + items not included in lease |

All three scenarios can subtract: **mobiliteitsbudget** (net), **onbelaste km-vergoeding** (tax-free km reimbursement), and **ERE-credit** (home charging energy credit).

## Key Conventions

- **Credits are negative** `amountPerMonth` values in `breakdown` arrays — do not flip the sign.
- All Dutch fiscal terms stay in Dutch (`bijtelling`, `mobiliteitsbudget`, `MRB`, `ERE`, `eigen bijdrage`).
- `mobilityBudgetMode` is `'netto' | 'bruto'` — bruto is converted to netto using `marginalTaxRate`.
- `InputState` is updated via a partial patch helper: `update(section, patch)` in `page.tsx`.
- `horizonMonths` is the comparison horizon — `totalHorizon = netPerMonth * horizonMonths`.
- When adding a new cost/credit to a scenario, add it to `breakdown` and let `reduce` sum it; do not manually adjust `netPerMonth`.
- Keep calculations as pure functions; no React imports in `src/lib/`.

## Pitfalls

- `npm run test` uses `vitest run` (single-pass). For watch mode run `npx vitest` directly.
- No server components — `page.tsx` is `'use client'`; adding server-only APIs will break the build.
- `@/` alias is configured in `tsconfig.json`; always use it for imports from `src/`.
