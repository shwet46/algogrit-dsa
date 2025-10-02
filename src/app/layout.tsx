import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/authContext';
import LayoutContent from './LayoutContent';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AlgoGrit',
  description: 'Master coding with smart tools — developed by SB',
  keywords: [
    'DSA',
    'Coding',
    'AlgoGrit',
    'LeetCode',
    'Programming',
    'Interview Prep',
  ],
  authors: [{ name: 'SB' }],
  openGraph: {
    title: 'AlgoGrit',
    description: 'DSA practice platform',
    url: 'https://algogrit-dsa.by-sb.live', 
    siteName: 'AlgoGrit',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-black text-white`}
      >
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
