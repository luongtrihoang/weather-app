'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load theme from localStorage on component mount
    try {
      const savedTheme = localStorage.getItem('weather-app-theme') as Theme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.body.className = savedTheme;
      } else {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        document.body.className = initialTheme;
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      document.body.className = 'light';
    }

    return () => {
      document.body.className = 'light';
    }
  }, []);

  useEffect(() => {
    // Update body class and localStorage when theme changes
    try {
      document.body.className = theme;
      localStorage.setItem('weather-app-theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }

    return () => {
      document.body.className = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 