'use client';

type Props = {
  text: string;
};

export function Hint({ text }: Props) {
  return (
    <span className="relative inline-flex group/hint">
      <span
        className="flex h-4 w-4 cursor-help select-none items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-[10px] font-bold text-slate-500 dark:text-slate-300"
        tabIndex={0}
        aria-label={`Toelichting: ${text}`}
      >
        i
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-56 -translate-x-1/2 rounded bg-slate-800 dark:bg-slate-950 px-2.5 py-1.5 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover/hint:opacity-100 group-focus-within/hint:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
