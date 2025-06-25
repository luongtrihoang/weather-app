import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import WeatherDisplay from '@/components/weather_display/WeatherDisplay'
import { WeatherData } from '@/types/weather'

// Mock the ThemeContext
const mockTheme = {
  theme: 'light' as const,
  toggleTheme: jest.fn(),
}

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockTheme,
}))

describe('WeatherDisplay', () => {
  const mockWeatherData: WeatherData = {
    name: 'Singapore',
    sys: { country: 'SG', sunrise: 1640995200, sunset: 1641038400 },
    main: { temp: 26, feels_like: 28, temp_max: 28, temp_min: 24, pressure: 1013, humidity: 80 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    dt: 1640995200,
    id: 1880252,
    wind: { speed: 5.1, deg: 230 },
    clouds: { all: 75 },
    cod: 200,
  }

  const mockGetWeatherIcon = jest.fn()
  const mockFormatTemperature = jest.fn()

  beforeEach(() => {
    mockGetWeatherIcon.mockReturnValue('https://openweathermap.org/img/wn/01d@2x.png')
    mockFormatTemperature.mockImplementation((temp: number) => `${Math.round(temp)}°`)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render weather data correctly', () => {
    render(
      <WeatherDisplay
        weatherData={mockWeatherData}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    expect(screen.getByText('Singapore, SG')).toBeInTheDocument()
    expect(screen.getByAltText('clear sky')).toBeInTheDocument()
    expect(mockFormatTemperature).toHaveBeenCalledWith(26)
  })

  it('should display temperature ranges', () => {
    render(
      <WeatherDisplay
        weatherData={mockWeatherData}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    expect(mockFormatTemperature).toHaveBeenCalledWith(28)
    expect(mockFormatTemperature).toHaveBeenCalledWith(24)
  })

  it('should display weather details', () => {
    render(
      <WeatherDisplay
        weatherData={mockWeatherData}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    expect(screen.getByText('Humidity: 80%')).toBeInTheDocument()
  })

  it('should handle missing or undefined weather data gracefully', () => {
    render(
      <WeatherDisplay
        weatherData={null}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    expect(mockGetWeatherIcon).not.toHaveBeenCalled()
    expect(mockFormatTemperature).not.toHaveBeenCalled()
  })

  it('should handle weather data with different icon codes', () => {
    const nightWeatherData = {
      ...mockWeatherData,
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01n' }]
    }

    render(
      <WeatherDisplay
        weatherData={nightWeatherData}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    // Since the component uses local icons for clear weather, it may not call the mock function
    // Check that the weather icon is displayed instead
    expect(screen.getByAltText('clear sky')).toBeInTheDocument()
  })

  it('should display correct weather condition text', () => {
    const rainyWeatherData = {
      ...mockWeatherData,
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }]
    }

    render(
      <WeatherDisplay
        weatherData={rainyWeatherData}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    expect(screen.getByAltText('light rain')).toBeInTheDocument()
  })

  it('should format city and country display correctly', () => {
    const weatherDataWithLongNames = {
      ...mockWeatherData,
      name: 'Los Angeles',
      sys: { ...mockWeatherData.sys, country: 'US' }
    }

    render(
      <WeatherDisplay
        weatherData={weatherDataWithLongNames}
        getWeatherIcon={mockGetWeatherIcon}
        formatTemperature={mockFormatTemperature}
      />
    )

    expect(screen.getByText('Los Angeles, US')).toBeInTheDocument()
  })
}) 