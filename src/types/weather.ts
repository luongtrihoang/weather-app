export interface WeatherData {
  id: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  cod: number;
}

export interface SearchHistoryItem {
  id: string;
  city: string;
  country: string;
  timestamp: Date;
  weatherData?: WeatherData;
}

export interface WeatherError {
  message: string;
  code: string;
} 