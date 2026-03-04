import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mobiliteitskeuze Rekentool',
  description: 'Vergelijk lease EV, mobiliteitsbudget + eigen EV, of private lease EV.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
