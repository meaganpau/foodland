'use client';

import { getProduceItemsByMonth } from '@/app/lib/db';
import MonthDropdown from '@/app/components/MonthDropdown';
import ProduceCard from '@/app/components/ProduceCard';
import SearchModal from '@/app/components/SearchModal';
import { SearchIcon, LocationIcon } from '@/app/components/Icons';
import { ProduceItem } from '@/types/produce';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
    const currentMonth = new Date().getMonth() + 1;
    const [produceItems, setProduceItems] = useState<ProduceItem[]>([]);
    const [month, setMonth] = useState(currentMonth);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const fetchProduceItems = async (month: number) => {
        const produceItems = await getProduceItemsByMonth(month);
        setProduceItems(produceItems);
    };
    
    useEffect(() => {
        fetchProduceItems(currentMonth);
    }, [currentMonth]);

    useEffect(() => {
        fetchProduceItems(month);
    }, [month]);

    return (
      <main className='container'>
        <div className='content'>
          <header className='header'>
            <div className='logo'>
              <Image src='/logo.png' alt='Ripe - Seasonal Produce Guide' width={24} height={24} />
              <span>Ripe</span>
            </div>
          </header>
          
          <section>
            <div className='title-section'>
              <h1>Seasonal Produce Guide</h1>
              <button 
                className="search-button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search produce"
              >
                <SearchIcon width={18} height={18} />
                <span>Search by produce</span>
              </button>
            </div>
            <p className='description'>
              Discover what&apos;s in season and available throughout the year.<br />
              Support local farmers and enjoy the freshest produce at its peak.
            </p>
          </section>
          
          <section>
            <div className='sub-header'>
              <div className='month-container'>What&apos;s available in <MonthDropdown month={month} setMonth={setMonth} currentMonthSelected={currentMonth === month} /></div>
              <div className='location'>
                <LocationIcon width={16} height={16} />
                Ontario
              </div>
            </div>
      
            {produceItems.length > 0 ? (
              <div className='grid' role="list" aria-label="Seasonal produce items">
                {produceItems.map((produce) => (
                  <ProduceCard key={produce.id} produce={produce} />
                ))}
              </div>
            ) : (
              <div className='emptyState' role="status" aria-live="polite">
                <p>Loading...</p>
              </div>
            )}
          </section>
        </div>
        
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </main>
    );
  }
  