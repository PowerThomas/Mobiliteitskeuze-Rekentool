# Wizard UX Refresh — Phased Implementation Plan

Build a step-by-step wizard from the current expert single-page layout. All three Dutch EV scenarios remain comparable throughout; the user is guided through sensible defaults and presets, with an optional advanced mode for raw-number access.

## Dutch Fiscal Facts (verified, 2026)

| Fact | Value | Source |
|------|-------|--------|
| Bijtelling standaardtarief | 22% | Belastingdienst Handboek Loonheffingen |
| Bijtelling korting EV (DET 2026) | −4% → **18%**, cap €30.000 | fiscaalvanmorgen.nl, Belastingplan 2026 |
| Bijtelling korting EV (DET 2025) | −5% → **17%**, cap €30.000 | idem, max 60 maanden |
| Bijtelling korting EV (DET 2027) | −2% → **20%**, cap €30.000 | Belastingplan 2026 |
| Box 1 schijf 1 2026 | 35,75% (≤ €38.883) | belastingdienst.nl |
| Box 1 schijf 2 2026 | 37,56% (€38.883 – €78.426) | belastingdienst.nl |
| Box 1 schijf 3 2026 | 49,50% (> €78.426) | belastingdienst.nl |
| Onbelaste km-vergoeding | €0,23/km | Belastingdienst 2024–2026 |
| MRB elektrische auto 2026 | Kwarttarief (25% van normaal) | Belastingdienst |
| ERE credit (typisch) | €0,08/kWh, 90% eligible, €5/m fee | Netbeheer Nederland / werkgeversafspraken |

---

## Phase 1 — Wizard architecture _(blocks all later UI work)_

Replace the current two-column expert layout with a `WizardShell` that manages step state, progress bar and prev/next navigation. Keep `InputState` from `src/lib/types.ts` as the single source of truth; all state stays in `page.tsx`.

**Steps:**
1. Welkom — intro, what you need
2. Persoonlijk & werkgever — tax rate, horizon, mobility budget, km allowance
3. Rijden & laden — km usage, consumption, energy prices, ERE
4. Scenario A — Zakelijke lease
5. Scenario B — Eigen EV
6. Scenario C — Private lease
7. Review & vergelijking — results, breakdowns, sensitivity, export

**Files:**
- `src/components/wizard/WizardShell.tsx` _(new)_
- `src/app/page.tsx` _(refactor: step state + step content per step)_

---

## Phase 2 — Component split

Extract presentation into reusable components so `page.tsx` becomes a thin orchestrator.

**New files:**
- `src/components/ScenarioCard.tsx`
- `src/components/BreakdownList.tsx`
- `src/components/SensitivitySliders.tsx`

---

## Phase 3 — Simple + advanced mode toggle

Add a clearly visible mode toggle. Simple (default): guided presets, conditional sections. Advanced: all raw inputs always visible. No data loss when toggling.

---

## Phase 4 — Guided inputs

- Percentages displayed as % (e.g. 37% not 0.37)
- Horizon as button group (12 / 24 / 36 / 48 / 60 months)
- Vehicle class presets for consumption
- ERE fields conditionally shown
- Residual value input conditional on mode
- Netto explanation when bruto mobility budget is selected
- Hard validation: no negatives, km coherence, residual < purchase price, down payment < purchase price, financing duration vs horizon

---

## Phase 5 — Field hints ("Waar vind ik dit?")

Per-field tooltip/hint indicating the source document or contract section where the user can find the value. Examples:
- Belastingtarief → loonstrook
- Mobiliteitsbudget → arbeidscontract / werkgeversregeling
- Cataloguswaarde → lease-offerte
- Stroomprijs → energierekening / laadpasoverzicht
- Bijtelling-% → Belastingdienst / lease-contract

---

## Phase 6 — i18n (NL + EN)

Client-side locale dictionaries + React context provider. Browser language as initial default; manual switch stored in `localStorage`. **No URL-based locale routing.** All user-visible strings move to translation keys. Breakdown labels in `calculations.ts` become stable keys; the UI maps keys to translated text.

---

## Phase 7 — Theme (light / dark / system)

Theme provider on layout level. CSS semantic tokens in `globals.css` replacing hardcoded light-only Tailwind classes. System theme is default until user explicitly chooses.

---

## Phase 8 — Results in review step

Move scenario cards, breakdowns, and sensitivity sliders into the wizard's review step. Optionally add a compact sticky mini-summary during earlier steps.

---

## Phase 9 — Tests update

- Keep unit tests green after any breakdown label → key refactor
- Playwright wizard flows (NL + EN), back/next, input persistence
- Validation error tests
- Theme and locale persistence tests
- Headed manual review path

---

## Key decisions

- All three scenarios always compared; user does not pre-select one
- NL and EN supported in first release
- Theme: light / dark / system (system is default)
- Simple wizard by default; advanced mode available via toggle
- Per-field hints; no external link required (just document label)
- Client-side only; no database; only lang/theme preference persisted
