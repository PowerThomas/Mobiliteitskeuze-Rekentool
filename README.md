# Mobiliteitskeuze Rekentool

Stap-voor-stap wizard waarmee je drie scenario's voor elektrisch rijden naast elkaar vergelijkt:

| Scenario | Omschrijving |
|----------|-------------|
| **A** | Zakelijke lease EV — bijtelling + eigen bijdrage |
| **B** | Mobiliteitsbudget + eigen EV kopen — afschrijving, financiering, vaste lasten |
| **C** | Mobiliteitsbudget + private lease EV — leasebedrag + extra km |

Resultaat: **netto maandimpact** en totaalkosten over de gekozen horizon, per scenario naast elkaar.

## Functies

- **7-staps wizard** met eenvoudig/geavanceerd mode
- **Live preview** — goedkoopste scenario altijd zichtbaar tijdens invoer
- **i18n** — Nederlands (standaard) en Engels, browservoorkeur als initiële default
- **Thema** — licht / donker / systeem (systeem is standaard), FOUC-vrij
- **Validatie** — realtime foutmeldingen voor km-coherentie, aanbetaling, restwaarde en financieringsduur
- **Veldindicaties** — tooltips met brondocument per invoerveld
- **CSV-export** — alle inputs én resultaten in één bestand
- Volledig **client-side** — geen server, geen database

## Fiscale uitgangspunten (2026)

| Gegeven | Waarde |
|---------|--------|
| Bijtelling EV (DET 2026) | 18%, cap € 30.000 |
| Onbelaste km-vergoeding | € 0,23/km |
| ERE-credit (typisch) | € 0,08/kWh, 90% eligible, € 5/m fee |
| MRB elektrische auto | kwarttarief (25%) |
| Marginaal tarief standaard | 37% (schijf 2) |

Alle parameters zijn volledig configureerbaar.

## Stack

| | |
|-|-|
| Framework | Next.js 15 (App Router, `'use client'` only) |
| Taal | TypeScript 5 |
| Styling | Tailwind CSS 3 (`darkMode: 'class'`) |
| Unit tests | Vitest 3 |
| E2E tests | Playwright 1.59 |

## Starten

```bash
npm install
npm run dev        # http://localhost:3000
```

## Commando's

```bash
npm run dev        # dev-server
npm run build      # productie-build
npm run test       # Vitest unit tests (eenmalig)
npm run lint       # ESLint
npm run test:e2e   # Playwright e2e (vereist draaiende dev-server)
```

## Projectstructuur

```
src/
  app/
    page.tsx          # Hoofdpagina — alle state, wizard-stappen, CSV-export
    layout.tsx        # Root layout met FOUC-preventiescript
    globals.css       # Tailwind base + dark-mode body-stijlen
  components/
    wizard/
      WizardShell.tsx # Voortgangsbalk, stap-header, prev/next-navigatie
    ScenarioCard.tsx  # Resultaatkaart per scenario
    BreakdownList.tsx # Kostenspecificatie per scenario
    SensitivitySliders.tsx  # Gevoeligheidsanalyse (stap 7)
    NumberInput.tsx   # Getal-invoerveld met validatie en hint
    PercentInput.tsx  # Procentveld (% tonen, fractie opslaan)
    CheckboxInput.tsx # Checkbox met label en hint
    SelectInput.tsx   # Dropdown
    Hint.tsx          # Tooltip-badge met brondocumentverwijzing
  lib/
    calculations.ts   # Pure rekenfuncties (geen React-imports)
    types.ts          # InputState — centrale state-definitie
    defaults.ts       # Realistische Nederlandse standaardwaarden
    validation.ts     # Validatieregels → vertaalsleutelcodes
    format.ts         # Euro-formatter
    i18n/
      translations.ts # NL- en EN-woordenboeken
      context.tsx     # LocaleProvider + useLocale hook
    theme/
      context.tsx     # ThemeProvider + useTheme hook
  tests/
    calculations.test.ts  # Vitest unit tests
e2e/
  rekentool.spec.ts   # Standaard resultaten, invoerwijzigingen, CSV
  theme.spec.ts       # Thema-switching en persistentie
  wizard-flows.spec.ts # Navigatie, invoerpersistentie, validatiefouten, preview
  locale.spec.ts      # Taalvoorkeur persistentie
```

## Rekenkern

Credits hebben een **negatieve** `amountPerMonth` in het breakdown-array — teken nooit omdraaien.

| Scenario | Kosten |
|----------|--------|
| **A** | bijtelling-belasting + eigen bijdrage + laadkosten − mobiliteitsbudget − km-vergoeding |
| **B** | afschrijving + financiering + verzekering + MRB + onderhoud + energie + laadpaalafschrijving − ERE − budget − km-vergoeding |
| **C** | leasebedrag + extra-km + niet-inbegrepen posten + energie − ERE − budget − km-vergoeding |

## Bekende beperkingen

- Bijtelling berekend met één configureerbaar tarief + cap (geen complexe DET-beperkingen).
- Geen werkgever-specifieke regelsets of WW/IAK-berekeningen.
- Alle berekeningen zijn schattingen — raadpleeg een fiscalist voor bindend advies.
