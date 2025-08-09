import type { Metadata } from 'next';
import '@/app/styles/Page.scss';
import Home from '@/app/pages/Home';
import { searchProduceItems, getProduceItemsByMonth } from '@/app/lib/db';

export const metadata: Metadata = {
  title: 'Ripe - Seasonal Produce Guide | Ontario',
  description: 'Discover what\'s in season in Ontario this month. Find fresh, local produce at its peak with our comprehensive seasonal produce guide.',
};

export default async function Page() {
  return (
    <Home 
      searchProduceItems={searchProduceItems}
      getProduceItemsByMonth={getProduceItemsByMonth}
    />
  )
}
