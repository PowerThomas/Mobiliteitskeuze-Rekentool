import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mobiliteitskeuze Rekentool',
  description: 'Vergelijk lease EV, mobiliteitsbudget + eigen EV, of private lease EV.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        {/* Apply stored theme synchronously before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mkr-theme'),p=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t!=='light'&&p)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
