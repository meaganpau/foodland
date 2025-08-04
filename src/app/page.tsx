import type { Metadata } from 'next';
import '@/app/styles/Page.scss';
import Home from '@/app/pages/Home';

export const metadata: Metadata = {
  title: 'Ripe - Seasonal Produce Guide | Ontario',
  description: 'Discover what\'s in season in Ontario this month. Find fresh, local produce at its peak with our comprehensive seasonal produce guide.',
  openGraph: {
    title: 'Ripe - Seasonal Produce Guide | Ontario',
    description: 'Discover what\'s in season in Ontario this month. Find fresh, local produce at its peak.',
  },
  twitter: {
    title: 'Ripe - Seasonal Produce Guide | Ontario',
    description: 'Discover what\'s in season in Ontario this month. Find fresh, local produce at its peak.',
  },
};

export default async function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Ripe",
            "description": "Seasonal produce guide for Ontario",
            "url": "https://ripe.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ripe.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ripe",
            "url": "https://ripe.com",
            "logo": "https://ripe.com/logo.png",
            "sameAs": [
              "https://twitter.com/ripe"
            ]
          })
        }}
      />
      <Home />
    </>
  )
}
