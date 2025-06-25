'use client';

import React from 'react';
import { SearchHistoryItem } from '@/types/weather';
import { Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import styles from './SearchHistory.module.scss';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSearchFromHistory: (item: SearchHistoryItem) => void;
  onDeleteFromHistory: (id: string) => void;
  isLoading?: boolean;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSearchFromHistory,
  onDeleteFromHistory,
  isLoading = false
}) => {
  if (history.length === 0) {
    return (
      <div className={`card ${styles.historyCard}`}>
        <h3 className={styles.historyTitle}>Search History</h3>
        <div className={styles.emptyHistory}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>No search history yet</p>
          <span>Your recent searches will appear here</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.historyCard}`}>
      <h3 className={styles.historyTitle}>Search History</h3>
      <div className={styles.historyList}>
        {history.map((item, index) => (
          <div 
            key={item.id} 
            className={`${styles.historyItem} animate-slideIn`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.historyContent}>
              <div className={styles.locationInfo}>
                <span className={styles.locationName}>
                  {item.city}{item.country ? `, ${item.country}` : ''}
                </span>
                <span className={styles.timestamp}>
                  {format(item.timestamp, 'dd-MM-yyyy HH:mm\'am\'')}
                </span>
              </div>
            </div>
            
            <div className={styles.historyActions}>
              <button
                className={`btn btn-secondary btn-icon ${styles.actionButton}`}
                onClick={() => onSearchFromHistory(item)}
                disabled={isLoading}
                title="Search again"
              >
                <Search size={16} />
              </button>
              <button
                className={`btn btn-secondary btn-icon ${styles.actionButton}`}
                onClick={() => onDeleteFromHistory(item.id)}
                disabled={isLoading}
                title="Delete from history"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory; 