type ResultCardProps = {
  title: string;
  value: number;
  highlighted?: boolean;
};

export function ResultCard({ title, value, highlighted = false }: ResultCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 shadow-sm transition ${
        highlighted ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'
      }`}
    >
      <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-slate-900">€ {value.toFixed(2)}</p>
    </article>
  );
}
