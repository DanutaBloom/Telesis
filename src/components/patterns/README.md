# Pattern Components Library

A comprehensive collection of enterprise-grade React pattern components built with Modern Sage theming, TypeScript, and accessibility best practices.

## Overview

The patterns library provides high-level, composable UI patterns that combine base UI components into common usage scenarios. These patterns follow atomic design principles and are organized into four main categories:

- **Navigation**: Components for site navigation and hierarchy
- **Forms**: Form-related patterns and interactions  
- **Layout**: Page structure and content organization
- **Data Display**: Components for presenting and organizing data

## Architecture

### Design Principles

1. **Composability**: All patterns are built from smaller UI components
2. **Accessibility**: WCAG 2.1 AA compliance by default
3. **Flexibility**: Extensive prop APIs for customization
4. **Performance**: Optimized for production use
5. **Consistency**: Unified Modern Sage theming throughout

### Component Structure

```
src/components/patterns/
├── navigation/           # Navigation patterns
│   ├── AppSidebar.tsx   # Dashboard sidebar navigation
│   ├── TopNavigation.tsx # Header navigation with search/user menu
│   └── Breadcrumbs.tsx  # Hierarchical navigation
├── forms/               # Form patterns
│   ├── SearchBar.tsx    # Advanced search with filters
│   ├── FilterPanel.tsx  # Data filtering interface
│   └── FormSection.tsx  # Organized form sections
├── layout/              # Layout patterns
│   ├── PageHeader.tsx   # Consistent page headers
│   ├── PageContainer.tsx # Content wrapper with states
│   └── GridLayout.tsx   # Responsive grid systems
├── data-display/        # Data presentation patterns
│   ├── DataCard.tsx     # Information cards
│   ├── StatWidget.tsx   # Metric display widgets
│   └── ContentList.tsx  # Content organization
└── index.ts            # Organized exports
```

## Pattern Categories

### Navigation Patterns

Components that help users navigate through the application and understand their current location.

#### AppSidebar
A collapsible sidebar navigation component with groups, badges, and responsive behavior.

```tsx
import { AppSidebar, SidebarProvider } from '@/components/patterns'

<SidebarProvider>
  <AppSidebar variant="primary">
    <SidebarHeader>
      <Logo title="Modern Sage" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarNav>
        <SidebarItem icon={Home} active>Dashboard</SidebarItem>
        <SidebarItem icon={BookOpen} badge="3">Courses</SidebarItem>
      </SidebarNav>
    </SidebarContent>
  </AppSidebar>
</SidebarProvider>
```

#### TopNavigation
A comprehensive header navigation with search, user menu, and responsive design.

```tsx
import { TopNavigation, NavigationBrand, UserMenu } from '@/components/patterns'

<TopNavigation>
  <NavigationBrand title="Telesis" logo={<Logo />} />
  <NavigationSearch onSearch={handleSearch} />
  <UserMenu user={currentUser} onSignOut={handleSignOut} />
</TopNavigation>
```

#### Breadcrumbs
Hierarchical navigation with collapse support and accessibility features.

```tsx
import { Breadcrumbs } from '@/components/patterns'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'React Fundamentals' }
]

<Breadcrumbs items={breadcrumbs} maxItems={3} />
```

### Form Patterns

Patterns that enhance form usability and data input experiences.

#### SearchBar
Advanced search component with filters, debouncing, and loading states.

```tsx
import { SearchBar } from '@/components/patterns'

<SearchBar
  placeholder="Search courses..."
  onSearch={handleSearch}
  showFilters
  filters={searchFilters}
  debounceMs={300}
/>
```

#### FilterPanel
Comprehensive filtering interface with multiple filter types and active filter management.

```tsx
import { FilterPanel } from '@/components/patterns'

<FilterPanel
  groups={filterGroups}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
  collapsible
/>
```

#### FormSection
Organized form sections with validation, help text, and step indicators.

```tsx
import { FormSection, FormField, FormSteps } from '@/components/patterns'

<FormSection
  title="Account Information"
  description="Enter your account details"
  required
  error={sectionError}
>
  <FormField label="Email" required error={emailError}>
    <Input type="email" />
  </FormField>
</FormSection>
```

### Layout Patterns

Structural components that organize page content and provide consistent layouts.

#### PageHeader
Flexible page headers with breadcrumbs, actions, and metadata.

```tsx
import { PageHeader, PageHeaderTabs } from '@/components/patterns'

<PageHeader
  title="Course Management"
  subtitle="Manage your learning content"
  breadcrumbs={breadcrumbs}
  primaryAction={{ label: 'Create Course', onClick: handleCreate }}
  actions={headerActions}
>
  <PageHeaderTabs tabs={tabs} activeTab={activeTab} />
</PageHeader>
```

#### PageContainer
Content wrapper with loading states, error handling, and responsive sizing.

```tsx
import { PageContainer, PageSection } from '@/components/patterns'

<PageContainer size="lg" loading={isLoading} error={error}>
  <PageSection title="Overview" variant="card">
    <p>Page content goes here</p>
  </PageSection>
</PageContainer>
```

#### GridLayout
Responsive grid systems with auto-fit, masonry, and dashboard layouts.

```tsx
import { GridLayout, GridCard, DashboardGrid } from '@/components/patterns'

<GridLayout columns="auto" minItemWidth="300px">
  <GridCard title="Card 1">Content</GridCard>
  <GridCard title="Card 2" span="2">Wide content</GridCard>
</GridLayout>
```

### Data Display Patterns

Components for presenting information in organized, scannable formats.

#### DataCard
Versatile card component for displaying structured information with actions.

