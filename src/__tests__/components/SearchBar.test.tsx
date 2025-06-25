import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/components/search_bar/SearchBar'

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    expect(screen.getByRole('textbox')).toBeTruthy()
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Enter city name'
    render(<SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />)

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeTruthy()
  })

  it('calls onSearch when form is submitted with city name', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Singapore' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockOnSearch).toHaveBeenCalledWith('Singapore', undefined)
  })

  it('calls onSearch with city and country when comma-separated', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Singapore, SG' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockOnSearch).toHaveBeenCalledWith('Singapore', 'SG')
  })

  it('does not call onSearch with empty input', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.submit(input.closest('form')!)

    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('shows loading state when isLoading is true', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />)

    const input = screen.getByRole('textbox')
    expect((input as HTMLInputElement).disabled).toBe(true)
  })
}) 