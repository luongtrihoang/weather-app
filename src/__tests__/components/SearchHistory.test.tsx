import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchHistory from '@/components/search_history/SearchHistory'
import { SearchHistoryItem } from '@/types/weather'

// Mock the ThemeContext
const mockTheme = {
  theme: 'light' as const,
  toggleTheme: jest.fn(),
}

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockTheme,
}))

describe('SearchHistory', () => {
  const mockSearchHistory: SearchHistoryItem[] = [
    {
      id: '1',
      city: 'Singapore',
      country: 'SG',
      timestamp: new Date('2023-01-01T12:00:00Z'),
      weatherData: {
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
    },
    {
      id: '2',
      city: 'Tokyo',
      country: 'JP',
      timestamp: new Date('2023-01-01T10:00:00Z'),
      weatherData: {
        name: 'Tokyo',
        sys: { country: 'JP', sunrise: 1640995200, sunset: 1641038400 },
        main: { temp: 15, feels_like: 16, temp_max: 18, temp_min: 12, pressure: 1020, humidity: 65 },
        weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
        dt: 1640995200,
        id: 1850147,
        wind: { speed: 3.2, deg: 180 },
        clouds: { all: 20 },
        cod: 200,
      }
    }
  ]

  const mockOnSearchFromHistory = jest.fn()
  const mockOnDeleteFromHistory = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render search history items', () => {
    render(
      <SearchHistory
        history={mockSearchHistory}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
      />
    )

    expect(screen.getByText('Singapore, SG')).toBeInTheDocument()
    expect(screen.getByText('Tokyo, JP')).toBeInTheDocument()
  })

  it('should call onSearchFromHistory when search button is clicked', () => {
    render(
      <SearchHistory
        history={mockSearchHistory}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
      />
    )

    const searchButtons = screen.getAllByTitle('Search again')
    fireEvent.click(searchButtons[0])

    expect(mockOnSearchFromHistory).toHaveBeenCalledWith(mockSearchHistory[0])
  })

  it('should call onDeleteFromHistory when delete button is clicked', () => {
    render(
      <SearchHistory
        history={mockSearchHistory}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
      />
    )

    const deleteButtons = screen.getAllByTitle('Delete from history')
    fireEvent.click(deleteButtons[0])

    expect(mockOnDeleteFromHistory).toHaveBeenCalledWith('1')
  })

  it('should render empty state when no search history', () => {
    render(
      <SearchHistory
        history={[]}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
      />
    )

    expect(screen.getByText('No search history yet')).toBeInTheDocument()
    expect(screen.getByText('Your recent searches will appear here')).toBeInTheDocument()
    expect(screen.queryByText('Singapore, SG')).not.toBeInTheDocument()
  })

  it('should display timestamps for history items', () => {
    render(
      <SearchHistory
        history={mockSearchHistory}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
      />
    )

    expect(screen.getByText('01-01-2023 19:00am')).toBeInTheDocument()
    expect(screen.getByText('01-01-2023 17:00am')).toBeInTheDocument()
  })

  it('should handle single item in history', () => {
    const singleItemHistory = [mockSearchHistory[0]]
    
    render(
      <SearchHistory
        history={singleItemHistory}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
      />
    )

    expect(screen.getByText('Singapore, SG')).toBeInTheDocument()
    expect(screen.queryByText('Tokyo, JP')).not.toBeInTheDocument()
  })

  it('should disable buttons when loading', () => {
    render(
      <SearchHistory
        history={mockSearchHistory}
        onSearchFromHistory={mockOnSearchFromHistory}
        onDeleteFromHistory={mockOnDeleteFromHistory}
        isLoading={true}
      />
    )

    const searchButtons = screen.getAllByTitle('Search again')
    const deleteButtons = screen.getAllByTitle('Delete from history')
    
    searchButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
    
    deleteButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })
}) 