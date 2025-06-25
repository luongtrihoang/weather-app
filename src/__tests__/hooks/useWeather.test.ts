import { renderHook, act } from '@testing-library/react'
import { useWeather } from '@/hooks/useWeather'
import { WeatherData } from '@/types/weather'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock localStorage utilities
jest.mock('@/lib/localStorage', () => ({
  getSearchHistory: jest.fn(() => []),
  saveSearchToHistory: jest.fn(),
  removeFromSearchHistory: jest.fn(),
}))

describe('useWeather', () => {
  const mockWeatherData: WeatherData = {
    name: 'Singapore',
    sys: { country: 'SG', sunrise: 1640995200, sunset: 1641038400 },
    main: { temp: 26, feels_like: 28, temp_max: 28, temp_min: 24, pressure: 1013, humidity: 80 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    dt: Math.floor(Date.now() / 1000),
    id: 1880252,
    wind: { speed: 5.1, deg: 230 },
    clouds: { all: 75 },
    cod: 200,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.get.mockResolvedValue({
      data: mockWeatherData,
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useWeather())

      expect(result.current.weatherData).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('')
    })
  })

  describe('handleSearch', () => {
    it('should search weather data successfully', async () => {
      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('Singapore')
      })

      expect(result.current.weatherData).toEqual(mockWeatherData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('')
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: 'Singapore',
            appid: 'test_api_key',
            units: 'metric'
          }
        }
      )
    })

    it('should handle city with country', async () => {
      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('Paris', 'FR')
      })

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: 'Paris,FR',
            appid: 'test_api_key',
            units: 'metric'
          }
        }
      )
    })

    it('should set loading state during search', async () => {
      const { result } = renderHook(() => useWeather())

      let resolvePromise: (value: { data: WeatherData }) => void
      const controlledPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      mockedAxios.get.mockReturnValue(controlledPromise)

      act(() => {
        result.current.handleSearch('Singapore')
      })

      expect(result.current.isLoading).toBe(true)
      
      await act(async () => {
        resolvePromise({ data: mockWeatherData })
        await controlledPromise
      })
      
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle 404 error (city not found)', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        response: { status: 404 }
      })
      mockedAxios.isAxiosError.mockReturnValue(true)

      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('InvalidCity')
      })

      expect(result.current.weatherData).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('City not found. Please check again.')
    })

    it('should handle 401 error (unauthorized)', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        response: { status: 401 }
      })
      mockedAxios.isAxiosError.mockReturnValue(true)

      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('Singapore')
      })

      expect(result.current.error).toBe('API key is invalid or missing.')
    })

    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'))
      mockedAxios.isAxiosError.mockReturnValue(false)

      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('Singapore')
      })

      expect(result.current.weatherData).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Failed to fetch weather data. Please try again.')
    })

    it('should handle empty city input', async () => {
      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('')
      })

      expect(result.current.weatherData).toBeNull()
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })

    it('should handle whitespace-only city input', async () => {
      const { result } = renderHook(() => useWeather())

      await act(async () => {
        await result.current.handleSearch('   ')
      })

      expect(result.current.weatherData).toBeNull()
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })
  })

  describe('getWeatherIcon', () => {
    it('should return correct OpenWeatherMap icon URL', () => {
      const { result } = renderHook(() => useWeather())
      const icon = result.current.getWeatherIcon('01d')
      expect(icon).toBe('https://openweathermap.org/img/wn/01d@2x.png')
    })

    it('should return correct icon for different weather codes', () => {
      const { result } = renderHook(() => useWeather())
      const iconNight = result.current.getWeatherIcon('01n')
      expect(iconNight).toBe('https://openweathermap.org/img/wn/01n@2x.png')
    })
  })

  describe('formatTemperature', () => {
    it('should format temperature correctly', () => {
      const { result } = renderHook(() => useWeather())
      const temp = result.current.formatTemperature(25.7)
      expect(temp).toBe('26°')
    })

    it('should handle negative temperatures', () => {
      const { result } = renderHook(() => useWeather())
      const temp = result.current.formatTemperature(-5.3)
      expect(temp).toBe('-5°')
    })

    it('should handle zero temperature', () => {
      const { result } = renderHook(() => useWeather())
      const temp = result.current.formatTemperature(0)
      expect(temp).toBe('0°')
    })
  })

  describe('error handling', () => {
    it('should clear previous error when making new successful request', async () => {
      const { result } = renderHook(() => useWeather())

      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))
      mockedAxios.isAxiosError.mockReturnValueOnce(false)
      
      await act(async () => {
        await result.current.handleSearch('InvalidCity')
      })
      expect(result.current.error).toBe('Failed to fetch weather data. Please try again.')

      mockedAxios.get.mockResolvedValueOnce({
        data: mockWeatherData,
      })
      
      await act(async () => {
        await result.current.handleSearch('Singapore')
      })
      expect(result.current.error).toBe('')
      expect(result.current.weatherData).toEqual(mockWeatherData)
    })
  })
}) 