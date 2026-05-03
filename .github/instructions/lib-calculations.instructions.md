---
description: "Use when editing or adding code in src/lib/ — especially calculations.ts, types.ts, or defaults.ts. Enforces pure functions, Dutch fiscal terminology, and the negative-credit convention."
applyTo: "src/lib/**"
---
# src/lib Conventions

## Pure Functions
- No React imports, no side effects, no module-level state in `src/lib/`.
- All calculation functions take `InputState` (or a subset) and return a value — never mutate inputs.

## Dutch Fiscal Terminology
Keep all domain terms in Dutch. Do not translate:

| Term | Meaning |
|------|---------|
| `bijtelling` | Benefit-in-kind tax on employer-provided cars |
| `mobiliteitsbudget` | Employer mobility budget |
| `eigen bijdrage` | Employee contribution |
| `MRB` | Road tax (Motorrijtuigenbelasting) |
| `ERE` | Energy cost credit for home EV charging |
| `onbelaste km-vergoeding` | Tax-free km reimbursement |
| `afschrijving` | Depreciation |

## Negative-Credit Convention
Credits reduce cost — represent them as **negative** `amountPerMonth` values in `breakdown` arrays. Never flip the sign when summing.

```ts
// Correct
{ label: 'Mobiliteitsbudget netto', amountPerMonth: -mobilityBudgetNetPerMonth(inputs) }

// Wrong — do not negate after the fact
netPerMonth -= mobilityBudgetNetPerMonth(inputs);
```

## Adding a Cost or Credit to a Scenario
Always add to the `breakdown` array and let `reduce` compute `netPerMonth`. Never manually adjust `netPerMonth`:

```ts
const breakdown = [
  { label: '...', amountPerMonth: cost },
  { label: '...', amountPerMonth: -credit }, // credits are negative
];
const netPerMonth = breakdown.reduce((sum, x) => sum + x.amountPerMonth, 0);
```

## mobilityBudgetMode
`'bruto'` must be converted to net before use:
```ts
const net = mode === 'netto' ? amount : amount * (1 - marginalTaxRate);
```
Use the existing `mobilityBudgetNetPerMonth(inputs)` helper — do not inline this logic.
