import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import '@/app/styles/global.scss';

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: "Ripe - Seasonal Produce Guide | Ontario",
    template: "%s | Ripe"
  },
  description: "Discover what's in season in Ontario. Find fresh, local produce at its peak with our comprehensive seasonal produce guide. Support local farmers and enjoy the best flavors.",
  keywords: ["seasonal produce", "Ontario", "local food", "fresh vegetables", "seasonal fruits", "farm to table", "what's in season", "produce guide"],
  authors: [{ name: "Meagan Pau" }],
  creator: "Meagan Pau",
  publisher: "Meagan Pau",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ripe - Seasonal Produce Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ripe - Seasonal Produce Guide | Ontario',
    description: 'Discover what\'s in season in Ontario. Find fresh, local produce at its peak.',
    images: ['/logo.png'],
    creator: '@meaganpau',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
