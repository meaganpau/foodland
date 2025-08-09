import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import '@/app/styles/global.scss';

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Ripe - Seasonal Produce Guide | Ontario",
  description: "Discover what's in season in Ontario. Find fresh, local produce at its peak with our comprehensive seasonal produce guide. Support local farmers and enjoy the best flavors.",
  keywords: ["seasonal produce", "Ontario", "local food", "fresh vegetables", "seasonal fruits", "farm to table", "what's in season", "produce guide"],
  metadataBase: new URL('https://ripe.meaganpau.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://ripe.meaganpau.com',
    title: 'Ripe - Seasonal Produce Guide | Ontario',
    description: 'Discover what\'s in season in Ontario. Find fresh, local produce at its peak with our comprehensive seasonal produce guide.',
    siteName: 'Ripe',
    images: [
      {
        url: 'https://ripe.meaganpau.com/logo.png',
        width: 450,
        height: 450,
        alt: 'Ripe - Seasonal Produce Guide',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Ripe - Seasonal Produce Guide | Ontario',
    description: 'Discover what\'s in season in Ontario. Find fresh, local produce at its peak.',
    images: ['https://ripe.meaganpau.com/logo.png'],
    creator: '@meaganpau',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className}`}>
        {children}
      </body>
    </html>
  );
}
