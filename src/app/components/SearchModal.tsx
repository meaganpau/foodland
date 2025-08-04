'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchProduceItems } from '@/app/lib/db';
import { ProduceItem } from '@/types/produce';
import ProduceCard from './ProduceCard';
import { SearchIcon, CloseIcon } from './Icons';
import '@/app/styles/SearchModal.scss';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProduceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setIsLoading(false);
    onClose();
  }, [onClose]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  useEffect(() => {
    if (searchTerm.trim().length < 1) {
      setIsLoading(false);
      setSearchResults([]);
      return;
    }
    setIsLoading(true);

    const searchProduce = async () => {
      if (searchTerm.trim().length < 1) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await searchProduceItems(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProduce, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={handleClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <div className="search-input-container">
            <SearchIcon className="search-icon" width={20} height={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for produce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleClose} className="close-button">
              <CloseIcon width={20} height={20} />
            </button>
          </div>
        </div>
        
        <div className="search-content">
          {isLoading ? (
            <div className="search-loading">
              <p>Searching...</p>
            </div>
          ) : searchTerm.trim().length >= 1 && searchResults.length > 0 ? (
            <div className="search-results">
              <h3 className='search-results-title'>Search Results ({searchResults.length})</h3>
              <div className="search-results-grid">
                {searchResults.map((produce) => (
                  <ProduceCard key={produce.id} produce={produce} />
                ))}
              </div>
            </div>
          ) : searchTerm.trim().length >= 1 && searchResults.length === 0 ? (
            <div className="no-results">
              <p>No produce found matching &quot;{searchTerm}&quot;</p>
            </div>
          ) : (
            <div className="search-hint">
              <p>Start typing to search for produce...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 