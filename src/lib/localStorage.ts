import { SearchHistoryItem } from '@/types/weather';

const STORAGE_KEY = 'weather-app-search-history';

export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((item: SearchHistoryItem & { timestamp: string }) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

export const saveSearchToHistory = (item: SearchHistoryItem): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getSearchHistory();
    
    // Remove existing entry with same city if it exists
    const filtered = history.filter(h => h.city.toLowerCase() !== item.city.toLowerCase());
    
    // Add new entry at the beginning
    const newHistory = [item, ...filtered].slice(0, 10); // Keep only last 10 searches
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

export const removeFromSearchHistory = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getSearchHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
};

export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}; 