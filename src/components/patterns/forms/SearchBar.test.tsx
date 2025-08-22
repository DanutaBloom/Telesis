import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CompactSearchBar, SearchBar, type SearchFilter } from './SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = vi.fn()
  const mockOnValueChange = vi.fn()
  const mockOnFilterChange = vi.fn()

  const mockFilters: SearchFilter[] = [
    { id: 'course', label: 'Courses', value: 'course', count: 24 },
    { id: 'module', label: 'Modules', value: 'module', count: 156 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<SearchBar />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('displays custom placeholder', () => {
    render(<SearchBar placeholder="Search courses..." />)

    expect(screen.getByPlaceholderText('Search courses...')).toBeInTheDocument()
  })

  it('calls onValueChange when typing', async () => {
    const user = userEvent.setup()
    render(<SearchBar onValueChange={mockOnValueChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(mockOnValueChange).toHaveBeenCalledWith('test')
  })

  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    await user.keyboard('{Enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('debounces search calls', async () => {
    vi.useFakeTimers()
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(mockOnSearch).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(mockOnSearch).toHaveBeenCalledWith('test')

    vi.useRealTimers()
  })

  it('shows loading indicator', () => {
    render(<SearchBar loading />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    // Loading indicator should be visible
  })

  it('shows clear button when there is value', async () => {
    const user = userEvent.setup()
    render(<SearchBar value="test" onValueChange={mockOnValueChange} />)

    const clearButton = screen.getByRole('button', { name: /clear search/i })

    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)

    expect(mockOnValueChange).toHaveBeenCalledWith('')
  })

  it('renders filters when provided', () => {
    render(
      <SearchBar
        showFilters
        filters={mockFilters}
        activeFilters={['course']}
        onFilterChange={mockOnFilterChange}
      />
    )

    const filterButton = screen.getByRole('button', { name: /filters/i })

    expect(filterButton).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<SearchBar disabled />)

    const input = screen.getByRole('textbox')

    expect(input).toBeDisabled()
  })

  it('has correct accessibility attributes', () => {
    render(<SearchBar />)

    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('aria-label', 'Search input')
  })
})

describe('CompactSearchBar', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders in collapsed state initially', () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />)

    const toggleButton = screen.getByRole('button', { name: /toggle search/i })

    expect(toggleButton).toBeInTheDocument()

    // Input should not be visible initially
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('expands when toggle button is clicked', async () => {
    const user = userEvent.setup()
    render(<CompactSearchBar onSearch={mockOnSearch} />)

    const toggleButton = screen.getByRole('button', { name: /toggle search/i })
    await user.click(toggleButton)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onSearch when Enter is pressed in expanded state', async () => {
    const user = userEvent.setup()
    render(<CompactSearchBar onSearch={mockOnSearch} />)

    // Expand the search
    const toggleButton = screen.getByRole('button', { name: /toggle search/i })
    await user.click(toggleButton)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    await user.keyboard('{Enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('collapses when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<CompactSearchBar onSearch={mockOnSearch} />)

    // Expand the search
    const toggleButton = screen.getByRole('button', { name: /toggle search/i })
    await user.click(toggleButton)

    const input = screen.getByRole('textbox')
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })
})
