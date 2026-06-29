import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { WebSocketProvider } from '@/providers/WebSocketProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConnectionStatus } from '@/components/status/ConnectionStatus';
import './globals.css';

export const metadata: Metadata = {
  title: 'GameEdge e-Sports | Premium Gaming Cafe',
  description: 'The ultimate gaming cafe experience. Book premium gaming stations, play the latest titles, and join a community of passionate gamers.',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-gameedge-dark-900 text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>
            <WebSocketProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <ConnectionStatus />
              </div>
            </WebSocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
