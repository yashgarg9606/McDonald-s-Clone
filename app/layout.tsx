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
  openGraph: {
    title: "McDonald's Clone - Order Food Online",
    description: "Order your favorite McDonald's meals online",
    type: 'website',
    // Next.js will automatically use app/opengraph-image.png if it exists
  },
  twitter: {
    card: 'summary_large_image',
    title: "McDonald's Clone - Order Food Online",
    description: "Order your favorite McDonald's meals online",
    // Next.js will automatically use app/twitter-image.png if it exists
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

