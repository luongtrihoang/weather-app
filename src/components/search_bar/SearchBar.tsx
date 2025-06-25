'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch: (city: string, country?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading = false, 
  placeholder = "Enter city name (e.g., Singapore)" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !isLoading) {
      // Parse city and country if comma-separated
      const parts = searchTerm.split(',').map(part => part.trim());
      const city = parts[0];
      const country = parts[1];
      
      onSearch(city, country);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className={`input ${styles.searchInput}`}
          disabled={isLoading}
          aria-label="Search for city weather"
        />
        <button
          type="submit"
          className={`btn ${styles.searchButton}`}
          disabled={isLoading || !searchTerm.trim()}
          aria-label={isLoading ? "Searching..." : "Search weather"}
        >
          {isLoading ? (
            <div className={styles.spinner} />
          ) : (
            <Search size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 