import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import QueryProvider from '@/providers/query-provider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { MobileSearchModal } from '@/components/search/MobileSearchModal';
import { AuthPromptModal } from '@/components/auth/AuthPromptModal';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'RailTrack — Live Indian Train Tracker',
  description:
    'Experience train tracking redefined. Real-time Indian Railways tracking with interactive vector maps, delay analytics, weather intelligence, and terrain insights.',
  keywords: ['train tracking', 'RailTrack', 'live train status', 'Indian Railways', 'train map', 'IRCTC train'],
  authors: [{ name: 'RailTrack' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RailTrack',
  },
  openGraph: {
    title: 'RailTrack — Live Indian Train Tracker',
    description: 'Real-time train tracking with interactive maps and delay analytics.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://api.railradar.in" />
        <link rel="preconnect" href="https://api.maptiler.com" />
        <link rel="preconnect" href="https://api.openweathermap.org" />
      </head>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <QueryProvider>
          <Navbar />
          <main className="flex-1 px-4 pt-2 sm:pt-6 pb-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <MobileSearchModal />
          <AuthPromptModal />
        </QueryProvider>
      </body>
    </html>
  );
}
