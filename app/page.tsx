import { CostBreakdown } from '@/components/CostBreakdown';
import { InputSummary } from '@/components/InputSummary';
import { ResultCard } from '@/components/ResultCard';
import { calculateMobilityCosts, defaultInput } from '@/utils/calc';

export default function Home() {
  const result = calculateMobilityCosts(defaultInput);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">Mobiliteitskeuze Rekentool</h1>
        <p className="mt-2 text-slate-600">Direct inzicht in je maandelijkse reiskosten met praktische defaultwaarden.</p>
      </header>

      <InputSummary input={defaultInput} />

      <section className="grid gap-4 md:grid-cols-3">
        <ResultCard title="Auto" value={result.carMonthlyCost} highlighted={result.bestOption === 'Auto'} />
        <ResultCard title="OV" value={result.publicTransportMonthlyCost} highlighted={result.bestOption === 'OV'} />
        <ResultCard title="Fiets" value={result.bikeMonthlyCost} highlighted={result.bestOption === 'Fiets'} />
      </section>

      <CostBreakdown result={result} />
    </main>
  );
}
