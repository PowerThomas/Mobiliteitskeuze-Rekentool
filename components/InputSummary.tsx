import { MobilityInput } from '@/types';

type InputSummaryProps = {
  input: MobilityInput;
};

export function InputSummary({ input }: InputSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Invoer (default)</h2>
      <ul className="space-y-1 text-sm text-slate-700">
        <li>Werkdagen p/m: <strong>{input.workDaysPerMonth}</strong></li>
        <li>Woon-werk afstand p/dag: <strong>{input.commuteKmPerDay} km</strong></li>
        <li>Benzineprijs: <strong>€ {input.fuelPricePerLiter.toFixed(2)}/L</strong></li>
        <li>Verbruik auto: <strong>1 op {input.consumptionKmPerLiter}</strong></li>
        <li>OV-kosten p/dag: <strong>€ {input.publicTransportCostPerDay.toFixed(2)}</strong></li>
        <li>Fiets onderhoud p/m: <strong>€ {input.bikeMaintenancePerMonth.toFixed(2)}</strong></li>
      </ul>
    </section>
  );
}
