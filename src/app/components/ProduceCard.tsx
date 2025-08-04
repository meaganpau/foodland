'use client';

import React from 'react';
import { ProduceItem } from '@/types/produce';
import { getMonthNumber, getMonthShortName } from '@/app/helper';
import Image from 'next/image';

import '@/app/styles/ProduceCard.scss';

interface ProduceCardProps {
  produce: ProduceItem;
  className?: string;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce, className = '' }) => {
  const formatAvailability = (availability: string[]) => {
    return availability
      .map(getMonthNumber)
      .sort((a, b) => a - b)
      .map(getMonthShortName)
      .join(', ')
  };
  // nextjs public image url
  const imageUrl = `/new/${produce.name.split('(')[0].trim().replace(/\s+/g, '-')}.png`;

  return (
    <div className={`produceCard ${className}`}>
      <div className='cardContent'>
        <div className='cardHeader'>
          <div className='titleSection'>
            <div className='titleInfo'>
              <Image src={imageUrl} alt={produce.name} width={100} height={100} />
              <h3>{produce.name}</h3>
            </div>
          </div>
        </div>
        <div className='availabilitySection'>
          <h4>Available Months</h4>
          <div className='availabilityContent'>
            <p>
              {produce.is_year_round ? 'All year' : produce.available_months?.length ? formatAvailability(produce.available_months) : 'No availability data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduceCard; 