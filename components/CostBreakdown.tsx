import { MobilityResult } from '@/types';

type CostBreakdownProps = {
  result: MobilityResult;
};

export function CostBreakdown({ result }: CostBreakdownProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Conclusie</h2>
      <p className="mt-2 text-slate-700">
        Op basis van de huidige invoer is <strong>{result.bestOption}</strong> de voordeligste keuze.
      </p>
    </section>
  );
}
