import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WordSchool - Gestió d\'Exàmens',
  description: 'Sistema de gestió i correcció d\'exàmens per acadèmia d\'idiomes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

