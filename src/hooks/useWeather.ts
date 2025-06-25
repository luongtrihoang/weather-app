'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { WeatherData, SearchHistoryItem } from '@/types/weather';
import { 
  getSearchHistory, 
  saveSearchToHistory, 
  removeFromSearchHistory 
} from '@/lib/localStorage';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

class WeatherApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // API function to fetch weather data
  const fetchWeatherData = useCallback(async (city: string, country?: string): Promise<WeatherData> => {
    try {
      const query = country ? `${city},${country}` : city;
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          q: query,
          appid: API_KEY,
          units: 'metric'
        }
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new WeatherApiError('NOT_FOUND', 'City not found. Please check again.');
        } else if (error.response.status === 401) {
          throw new WeatherApiError('UNAUTHORIZED', 'API key is invalid or missing.');
        } else if (error.response.status === 429) {
          throw new WeatherApiError('RATE_LIMIT', 'Too many requests. Please try again later.');
        }
      }
      throw new WeatherApiError('UNKNOWN', 'Failed to fetch weather data. Please try again.');
    }
  }, []);

  // Utility functions
  const getWeatherIcon = useCallback((iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }, []);

  const formatTemperature = useCallback((temp: number): string => {
    return `${Math.round(temp)}°`;
  }, []);

  // Load search history on component mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleSearch = useCallback(async (city: string, country?: string) => {
    if (!city.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchWeatherData(city, country);
      setWeatherData(data);

      // Save to search history
      const historyItem: SearchHistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        city: data.name,
        country: data.sys.country,
        timestamp: new Date(),
        weatherData: data
      };

      saveSearchToHistory(historyItem);
      setSearchHistory(getSearchHistory());

    } catch (err) {
      if (err instanceof WeatherApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeatherData]);

  const handleSearchFromHistory = useCallback((item: SearchHistoryItem) => {
    handleSearch(item.city, item.country);
  }, [handleSearch]);

  const handleDeleteFromHistory = useCallback((id: string) => {
    removeFromSearchHistory(id);
    setSearchHistory(getSearchHistory());
  }, []);

  return {
    weatherData,
    searchHistory,
    isLoading,
    error,
    handleSearch,
    handleSearchFromHistory,
    handleDeleteFromHistory,
    getWeatherIcon,
    formatTemperature
  };
}; 