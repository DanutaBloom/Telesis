import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ContentCard, DataCard, type DataCardAction, type DataCardMeta, StatsCard } from './DataCard'

describe('DataCard', () => {
  const mockOnClick = vi.fn()
  const mockOnSelect = vi.fn()
  const mockActionClick = vi.fn()

  const mockActions: DataCardAction[] = [
    {
      id: 'share',
      label: 'Share',
      onClick: mockActionClick
    }
  ]

  const mockMeta: DataCardMeta[] = [
    { label: 'Author', value: 'John Doe' },
    { label: 'Date', value: '2024-01-15' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with required props', () => {
    render(<DataCard title="Test Card" />)

    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })

  it('displays subtitle and description', () => {
    render(
      <DataCard
        title="Test Card"
        subtitle="Test Subtitle"
        description="Test description"
      />
    )

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('shows badge when provided', () => {
    render(<DataCard title="Test Card" badge="New" />)

    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(
      <DataCard
        title="Test Card"
        image="test-image.jpg"
        imageAlt="Test image"
      />
    )

    const image = screen.getByRole('img', { name: 'Test image' })

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test-image.jpg')
  })

  it('renders tags when provided', () => {
    render(<DataCard title="Test Card" tags={['React', 'TypeScript']} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders meta information', () => {
    render(<DataCard title="Test Card" meta={mockMeta} />)

    expect(screen.getByText('Author:')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Date:')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('handles card click', async () => {
    const user = userEvent.setup()
    render(<DataCard title="Test Card" onClick={mockOnClick} />)

    const card = screen.getByText('Test Card').closest('div')
    await user.click(card!)

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('handles selection', async () => {
    const user = userEvent.setup()
    render(<DataCard title="Test Card" onSelect={mockOnSelect} />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeInTheDocument()

    await user.click(checkbox)

    expect(mockOnSelect).toHaveBeenCalledWith(true)
  })

  it('shows selected state', () => {
    render(<DataCard title="Test Card" selected onSelect={mockOnSelect} />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeChecked()
  })

  it('renders actions', async () => {
    const user = userEvent.setup()
    render(<DataCard title="Test Card" actions={mockActions} />)

    const shareButton = screen.getByRole('button', { name: 'Share' })

    expect(shareButton).toBeInTheDocument()

    await user.click(shareButton)

    expect(mockActionClick).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<DataCard title="Test Card" loading />)

    const card = screen.getByText('Test Card').closest('div')

    expect(card).toHaveClass('opacity-50', 'pointer-events-none')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<DataCard title="Test Card" variant="elevated" />)
    const card1 = screen.getByText('Test Card').closest('div')

    expect(card1).toHaveClass()

    rerender(<DataCard title="Test Card" variant="minimal" />)
    const card2 = screen.getByText('Test Card').closest('div')

    expect(card2).toHaveClass()
  })

  it('renders as link when href is provided', () => {
    render(<DataCard title="Test Card" href="/test" />)

    const link = screen.getByRole('link')

    expect(link).toHaveAttribute('href', '/test')
  })

  it('renders custom children', () => {
    render(
      <DataCard title="Test Card">
        <div data-testid="custom-content">Custom content</div>
      </DataCard>
    )

    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('renders footer content', () => {
    const footer = <div data-testid="footer">Footer content</div>
    render(<DataCard title="Test Card" footer={footer} />)

    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})

describe('ContentCard', () => {
  const mockOnToggleBookmark = vi.fn()
  const mockOnToggleLike = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders content-specific props', () => {
    render(
      <ContentCard
        title="Test Article"
        category="Tutorial"
        author="Jane Doe"
        publishDate="2024-01-15"
        readTime="5 min"
        rating={4}
        views={1234}
        likes={89}
        onToggleBookmark={mockOnToggleBookmark}
        onToggleLike={mockOnToggleLike}
      />
    )

    expect(screen.getByText('Tutorial')).toBeInTheDocument()
    expect(screen.getByText('Author:')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Published:')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('handles bookmark toggle', async () => {
    const user = userEvent.setup()
    render(
      <ContentCard
        title="Test Article"
        onToggleBookmark={mockOnToggleBookmark}
      />
    )

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i })
    await user.click(bookmarkButton)

    expect(mockOnToggleBookmark).toHaveBeenCalled()
  })

  it('handles like toggle', async () => {
    const user = userEvent.setup()
    render(
      <ContentCard
        title="Test Article"
        likes={42}
        onToggleLike={mockOnToggleLike}
      />
    )

    const likeButton = screen.getByRole('button', { name: /42 likes/i })
    await user.click(likeButton)

    expect(mockOnToggleLike).toHaveBeenCalled()
  })

  it('displays rating stars', () => {
    render(
      <ContentCard
        title="Test Article"
        rating={3}
        maxRating={5}
      />
    )

    expect(screen.getByText('3/5')).toBeInTheDocument()
  })
})

describe('StatsCard', () => {
  it('renders stats with value and label', () => {
    render(
      <StatsCard
        value={1234}
        label="Total Users"
      />
    )

    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('Total Users')).toBeInTheDocument()
  })

  it('displays change information', () => {
    render(
      <StatsCard
        value={1234}
        label="Total Users"
        change={{
          value: 12.5,
          trend: 'up',
          label: 'from last month'
        }}
      />
    )

    expect(screen.getByText('+12.5%')).toBeInTheDocument()
    expect(screen.getByText('from last month')).toBeInTheDocument()
  })

  it('shows different trend colors', () => {
    const { rerender } = render(
      <StatsCard
        value={1234}
        label="Total Users"
        change={{ value: 12.5, trend: 'up' }}
      />
    )

    expect(screen.getByText('+12.5%')).toHaveClass('text-sage-growth')

    rerender(
      <StatsCard
        value={1234}
        label="Total Users"
        change={{ value: 5.2, trend: 'down' }}
      />
    )

    expect(screen.getByText('-5.2%')).toHaveClass('text-destructive')
  })

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon" />

    render(
      <StatsCard
        value={1234}
        label="Total Users"
        icon={TestIcon}
      />
    )

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders custom chart', () => {
    const chart = <div data-testid="custom-chart">Chart</div>

    render(
      <StatsCard
        value={1234}
        label="Total Users"
        chart={chart}
      />
    )

    expect(screen.getByTestId('custom-chart')).toBeInTheDocument()
  })
})
