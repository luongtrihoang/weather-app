'use client';

import React from 'react';
import { WeatherData, SearchHistoryItem } from '@/types/weather';
import styles from './WeatherDisplay.module.scss';
import Image from 'next/image';
import SearchHistory from '../search_history/SearchHistory';
import { format } from 'date-fns';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  isLoading?: boolean;
  error?: string;
  searchHistory?: SearchHistoryItem[];
  onSearchFromHistory?: (item: SearchHistoryItem) => void;
  onDeleteFromHistory?: (id: string) => void;
  isHistoryLoading?: boolean;
  getWeatherIcon: (iconCode: string) => string;
  formatTemperature: (temp: number) => string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weatherData, 
  isLoading = false, 
  error,
  searchHistory = [],
  onSearchFromHistory,
  onDeleteFromHistory,
  isHistoryLoading = false,
  getWeatherIcon,
  formatTemperature
}) => {
  const getLocalWeatherIcon = (iconCode: string, weatherMain: string) => {
    // Use local icons for common weather conditions
    if (weatherMain.toLowerCase().includes('cloud')) {
      return '/cloud.png';
    }
    if (weatherMain.toLowerCase().includes('clear') || weatherMain.toLowerCase().includes('sun')) {
      return '/sun.png';
    }
    // Fallback to OpenWeatherMap icons
    return getWeatherIcon(iconCode);
  };
  if (isLoading) {
    return (
      <div className={`card ${styles.weatherCard}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Getting weather information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card ${styles.weatherCard} ${styles.errorCard}`}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={`card ${styles.weatherCard} ${styles.emptyCard}`}>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>🌤️</div>
          <h3>Search for a city</h3>
          <p>Enter a city name to get current weather information</p>
        </div>
      </div>
    );
  }

  const currentWeather = weatherData.weather[0];
  const temperature = formatTemperature(weatherData.main.temp);
  const highTemp = formatTemperature(weatherData.main.temp_max);
  const lowTemp = formatTemperature(weatherData.main.temp_min);
  const formattedDate = format(weatherData.dt, 'dd-MM-yyyy HH:mm\'am\'');
  const weatherIconSrc = getLocalWeatherIcon(currentWeather.icon, currentWeather.main);
  
  return (
    <div className={`${styles.weatherCard} animate-fadeIn`}>
      <div className={styles.weatherHeader}>
        <h2 className={styles.todayLabel}>Today&apos;s Weather</h2>
      </div>

      <Image 
        src={weatherIconSrc}
        alt={currentWeather.description}
        className={styles.weatherIcon}
        width={281}
        height={251}
        />
      
      <div className={styles.weatherContent}>
        <div className={styles.temperatureSection}>
          <div className={styles.mainTemp}>{temperature}</div>
          <div className={styles.tempDetails}>
            <span>H: {highTemp}</span>
            <span>L: {lowTemp}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.weatherInfo}>
        <div className={styles.locationDate}>
          <span className={styles.location}>
            {weatherData.name}, {weatherData.sys.country}
          </span>
          <span className={styles.date}>{formattedDate}</span>
          <span className={styles.conditionLabel}>Humidity: {weatherData.main.humidity}%</span>
          <span className={`${styles.conditionLabel} ${styles.conditionLabelMain}`}>{currentWeather.main}</span>
        </div>
      </div>

      {/* Search History Section */}
      <SearchHistory
        history={searchHistory}
        onSearchFromHistory={onSearchFromHistory || (() => {})}
        onDeleteFromHistory={onDeleteFromHistory || (() => {})}
        isLoading={isHistoryLoading}
      />  
    </div>
  );
};

export default WeatherDisplay; 