export type Locale = 'nl' | 'en';

export type ConsumptionPreset = { label: string; value: number };

export type Translations = {
  locale: Locale;
  ui: {
    appTitle: string;
    appSubtitle: string;
    simpleMode: string;
    advancedMode: string;
    prev: string;
    next: string;
    stepOf: (n: number, total: number) => string;
    monthsAbbr: string;
    perMonth: string;
    netLabel: string;
    exportCsv: string;
    mostAffordable: string;
    overHorizon: string;
    breakdownTitle: string;
    sensitivityTitle: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    livePreview: string;
  };
  steps: Array<{ title: string; subtitle: string }>;
  welcome: {
    intro: string;
    scenarios: [
      { badge: 'A'; title: string; desc: string },
      { badge: 'B'; title: string; desc: string },
      { badge: 'C'; title: string; desc: string }
    ];
    checklistTitle: string;
    checklistItems: string[];
    defaultsNote: string;
  };
  fields: {
    marginalTaxRate: string;
    taxBrackets: Array<{ label: string; sublabel: string; value: number }>;
    horizonMonths: string;
    mobilityBudgetAmount: string;
    mobilityBudgetMode: string;
    budgetModeGross: string;
    budgetModeNet: string;
    taxFreeAllowanceEnabled: string;
    taxFreeAllowancePerKm: string;
    reimbursableKmPerYear: string;
    totalKmPerYear: string;
    commuteKmPerYear: string;
    businessKmPerYear: string;
    consumptionClassLabel: string;
    consumptionPresets: ConsumptionPreset[];
    kwhPer100Km: string;
    homeElectricityPrice: string;
    publicElectricityPrice: string;
    homeChargingShare: string;
    ereTitle: string;
    ereEnabled: string;
    ereCreditPerKwh: string;
    ereEligibleShare: string;
    ereMonthlyFee: string;
    listPrice: string;
    employeeContribution: string;
    additionalTaxRate: string;
    additionalTaxRateAboveCap: string;
    additionalTaxCap: string;
    chargingCoveredByEmployer: string;
    alsoReceiveMobilityBudget: string;
    purchasePrice: string;
    downPayment: string;
    financingEnabled: string;
    apr: string;
    financingMonths: string;
    residualValueMode: string;
    residualValueModePercent: string;
    residualValueModeAmount: string;
    residualValuePercent: string;
    residualValueAmount: string;
    insurancePerMonth: string;
    mrbPerMonth: string;
    maintenancePerMonth: string;
    chargingStationCost: string;
    chargingStationDepMonths: string;
    privateLeaseCost: string;
    includedKmPerYear: string;
    extraKmPrice: string;
    includesInsurance: string;
    includesMrb: string;
    includesMaintenance: string;
  };
  hints: {
    marginalTaxRate: string;
    mobilityBudgetAmount: string;
    mobilityBudgetMode: string;
    taxFreeAllowanceEnabled: string;
    taxFreeAllowancePerKm: string;
    reimbursableKmPerYear: string;
    totalKmPerYear: string;
    commuteKmPerYear: string;
    businessKmPerYear: string;
    kwhPer100Km: string;
    homeElectricityPrice: string;
    publicElectricityPrice: string;
    ereEnabled: string;
    ereCreditPerKwh: string;
    ereEligibleShare: string;
    ereMonthlyFee: string;
    listPrice: string;
    employeeContribution: string;
    additionalTaxRate: string;
    additionalTaxRateAboveCap: string;
    additionalTaxCap: string;
    chargingCoveredByEmployer: string;
    alsoReceiveMobilityBudget: string;
    purchasePrice: string;
    downPayment: string;
    financingEnabled: string;
    apr: string;
    financingMonths: string;
    residualValuePercent: string;
    residualValueAmount: string;
    insurancePerMonth: string;
    mrbPerMonth: string;
    maintenancePerMonth: string;
    chargingStationCost: string;
    chargingStationDepMonths: string;
    privateLeaseCost: string;
    includedKmPerYear: string;
    extraKmPrice: string;
    includesInsurance: string;
    includesMrb: string;
    includesMaintenance: string;
  };
  scenarios: { A: string; B: string; C: string };
  breakdown: Record<string, string>;
  errors: Record<string, string>;
};

