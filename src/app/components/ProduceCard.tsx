'use client';

import React, { useState } from 'react';
import { ProduceItem } from '@/types/produce';
import { getMonthNumber, getMonthShortName } from '@/app/helper';
import Image from 'next/image';
import { CalendarIcon } from './Icons';

import '@/app/styles/ProduceCard.scss';

interface ProduceCardProps {
  produce: ProduceItem;
  className?: string;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const formatAvailability = (availability: string[]) => {
    return availability
      .map(getMonthNumber)
      .sort((a, b) => a - b)
      .map(getMonthShortName)
      .join(', ')
  };
  
  // Generate image URL by cleaning the produce name
  const generateImageUrl = (produceName: string) => {
    // Remove parentheses and their contents, trim whitespace, convert to lowercase, replace spaces with hyphens
    const cleanName = produceName
      .split('(')[0] // Remove everything after first parenthesis
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    return `/new/${cleanName}.png`;
  };

  const imageUrl = generateImageUrl(produce.name);

  return (
    <div className={`produceCard ${className}`}>
      <div className='cardContent'>
        <div className='cardHeader'>
          <div className='titleSection'>
            <div className='titleInfo'>
              <Image 
                src={imageError ? '/logo.png' : imageUrl} 
                alt={produce.name} 
                width={100} 
                height={100}
                onError={() => setImageError(true)}
              />
              <h3>{produce.name}</h3>
            </div>
          </div>
        </div>
        <div className='availabilitySection'>
          <h4>Available Months</h4>
          <div className='availabilityContent'>
          <CalendarIcon width={14} height={14} className="calendar-icon" />
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