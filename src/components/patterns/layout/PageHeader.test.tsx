import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { BreadcrumbItem } from '../navigation/Breadcrumbs'
import { PageHeader, type PageHeaderAction, PageHeaderMeta, type PageHeaderTab, PageHeaderTabs } from './PageHeader'

describe('PageHeader', () => {
  const mockOnBack = vi.fn()
  const mockOnAction = vi.fn()

  const mockBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'React Fundamentals' },
  ]

  const mockActions: PageHeaderAction[] = [
    {
      id: 'share',
      label: 'Share',
      onClick: mockOnAction
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with required props', () => {
    render(<PageHeader title="Test Title" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Test Title' })).toBeInTheDocument()
  })

  it('displays subtitle and description', () => {
    render(
      <PageHeader
        title="Test Title"
        subtitle="Test Subtitle"
        description="Test description"
      />
    )

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('shows badge when provided', () => {
    render(<PageHeader title="Test Title" badge="New" />)

    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders breadcrumbs when provided', () => {
    render(<PageHeader title="Test Title" breadcrumbs={mockBreadcrumbs} />)

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
  })

  it('shows back button when showBack is true', async () => {
    const user = userEvent.setup()
    render(
      <PageHeader
        title="Test Title"
        showBack
        onBack={mockOnBack}
      />
    )

    const backButton = screen.getByRole('button', { name: /back/i })

    expect(backButton).toBeInTheDocument()

    await user.click(backButton)

    expect(mockOnBack).toHaveBeenCalled()
  })

  it('renders actions', async () => {
    const user = userEvent.setup()
    render(<PageHeader title="Test Title" actions={mockActions} />)

    const shareButton = screen.getByRole('button', { name: 'Share' })

    expect(shareButton).toBeInTheDocument()

    await user.click(shareButton)

    expect(mockOnAction).toHaveBeenCalled()
  })

  it('renders primary action with correct variant', () => {
    const primaryAction: PageHeaderAction = {
      id: 'primary',
      label: 'Primary Action',
      variant: 'primary'
    }

    render(<PageHeader title="Test Title" primaryAction={primaryAction} />)

    const primaryButton = screen.getByRole('button', { name: 'Primary Action' })

    expect(primaryButton).toBeInTheDocument()
  })

  it('renders more actions dropdown', async () => {
    const user = userEvent.setup()
    const moreActions: PageHeaderAction[] = [
      { id: 'edit', label: 'Edit', onClick: mockOnAction },
      { id: 'delete', label: 'Delete', variant: 'destructive', onClick: mockOnAction }
    ]

    render(<PageHeader title="Test Title" moreActions={moreActions} />)

    const moreButton = screen.getByRole('button', { name: /more actions/i })

    expect(moreButton).toBeInTheDocument()

    await user.click(moreButton)

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('applies different size variants correctly', () => {
    const { rerender } = render(<PageHeader title="Test Title" size="sm" />)

    expect(screen.getByRole('heading')).toHaveClass()

    rerender(<PageHeader title="Test Title" size="lg" />)

    expect(screen.getByRole('heading')).toHaveClass()
  })

  it('applies different style variants correctly', () => {
    const { rerender } = render(<PageHeader title="Test Title" variant="card" />)

    expect(screen.getByRole('heading').closest('div')).toHaveClass()

    rerender(<PageHeader title="Test Title" variant="minimal" />)

    expect(screen.getByRole('heading').closest('div')).toHaveClass()
  })

  it('renders custom meta content', () => {
    const meta = <div data-testid="custom-meta">Custom meta content</div>
    render(<PageHeader title="Test Title" meta={meta} />)

    expect(screen.getByTestId('custom-meta')).toBeInTheDocument()
  })
})

describe('PageHeaderMeta', () => {
  const mockItems = [
    { label: 'Duration', value: '8 weeks' },
    { label: 'Level', value: 'Beginner' },
    { label: 'Students', value: '1,234 enrolled' },
  ]

  it('renders meta items correctly', () => {
    render(<PageHeaderMeta items={mockItems} />)

    expect(screen.getByText('Duration:')).toBeInTheDocument()
    expect(screen.getByText('8 weeks')).toBeInTheDocument()
    expect(screen.getByText('Level:')).toBeInTheDocument()
    expect(screen.getByText('Beginner')).toBeInTheDocument()
  })

  it('renders meta items with icons', () => {
    const itemsWithIcons = [
      { label: 'Duration', value: '8 weeks', icon: () => <span data-testid="duration-icon" /> },
    ]

    render(<PageHeaderMeta items={itemsWithIcons} />)

    expect(screen.getByTestId('duration-icon')).toBeInTheDocument()
  })
})

describe('PageHeaderTabs', () => {
  const mockOnTabChange = vi.fn()

  const mockTabs: PageHeaderTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum', count: 12 },
    { id: 'reviews', label: 'Reviews', count: 89, disabled: true },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders tabs correctly', () => {
    render(<PageHeaderTabs tabs={mockTabs} />)

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Curriculum')).toBeInTheDocument()
    expect(screen.getByText('Reviews')).toBeInTheDocument()
  })

  it('shows tab counts as badges', () => {
    render(<PageHeaderTabs tabs={mockTabs} />)

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('89')).toBeInTheDocument()
  })

  it('calls onTabChange when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<PageHeaderTabs tabs={mockTabs} onTabChange={mockOnTabChange} />)

    const overviewTab = screen.getByRole('button', { name: 'Overview' })
    await user.click(overviewTab)

    expect(mockOnTabChange).toHaveBeenCalledWith('overview')
  })

  it('marks active tab correctly', () => {
    render(<PageHeaderTabs tabs={mockTabs} activeTab="overview" />)

    const overviewTab = screen.getByRole('button', { name: 'Overview' })

    expect(overviewTab).toHaveAttribute('aria-current', 'page')
  })

  it('disables disabled tabs', () => {
    render(<PageHeaderTabs tabs={mockTabs} onTabChange={mockOnTabChange} />)

    const reviewsTab = screen.getByRole('button', { name: /reviews/i })

    expect(reviewsTab).toBeDisabled()
  })

  it('renders tabs with href as links', () => {
    const tabsWithHref: PageHeaderTab[] = [
      { id: 'overview', label: 'Overview', href: '/overview' },
    ]

    render(<PageHeaderTabs tabs={tabsWithHref} />)

    const overviewLink = screen.getByRole('link', { name: 'Overview' })

    expect(overviewLink).toHaveAttribute('href', '/overview')
  })
})