export const nl: Translations = {
  locale: 'nl',
  ui: {
    appTitle: 'Mobiliteitskeuze Rekentool',
    appSubtitle: 'Netto maandimpact \u2014 Alle bedragen in euro. Credits worden groen weergegeven.',
    simpleMode: 'Eenvoudig',
    advancedMode: 'Geavanceerd',
    prev: '\u2190 Vorige',
    next: 'Volgende \u2192',
    stepOf: (n, total) => `Stap ${n} van ${total}`,
    monthsAbbr: 'mnd',
    perMonth: '/ maand',
    netLabel: 'Netto',
    exportCsv: 'Exporteer CSV (inputs + resultaten)',
    mostAffordable: 'Meest voordelig',
    overHorizon: 'over looptijd',
    breakdownTitle: 'Breakdown',
    sensitivityTitle: 'Gevoeligheidsanalyse',
    themeLight: 'Licht',
    themeDark: 'Donker',
    themeSystem: 'Systeem',
    livePreview: 'Vooruitblik',
  },
  steps: [
    { title: 'Welkom', subtitle: "Vergelijk drie rijkostenscenario\u2019s naast elkaar op basis van jouw situatie." },
    { title: 'Persoonlijk & werkgever', subtitle: 'Jouw belastingtarief, looptijd en mobiliteitsbudget.' },
    { title: 'Rijden & laden', subtitle: 'Jaarkilometrages, energieverbruik, laadgedrag en ERE-vergoeding.' },
    { title: 'Scenario A \u2014 Zakelijke lease', subtitle: 'Parameters voor de leaseauto van de zaak (bijtelling, eigen bijdrage).' },
    { title: 'Scenario B \u2014 Eigen EV', subtitle: 'Aanschaf, financiering en vaste maandlasten van een eigen elektrische auto.' },
    { title: 'Scenario C \u2014 Private lease', subtitle: 'Maandkosten, inbegrepen kilometers en meegeleverde posten van een priv\u00e9leasecontract.' },
    { title: 'Vergelijking & resultaten', subtitle: 'Jouw volledige kostenplaatje per scenario \u2014 netto maandimpact.' },
  ],
  welcome: {
    intro: "Deze rekentool vergelijkt drie scenario\u2019s voor elektrisch rijden naast elkaar:",
    scenarios: [
      { badge: 'A', title: 'Zakelijke lease EV', desc: 'Auto van de zaak, bijtelling + eigen bijdrage.' },
      { badge: 'B', title: 'Mobiliteitsbudget + eigen EV', desc: 'Zelf kopen/lenen met mobiliteitsbudget als tegemoetkoming.' },
      { badge: 'C', title: 'Mobiliteitsbudget + private lease EV', desc: 'Priv\u00e9 leasen met mobiliteitsbudget als tegemoetkoming.' },
    ],
    checklistTitle: 'Wat heb je bij de hand?',
    checklistItems: [
      'Loonstrook (voor belastingtarief)',
      'Werkgeversregeling of salarisbrief (voor mobiliteitsbudget)',
      'Lease-offerte of contract (voor cataloguswaarde, bijtellingstarief, eigen bijdrage)',
      'Energierekening of laadpasoverzicht (voor stroomprijs)',
    ],
    defaultsNote: 'Alle standaardwaarden zijn vooringevuld met realistische Nederlandse gemiddelden voor 2026. Pas aan wat voor jou van toepassing is.',
  },
  fields: {
    marginalTaxRate: 'Marginaal belastingtarief',
    taxBrackets: [
      { label: 'Schijf 1 — 35,75%', sublabel: 't/m €38.883', value: 0.3575 },
      { label: 'Schijf 2 — 37,56%', sublabel: '€38.884 – €78.426', value: 0.3756 },
      { label: 'Schijf 3 — 49,50%', sublabel: 'boven €78.426', value: 0.495 },
    ],
    horizonMonths: 'Looptijd vergelijking',
    mobilityBudgetAmount: 'Mobiliteitsbudget p/m',
    mobilityBudgetMode: 'Budgetmodus',
    budgetModeGross: 'Bruto',
    budgetModeNet: 'Netto',
    taxFreeAllowanceEnabled: 'Onbelaste km-vergoeding actief',
    taxFreeAllowancePerKm: 'Onbelaste km-vergoeding \u20ac/km',
    reimbursableKmPerYear: 'Declarabele km/jaar',
    totalKmPerYear: 'Totaal km/jaar',
    commuteKmPerYear: 'Woon-werk km/jaar',
    businessKmPerYear: 'Zakelijk km/jaar',
    consumptionClassLabel: 'Verbruiksklasse',
    consumptionPresets: [
      { label: 'Klein \u2014 14 kWh', value: 14 },
      { label: 'Gemiddeld \u2014 17,5 kWh', value: 17.5 },
      { label: 'Groot \u2014 20 kWh', value: 20 },
      { label: 'SUV \u2014 23 kWh', value: 23 },
    ],
    kwhPer100Km: 'Verbruik kWh/100 km',
    homeElectricityPrice: 'Stroomprijs thuis \u20ac/kWh',
    publicElectricityPrice: 'Publieke laadprijs \u20ac/kWh',
    homeChargingShare: 'Thuislaadaandeel',
    ereTitle: 'ERE-vergoeding (Energie Rekening Evenredigheid)',
    ereEnabled: 'ERE actief',
    ereCreditPerKwh: 'ERE credit \u20ac/kWh',
    ereEligibleShare: 'ERE eligible share',
    ereMonthlyFee: 'ERE vaste fee p/m',
    listPrice: 'Cataloguswaarde (incl. BTW)',
    employeeContribution: 'Eigen bijdrage p/m',
    additionalTaxRate: 'Bijtellingstarief (t/m cap)',
    additionalTaxRateAboveCap: 'Bijtellingstarief (boven cap)',
    additionalTaxCap: 'Bijtelling cap (\u20ac)',
    chargingCoveredByEmployer: 'Laadkosten door werkgever gedekt',
    alsoReceiveMobilityBudget: 'Toch mobiliteitsbudget ontvangen',
    purchasePrice: 'Aankoopprijs EV (\u20ac)',
    downPayment: 'Aanbetaling (\u20ac)',
    financingEnabled: 'Financiering actief',
    apr: 'APR (jaarrente)',
    financingMonths: 'Financieringsduur (maanden)',
    residualValueMode: 'Restwaarde modus',
    residualValueModePercent: 'Percentage',
    residualValueModeAmount: 'Bedrag',
    residualValuePercent: 'Restwaarde',
    residualValueAmount: 'Restwaarde bedrag (\u20ac)',
    insurancePerMonth: 'Verzekering p/m (\u20ac)',
    mrbPerMonth: 'MRB p/m (\u20ac)',
    maintenancePerMonth: 'Onderhoud p/m (\u20ac)',
    chargingStationCost: 'Thuislaadpaal eenmalig (\u20ac)',
    chargingStationDepMonths: 'Laadpaal afschrijving (maanden)',
    privateLeaseCost: 'Private lease p/m (\u20ac)',
    includedKmPerYear: 'Inbegrepen km/jaar',
    extraKmPrice: 'Extra km-prijs (\u20ac/km)',
    includesInsurance: 'Verzekering inbegrepen',
    includesMrb: 'MRB inbegrepen',
    includesMaintenance: 'Onderhoud inbegrepen',
  },
  hints: {
    marginalTaxRate: 'Het tarief waartegen jouw laatste euro inkomen wordt belast. Kijk op je loonstrook bij \'tarief\' of \'schijf\'. De grenswaarden zijn voor 2026.',

    mobilityBudgetAmount: 'Arbeidscontract of werkgeversregeling \u2014 bruto bedrag per maand.',
    mobilityBudgetMode: 'Bruto is v\u00f3\u00f3r loonbelasting. Netto is het bedrag dat je netto ontvangt.',
    taxFreeAllowanceEnabled: 'Belastingdienst \u2014 standaard max \u20ac0,23/km (2026). Staat in HR-beleid of arbeidscontract.',
    taxFreeAllowancePerKm: 'Belastingdienst \u2014 vaste norm \u20ac0,23/km voor 2026.',
    reimbursableKmPerYear: 'HR-beleid of arbeidscontract \u2014 totaal kilometers waarvoor vergoeding geldt.',
    totalKmPerYear: 'Rittenregistratie, dashboard of HR-systeem \u2014 totaal gereden km in een jaar.',
    commuteKmPerYear: 'Woon-werkverklaring of arbeidscontract \u2014 enkele reis \u00d7 2 \u00d7 werkdagen.',
    businessKmPerYear: 'Rittenregistratie of reisdeclaraties \u2014 zakelijke km excl. woon-werk.',
    kwhPer100Km: 'WLTP-specificaties op de dealerwebsite of BOVAG \u2014 realistisch +10\u201320% boven WLTP.',
    homeElectricityPrice: 'Energierekening of MijnEnergieleverancier-portaal \u2014 gebruik het actuele vari\u00e4bele tarief.',
    publicElectricityPrice: 'Laadpasoverzicht (bv. Allego, Fastned, Shell Recharge) \u2014 gemiddeld tarief per kWh.',
    ereEnabled: 'Energie Rekening Evenredigheid \u2014 werkgeversafspraken of CAO. Vergoeding voor thuislaadkosten.',
    ereCreditPerKwh: 'Werkgeversafspraken of afrekening netbeheerder \u2014 typisch ~\u20ac0,08/kWh.',
    ereEligibleShare: 'Werkgeversafspraken \u2014 aandeel thuislaadkilometers dat voor vergoeding in aanmerking komt. Standaard ~90%.',
    ereMonthlyFee: 'Werkgeversafspraken of loonstrook \u2014 vaste administratievergoeding per maand.',
    listPrice: 'Lease-offerte of RDC-catalogus \u2014 nieuwprijs incl. BTW en opties.',
    employeeContribution: 'Lease-contract of salarisstrook \u2014 netto maandbedrag dat je zelf bijdraagt.',
    additionalTaxRate: 'Belastingdienst \u2014 16% voor volledig elektrisch (2026) over de eerste \u20ac30.000 cataloguswaarde.',
    additionalTaxRateAboveCap: 'Belastingdienst \u2014 22% over het deel van de cataloguswaarde boven de cap.',
    additionalTaxCap: 'Belastingdienst Handboek Loonheffingen \u2014 \u20ac30.000 in 2026.',
    chargingCoveredByEmployer: 'Lease-contract of werkgeversregeling \u2014 controleer of laadpas en kosten inbegrepen zijn.',
    alsoReceiveMobilityBudget: 'Werkgeversregeling \u2014 sommige werkgevers bieden naast de leaseauto ook een mobiliteitsbudget.',
    purchasePrice: 'Dealer-offerte, configurator of BOVAG-adviesprijs \u2014 nieuwprijs incl. BTW.',
    downPayment: 'Financieringsofferte of eigen spaaroverzicht \u2014 eigen inbreng bij aankoop.',
    financingEnabled: 'Vink aan als je (een deel van) de auto financiert via een lening of private lease.',
    apr: 'Financieringsofferte \u2014 jaarlijks kostenpercentage (JKP). Typisch 4\u20138% bij autofinanciering.',
    financingMonths: 'Financieringsofferte \u2014 looptijd van de lening in maanden.',
    residualValuePercent: 'Financieringsofferte of ANWB restwaardegids \u2014 verwachte restwaarde als % van aankoopprijs.',
    residualValueAmount: 'Financieringsofferte of ANWB restwaardegids \u2014 verwacht bedrag bij verkoop/inruil.',
    insurancePerMonth: 'Verzekeringspolis (WA + Casco) \u2014 jaarpremie gedeeld door 12.',
    mrbPerMonth: 'Belastingdienst MRB-calculator \u2014 elektrische auto betaalt kwarttarief (25%) in 2026.',
    maintenancePerMonth: 'Dealer-onderhoudspakket of indicatie \u2014 EV gemiddeld \u20ac60\u2013100/maand.',
    chargingStationCost: 'Installatieofferte thuislaadpaal \u2014 inclusief installatie typisch \u20ac800\u20131.500.',
    chargingStationDepMonths: 'Gebruik de vergelijkingshorizon als richtlijn \u2014 of de verwachte gebruiksduur.',
    privateLeaseCost: 'Private lease-offerte \u2014 all-in maandbedrag. Controleer wat wel/niet inbegrepen is.',
    includedKmPerYear: 'Private lease-contract \u2014 aantal km per jaar waarvoor geen toeslag geldt.',
    extraKmPrice: 'Private lease-contract \u2014 tarief per extra kilometer boven het inbegrepen aantal.',
    includesInsurance: 'Private lease-offerte \u2014 check het dekkingsoverzicht (WA + Casco).',
    includesMrb: 'Private lease-offerte \u2014 motorrijtuigenbelasting.',
    includesMaintenance: 'Private lease-offerte \u2014 onderhoud en banden.',
  },
  scenarios: {
    A: 'A \u00b7 Zakelijke lease EV',
    B: 'B \u00b7 Mobiliteitsbudget + eigen EV',
    C: 'C \u00b7 Mobiliteitsbudget + private lease EV',
  },
  breakdown: {
    bijtelling_tax: 'Bijtelling: extra belasting',
    employee_contribution: 'Eigen bijdrage lease',
    charging_cost_lease: 'Laadkosten (indien niet gedekt)',
    mobility_budget_optional: 'Mobiliteitsbudget (optioneel)',
    depreciation: 'Afschrijving auto',
    financing: 'Financiering (rente+aflossing)',
    insurance: 'Verzekering',
    mrb: 'MRB',
    maintenance: 'Onderhoud',
    charging_cost: 'Laadkosten thuis/publiek',
    station_depreciation: 'Thuislaadpaal afschrijving',
    ere_credit: 'ERE-credit (incl. fee)',
    mobility_budget_net: 'Mobiliteitsbudget netto',
    km_allowance: 'Onbelaste km-vergoeding',
    lease_monthly: 'Private lease maandbedrag',
    extra_km_cost: 'Meer-km kosten',
    insurance_not_included: 'Verzekering (niet inbegrepen)',
    mrb_not_included: 'MRB (niet inbegrepen)',
    maintenance_not_included: 'Onderhoud (niet inbegrepen)',
  },
  errors: {
    err_km_exceeds_total: 'Woon-werk + zakelijk km overschrijdt het totaal',
    err_downpayment_exceeds_price: 'Mag niet groter zijn dan de aankoopprijs',
    err_residual_100pct: 'Restwaarde mag niet 100% of meer zijn',
    err_residual_exceeds_price: 'Restwaarde mag niet groter zijn dan aankoopprijs',
    err_financing_exceeds_horizon: 'Langer dan de looptijd van de vergelijking',
  },
};

