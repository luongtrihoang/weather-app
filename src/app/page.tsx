'use client';

import React from 'react';
import SearchBar from '@/components/search_bar/SearchBar';
import WeatherDisplay from '@/components/weather_display/WeatherDisplay';
import ThemeToggle from '@/components/theme_toggle/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useWeather } from '@/hooks/useWeather';
import styles from './page.module.scss';

const WeatherApp: React.FC = () => {
  const {
    weatherData,
    searchHistory,
    isLoading,
    error,
    handleSearch,
    handleSearchFromHistory,
    handleDeleteFromHistory,
    getWeatherIcon,
    formatTemperature
  } = useWeather();

  return (
    <div className={styles.app}>
      <div className={styles.mainCard}>
          <SearchBar 
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          <WeatherDisplay
            weatherData={weatherData}
            isLoading={isLoading}
            error={error}
            searchHistory={searchHistory}
            onSearchFromHistory={handleSearchFromHistory}
            onDeleteFromHistory={handleDeleteFromHistory}
            isHistoryLoading={isLoading}
            getWeatherIcon={getWeatherIcon}
            formatTemperature={formatTemperature}
          />
      </div>
      
      <ThemeToggle />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  );
};

export default App;
