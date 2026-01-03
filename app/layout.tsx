import type { Metadata } from 'next';
import { Inter, Fredoka } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });
const fredoka = Fredoka({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600'],
  variable: '--font-fredoka' 
});

export const metadata: Metadata = {
  title: "McDonald's Clone - Order Food Online",
  description: "Order your favorite McDonald's meals online",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/icon.png',
  },
  openGraph: {
    title: "McDonald's Clone - Order Food Online",
    description: "Order your favorite McDonald's meals online",
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: "McDonald's Clone",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "McDonald's Clone - Order Food Online",
    description: "Order your favorite McDonald's meals online",
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${fredoka.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

