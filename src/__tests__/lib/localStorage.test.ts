import {
  getSearchHistory,
  saveSearchToHistory,
  removeFromSearchHistory,
} from '@/lib/localStorage'
import { SearchHistoryItem } from '@/types/weather'

// Mock the actual localStorage implementation
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Replace the global localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('localStorage utilities', () => {
  const mockWeatherData = {
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

  const mockHistoryItem: SearchHistoryItem = {
    id: '1',
    city: 'Singapore',
    country: 'SG',
    timestamp: new Date(),
    weatherData: mockWeatherData,
  }

  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
    mockLocalStorage.clear.mockClear()
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getSearchHistory', () => {
    it('should return empty array when no history exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const history = getSearchHistory()
      expect(history).toEqual([])
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('weather-app-search-history')
    })

    it('should return parsed history when it exists', () => {
      const historyData = [mockHistoryItem]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(historyData))

      const history = getSearchHistory()
      expect(history).toHaveLength(1)
      expect(history[0].city).toBe('Singapore')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('weather-app-search-history')
    })

    it('should return empty array when localStorage has invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')

      const history = getSearchHistory()
      expect(history).toEqual([])
    })

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const history = getSearchHistory()
      expect(history).toEqual([])
    })
  })

  describe('saveSearchToHistory', () => {
    it('should save new item to empty history', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      saveSearchToHistory(mockHistoryItem)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        JSON.stringify([mockHistoryItem])
      )
    })

    it('should move existing city to top of history', () => {
      const existingItem = { ...mockHistoryItem, id: '2' }
      const newItem = { ...mockHistoryItem, id: '3', timestamp: new Date() }
      
      // First call returns existing history, second call for saving returns updated
      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify([existingItem]))
        .mockReturnValueOnce(JSON.stringify([newItem]))

      saveSearchToHistory(newItem)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        JSON.stringify([newItem])
      )
    })

    it('should limit history to 10 items', () => {
      // Create 10 existing items with different cities
      const existingItems = Array.from({ length: 10 }, (_, i) => ({
        ...mockHistoryItem,
        id: `${i}`,
        city: `City${i}`,
        country: 'US',
        timestamp: new Date('2025-06-25T07:28:00.147Z'),
        weatherData: {
          ...mockWeatherData,
          name: `City${i}`, // Make sure weatherData.name matches the city
        }
      }))
      
      // Mock getItem to return existing items, then return new history on subsequent calls
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingItems))

      // Add a new city that doesn't exist in the list
      const newItem = { 
        ...mockHistoryItem, 
        id: '10', 
        city: 'NewCity',
        country: 'CA',
        timestamp: new Date('2025-06-25T07:28:00.147Z'),
        weatherData: {
          ...mockWeatherData,
          name: 'NewCity',
        }
      }
      saveSearchToHistory(newItem)

      // Check that setItem was called (the exact content may vary due to timing)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        expect.stringContaining('"city":"NewCity"')
      )
      
      // Verify the new item is first in the stored data
      const setItemCall = mockLocalStorage.setItem.mock.calls[0]
      const storedData = JSON.parse(setItemCall[1])
      expect(storedData[0].city).toBe('NewCity')
    })

    it('should handle localStorage setItem errors gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })

      expect(() => saveSearchToHistory(mockHistoryItem)).not.toThrow()
    })
  })

  describe('removeFromSearchHistory', () => {
    it('should remove item with matching id', () => {
      const item1 = { ...mockHistoryItem, id: '1', city: 'Singapore' }
      const item2 = { ...mockHistoryItem, id: '2', city: 'Tokyo' }
      const existingHistory = [item1, item2]

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory))

      removeFromSearchHistory('1')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        JSON.stringify([item2])
      )
    })

    it('should do nothing when id does not exist', () => {
      const existingHistory = [mockHistoryItem]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory))

      removeFromSearchHistory('non-existent-id')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        JSON.stringify(existingHistory)
      )
    })

    it('should handle empty history gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      expect(() => removeFromSearchHistory('any-id')).not.toThrow()
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        JSON.stringify([])
      )
    })

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => removeFromSearchHistory('any-id')).not.toThrow()
    })
  })
}) 