export const en: Translations = {
  locale: 'en',
  ui: {
    appTitle: 'Mobility Choice Calculator',
    appSubtitle: 'Net monthly impact \u2014 All amounts in euros. Credits shown in green.',
    simpleMode: 'Simple',
    advancedMode: 'Advanced',
    prev: '\u2190 Back',
    next: 'Next \u2192',
    stepOf: (n, total) => `Step ${n} of ${total}`,
    monthsAbbr: 'mo',
    perMonth: '/ month',
    netLabel: 'Net',
    exportCsv: 'Export CSV (inputs + results)',
    mostAffordable: 'Most affordable',
    overHorizon: 'over duration',
    breakdownTitle: 'Breakdown',
    sensitivityTitle: 'Sensitivity analysis',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    livePreview: 'Preview',
  },
  steps: [
    { title: 'Welcome', subtitle: 'Compare three EV cost scenarios side by side based on your situation.' },
    { title: 'Personal & employer', subtitle: 'Your tax rate, comparison duration and mobility budget.' },
    { title: 'Driving & charging', subtitle: 'Annual mileage, energy consumption, charging habits and ERE allowance.' },
    { title: 'Scenario A \u2014 Company lease', subtitle: 'Parameters for the company lease car (benefit-in-kind, employee contribution).' },
    { title: 'Scenario B \u2014 Own EV', subtitle: 'Purchase, financing and fixed monthly costs of owning an electric car.' },
    { title: 'Scenario C \u2014 Private lease', subtitle: 'Monthly cost, included mileage and included items of a private lease contract.' },
    { title: 'Comparison & results', subtitle: 'Your full cost breakdown per scenario \u2014 net monthly impact.' },
  ],
  welcome: {
    intro: 'This calculator compares three electric driving scenarios side by side:',
    scenarios: [
      { badge: 'A', title: 'Company lease EV', desc: 'Employer car, benefit-in-kind tax + employee contribution.' },
      { badge: 'B', title: 'Mobility budget + own EV', desc: 'Buy or finance your own car with a mobility budget contribution.' },
      { badge: 'C', title: 'Mobility budget + private lease EV', desc: 'Private lease with a mobility budget contribution.' },
    ],
    checklistTitle: 'What do you need?',
    checklistItems: [
      'Payslip (for your tax rate)',
      'Employer policy or salary letter (for mobility budget)',
      'Lease quote or contract (for list price, benefit-in-kind rate, employee contribution)',
      'Energy bill or charge session overview (for electricity price)',
    ],
    defaultsNote: 'All defaults are pre-filled with realistic Dutch averages for 2026. Adjust whatever applies to your situation.',
  },
  fields: {
    marginalTaxRate: 'Marginal tax rate',
    taxBrackets: [
      { label: 'Band 1 — 35.75%', sublabel: 'up to €38,883', value: 0.3575 },
      { label: 'Band 2 — 37.56%', sublabel: '€38,884 – €78,426', value: 0.3756 },
      { label: 'Band 3 — 49.50%', sublabel: 'above €78,426', value: 0.495 },
    ],
    horizonMonths: 'Comparison duration',
    mobilityBudgetAmount: 'Mobility budget p/m',
    mobilityBudgetMode: 'Budget mode',
    budgetModeGross: 'Gross',
    budgetModeNet: 'Net',
    taxFreeAllowanceEnabled: 'Tax-free km allowance active',
    taxFreeAllowancePerKm: 'Tax-free allowance \u20ac/km',
    reimbursableKmPerYear: 'Reimbursable km/year',
    totalKmPerYear: 'Total km/year',
    commuteKmPerYear: 'Commute km/year',
    businessKmPerYear: 'Business km/year',
    consumptionClassLabel: 'Consumption class',
    consumptionPresets: [
      { label: 'Small \u2014 14 kWh', value: 14 },
      { label: 'Medium \u2014 17.5 kWh', value: 17.5 },
      { label: 'Large \u2014 20 kWh', value: 20 },
      { label: 'SUV \u2014 23 kWh', value: 23 },
    ],
    kwhPer100Km: 'Consumption kWh/100 km',
    homeElectricityPrice: 'Home electricity \u20ac/kWh',
    publicElectricityPrice: 'Public charge rate \u20ac/kWh',
    homeChargingShare: 'Home charging share',
    ereTitle: 'ERE allowance (Home Energy Reimbursement)',
    ereEnabled: 'ERE active',
    ereCreditPerKwh: 'ERE credit \u20ac/kWh',
    ereEligibleShare: 'ERE eligible share',
    ereMonthlyFee: 'ERE fixed fee p/m',
    listPrice: 'List price (incl. VAT)',
    employeeContribution: 'Employee contribution p/m',
    additionalTaxRate: 'Benefit-in-kind rate (up to cap)',
    additionalTaxRateAboveCap: 'Benefit-in-kind rate (above cap)',
    additionalTaxCap: 'Benefit-in-kind cap (\u20ac)',
    chargingCoveredByEmployer: 'Charging covered by employer',
    alsoReceiveMobilityBudget: 'Also receive mobility budget',
    purchasePrice: 'EV purchase price (\u20ac)',
    downPayment: 'Down payment (\u20ac)',
    financingEnabled: 'Financing active',
    apr: 'APR (annual rate)',
    financingMonths: 'Financing term (months)',
    residualValueMode: 'Residual value mode',
    residualValueModePercent: 'Percentage',
    residualValueModeAmount: 'Amount',
    residualValuePercent: 'Residual value',
    residualValueAmount: 'Residual value (\u20ac)',
    insurancePerMonth: 'Insurance p/m (\u20ac)',
    mrbPerMonth: 'Road tax p/m (\u20ac)',
    maintenancePerMonth: 'Maintenance p/m (\u20ac)',
    chargingStationCost: 'Home charger one-off (\u20ac)',
    chargingStationDepMonths: 'Charger depreciation (months)',
    privateLeaseCost: 'Private lease p/m (\u20ac)',
    includedKmPerYear: 'Included km/year',
    extraKmPrice: 'Extra km price (\u20ac/km)',
    includesInsurance: 'Insurance included',
    includesMrb: 'Road tax included',
    includesMaintenance: 'Maintenance included',
  },
  hints: {
    marginalTaxRate: "The rate at which your last euro of income is taxed. Check your payslip for 'tax rate' or 'bracket'. Thresholds are for 2026.",
    mobilityBudgetAmount: 'Employment contract or employer policy \u2014 gross amount per month.',
    mobilityBudgetMode: 'Gross is before income tax. Net is the take-home amount.',
    taxFreeAllowanceEnabled: 'Tax authority \u2014 standard max \u20ac0.23/km (2026). Check your HR policy or employment contract.',
    taxFreeAllowancePerKm: 'Tax authority \u2014 fixed rate \u20ac0.23/km for 2026.',
    reimbursableKmPerYear: 'HR policy or employment contract \u2014 total km eligible for reimbursement.',
    totalKmPerYear: 'Trip log, dashboard or HR system \u2014 total km driven in a year.',
    commuteKmPerYear: 'Commute declaration or employment contract \u2014 one-way distance \u00d7 2 \u00d7 working days.',
    businessKmPerYear: 'Trip log or expense claims \u2014 business km excl. commute.',
    kwhPer100Km: 'WLTP specs on the dealer\u2019s website or BOVAG \u2014 real-world use is typically 10\u201320% above WLTP.',
    homeElectricityPrice: 'Energy bill or supplier portal \u2014 use your current variable rate.',
    publicElectricityPrice: 'Charge session history (e.g. Allego, Fastned, Shell Recharge) \u2014 average rate per kWh.',
    ereEnabled: 'Home Energy Reimbursement \u2014 employer agreement or CLA. Compensation for home charging costs.',
    ereCreditPerKwh: 'Employer agreement or grid operator statement \u2014 typically ~\u20ac0.08/kWh.',
    ereEligibleShare: 'Employer agreement \u2014 share of home-charged km eligible for reimbursement. Default ~90%.',
    ereMonthlyFee: 'Employer agreement or payslip \u2014 fixed admin fee per month.',
    listPrice: 'Lease quote or RDC catalogue \u2014 new price incl. VAT and options.',
    employeeContribution: 'Lease contract or payslip \u2014 net monthly amount you personally contribute.',
    additionalTaxRate: 'Tax authority \u2014 16% for full EV (2026) on the first \u20ac30,000 of list price.',
    additionalTaxRateAboveCap: 'Tax authority \u2014 22% on the portion of list price above the cap.',
    additionalTaxCap: 'Tax authority Payroll Tax Handbook \u2014 \u20ac30,000 in 2026.',
    chargingCoveredByEmployer: 'Lease contract or employer policy \u2014 check whether charge card and costs are included.',
    alsoReceiveMobilityBudget: 'Employer policy \u2014 some employers offer a mobility budget alongside the company car.',
    purchasePrice: 'Dealer quote, configurator or BOVAG list price \u2014 new price incl. VAT.',
    downPayment: 'Finance quote or savings overview \u2014 your own contribution at purchase.',
    financingEnabled: 'Check if you are financing part or all of the car via a loan.',
    apr: 'Finance quote \u2014 annual percentage rate (APR). Typically 4\u20138% for car finance.',
    financingMonths: 'Finance quote \u2014 loan term in months.',
    residualValuePercent: 'Finance quote or ANWB residual value guide \u2014 expected residual value as % of purchase price.',
    residualValueAmount: 'Finance quote or ANWB residual value guide \u2014 expected amount at sale/trade-in.',
    insurancePerMonth: 'Insurance policy (third-party + comprehensive) \u2014 annual premium divided by 12.',
    mrbPerMonth: 'Tax authority road tax calculator \u2014 electric cars pay quarter rate (25%) in 2026.',
    maintenancePerMonth: 'Dealer maintenance package or estimate \u2014 EVs average \u20ac60\u2013100/month.',
    chargingStationCost: 'Home charger installation quote \u2014 incl. installation typically \u20ac800\u20131,500.',
    chargingStationDepMonths: 'Use the comparison duration as a guide, or the expected useful life.',
    privateLeaseCost: 'Private lease quote \u2014 all-in monthly amount. Check what is and isn\u2019t included.',
    includedKmPerYear: 'Private lease contract \u2014 km per year with no surcharge.',
    extraKmPrice: 'Private lease contract \u2014 rate per extra km above the included amount.',
    includesInsurance: 'Private lease quote \u2014 check the coverage summary (third-party + comprehensive).',
    includesMrb: 'Private lease quote \u2014 road tax (motorrijtuigenbelasting).',
    includesMaintenance: 'Private lease quote \u2014 servicing and tyres.',
  },
  scenarios: {
    A: 'A \u00b7 Company Lease EV',
    B: 'B \u00b7 Mobility Budget + Own EV',
    C: 'C \u00b7 Mobility Budget + Private Lease EV',
  },
  breakdown: {
    bijtelling_tax: 'Benefit-in-kind tax',
    employee_contribution: 'Employee contribution',
    charging_cost_lease: 'Charging cost (if not covered)',
    mobility_budget_optional: 'Mobility budget (optional)',
    depreciation: 'Vehicle depreciation',
    financing: 'Financing (interest + repayment)',
    insurance: 'Insurance',
    mrb: 'Road tax',
    maintenance: 'Maintenance',
    charging_cost: 'Charging cost (home/public)',
    station_depreciation: 'Home charger depreciation',
    ere_credit: 'ERE credit (incl. fee)',
    mobility_budget_net: 'Mobility budget (net)',
    km_allowance: 'Tax-free km allowance',
    lease_monthly: 'Private lease monthly cost',
    extra_km_cost: 'Extra km cost',
    insurance_not_included: 'Insurance (not included)',
    mrb_not_included: 'Road tax (not included)',
    maintenance_not_included: 'Maintenance (not included)',
  },
  errors: {
    err_km_exceeds_total: 'Commute + business km exceeds total',
    err_downpayment_exceeds_price: 'Must be less than the purchase price',
    err_residual_100pct: 'Residual value cannot be 100% or more',
    err_residual_exceeds_price: 'Residual value cannot exceed purchase price',
    err_financing_exceeds_horizon: 'Longer than the comparison duration',
  },
};

export const locales: Record<Locale, Translations> = { nl, en };
