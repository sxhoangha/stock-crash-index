import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import ThemeRegistry from './ThemeRegistry';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Stock Crash Index Dashboard',
  description: 'Real-time stock market KPIs and crash probability score',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
