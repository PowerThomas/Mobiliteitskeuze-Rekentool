export const euro = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export const percent = (value: number) => `${(value * 100).toFixed(0)}%`;