```tsx
import { DataCard, ContentCard, StatsCard } from '@/components/patterns'

<DataCard
  title="Course Title"
  description="Course description"
  image={courseImage}
  badge="New"
  meta={courseMeta}
  actions={cardActions}
  onSelect={handleSelect}
/>
```

#### StatWidget
Metric display widgets with trends, progress indicators, and charts.

```tsx
import { StatWidget, CompactStatWidget } from '@/components/patterns'

<StatWidget
  title="Total Revenue"
  value="$124,563"
  icon={DollarSign}
  trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
  progress={{ value: 75, max: 100, label: 'of monthly target' }}
/>
```

#### ContentList
Flexible list component with search, filtering, sorting, and multiple view modes.

```tsx
import { ContentList } from '@/components/patterns'

<ContentList
  items={contentItems}
  searchable
  selectable
  viewMode="grid"
  onViewModeChange={setViewMode}
  actions={listActions}
  draggable
/>
```

## Modern Sage Theming

All pattern components implement the Modern Sage design system with:

- **Color Palette**: Consistent use of sage-quietude, sage-growth, and supporting colors
- **Typography**: Inter font family with semantic sizing
- **Spacing**: 4px grid system (0.5rem increments)
- **Interactive States**: Hover, focus, and active states with proper contrast
- **Accessibility**: WCAG 2.1 AA compliant colors and interactions

### Theme Utilities

```css
/* Modern Sage CSS classes available throughout patterns */
.sage-bg-primary     /* Primary background */
.sage-bg-mist        /* Subtle background */
.sage-text-primary   /* Primary text color */
.sage-border         /* Border color */
.sage-hover-primary  /* Hover state */
.sage-ring           /* Focus ring */
.sage-card           /* Card styling */
```

## Accessibility Features

### Keyboard Navigation
- Full keyboard support for all interactive elements
- Logical tab order and focus management
- Escape key handling for modals and dropdowns

### Screen Reader Support
- Semantic HTML structure with proper headings
- ARIA labels and descriptions
- Live regions for dynamic content updates
- Role attributes for custom components

### Visual Accessibility
- Minimum 4.5:1 color contrast ratios
- Focus indicators with 2px visible outline
- Support for reduced motion preferences
- Scalable text and touch targets (44px minimum)

## Testing

All pattern components include comprehensive test coverage:

```bash
# Run pattern component tests
npm test -- patterns/

# Run specific pattern tests
npm test -- SearchBar.test.tsx

# Run tests with coverage
npm test -- --coverage patterns/
```

### Test Categories

1. **Rendering Tests**: Verify components render with all prop combinations
2. **Interaction Tests**: Test user interactions and event handlers
3. **Accessibility Tests**: Validate ARIA attributes and keyboard navigation
4. **Integration Tests**: Test pattern composition and data flow

## Performance Optimization

### Code Splitting
Pattern components support lazy loading:

```tsx
import { lazy } from 'react'

const DataCard = lazy(() => import('@/components/patterns').then(m => ({ default: m.DataCard })))
```

### Bundle Size
- Tree-shakeable exports for optimal bundle size
- Minimal external dependencies
- Optimized CSS-in-JS usage

### Runtime Performance
- Memoized expensive computations
- Virtualization for large data sets
- Debounced user inputs
- Optimistic UI updates

## Usage Guidelines

### When to Use Patterns

✅ **Use patterns when:**
- Building common UI scenarios (dashboards, content lists, etc.)
- You need consistent behavior across the application
- Accessibility compliance is required
- You want to reduce development time

❌ **Don't use patterns when:**
- You need highly custom, one-off designs
- The pattern constraints don't fit your use case
- You're building simple, static content

### Customization

Patterns are designed to be flexible while maintaining consistency:

1. **Variants**: Use built-in variant props for common customizations
2. **CSS Classes**: Add custom classes for styling adjustments
3. **Composition**: Combine patterns for complex layouts
4. **Slots**: Use children props and render props for custom content

### Best Practices

1. **Start with patterns** before building custom components
2. **Follow the variant system** rather than overriding styles
3. **Test accessibility** when customizing components
4. **Provide feedback** on missing pattern functionality
5. **Document custom usage** in your application

## Contributing

### Adding New Patterns

1. **Identify the use case**: Ensure it's a common, reusable pattern
2. **Design the API**: Create TypeScript interfaces and prop definitions
3. **Implement with tests**: Include comprehensive test coverage
4. **Document thoroughly**: Add examples and usage guidelines
5. **Review accessibility**: Validate WCAG compliance

### Pattern Development Checklist

- [ ] TypeScript interfaces with comprehensive prop types
- [ ] Modern Sage theming integration
- [ ] Responsive design (mobile-first)
- [ ] Accessibility features (ARIA, keyboard navigation)
- [ ] Test coverage (rendering, interaction, accessibility)
- [ ] Documentation with examples
- [ ] Performance optimization
- [ ] Integration with existing patterns

## Migration Guide

### From Custom Components

When migrating from custom components to patterns:

1. **Audit existing components** for pattern matches
2. **Map custom props** to pattern APIs
3. **Update styling** to use Modern Sage theming
4. **Test thoroughly** with existing data and user flows
5. **Update documentation** and training materials

### Breaking Changes

Pattern components follow semantic versioning. Breaking changes are:

- Removed or renamed props
- Changed component structure or DOM output
- Modified accessibility behavior
- Updated theming or styling approach

## Support

For questions, issues, or feature requests:

1. **Check documentation** first for usage examples
2. **Search existing issues** in the project repository
3. **Create detailed bug reports** with reproduction steps
4. **Propose enhancements** with use cases and examples

---

*This patterns library provides the building blocks for creating consistent, accessible, and maintainable user interfaces in the Telesis platform.*