import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SubSentry',
  description: 'Merchant-locked virtual cards for subscription control.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
