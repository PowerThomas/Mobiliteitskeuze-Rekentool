# Mobiliteitskeuze Rekentool (MVP)

Kleine Next.js webapp om drie scenario's te vergelijken na afloop van een leasecontract:

- **A:** zakelijke lease EV (bijtelling)
- **B:** mobiliteitsbudget + zelf tweedehands EV kopen
- **C:** mobiliteitsbudget + private lease EV

Inclusief optionele **thuisladen ERE-credit** (€/kWh terug) plus vaste maandfee.

## Uitgangspunten

- Alle fiscale parameters zijn **configureerbaar** (geen hardcoded waarheid).
- Resultaten zijn **netto maandimpact** en totaal over horizon.
- Credits (mobiliteitsbudget, km-vergoeding, ERE) worden als negatieve kosten getoond.
- Scenario A trekt mobiliteitsbudget standaard **niet** af, tenzij toggle actief is.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Vitest voor unit tests
- Client-side CSV export (inputs + resultaten)

## Starten

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tests

```bash
npm run test
```

## Rekenkern (globaal)

- **Energie**: total kWh op basis van km/jaar en kWh/100km, split thuis/publiek.
- **ERE**: credit op thuis kWh × eligible share × €/kWh, minus vaste fee.
- **A (lease)**: bijtelling-belasting + eigen bijdrage + evt laadkosten; optioneel mobiliteitsbudget-credit.
- **B (eigen EV)**: afschrijving + financiering + vaste autokosten + energie + laadpaalafschrijving - budget - km-vergoeding - ERE.
- **C (private lease)**: leasebedrag + extra km + niet-inbegrepen posten + energie - budget - km-vergoeding - ERE.

## Bekende aannames in MVP

- Bijtelling berekend met één configureerbaar tarief + cap.
- Geen complexe fiscale uitzonderingen, WW/IAK of werkgevers-specifieke regelsets.
- Voor eigen EV worden afschrijving én (optioneel) financieringslast getoond om cashflow zichtbaar te maken.
