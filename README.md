# Mobiliteitskeuze Rekentool

Deze repository bevat de rekenlaag voor het doorrekenen van mobiliteitsscenario's.

## Installatie en runnen

1. Installeer dependencies:
   ```bash
   npm install
   ```
2. Draai de testset één keer:
   ```bash
   npm test
   ```
3. Start Vitest in watch-modus tijdens ontwikkeling:
   ```bash
   npm run test:watch
   ```

## Inputdata die de gebruiker moet verzamelen

Voor een zinvolle berekening zijn minimaal de volgende gegevens nodig:

- **Bijtelling en fiscale cap**: jaarlijkse bijtelling en eventuele maximale fiscale grens.
- **Financieringsparameters**: lening/leasebedrag (`presentValue`), rente per periode (`rate`) en aantal termijnen (`numberOfPeriods`).
- **Laadprofiel**: totaal verbruik in kWh, aandeel thuis laden vs. publiek laden, en tarieven per kWh voor beide laadtypen.
- **ERE-gegevens**: totale maandelijkse vergoeding/tegemoetkoming en het deel dat daadwerkelijk eligible is (`eligibleShare`).
- **Scenariohorizon**: maandelijkse netto uitkomst (`monthlyNet`) en looptijd in maanden (`horizonMonths`).

## Disclaimer

Deze rekentool is uitsluitend bedoeld als indicatieve ondersteuning en vormt **geen fiscaal advies**.
