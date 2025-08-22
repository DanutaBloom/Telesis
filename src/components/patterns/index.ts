// ============================================================================
// Pattern Components - Organized Exports
// ============================================================================

// Navigation Patterns
export {
  AppSidebar,
  AppSidebarExample,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SidebarProvider,
  useSidebar,
} from './navigation/AppSidebar'
export {
  type BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbsExample,
  SimpleBreadcrumbs,
} from './navigation/Breadcrumbs'
export {
  MobileMenuToggle,
  NavigationActions,
  NavigationBrand,
  NavigationItem,
  NavigationMenu,
  NavigationSearch,
  TopNavigation,
  TopNavigationExample,
  UserMenu,
} from './navigation/TopNavigation'

// Form Patterns
export {
  type ActiveFilter,
  type FilterGroup,
  type FilterOption,
  FilterPanel,
  FilterPanelExample,
} from './forms/FilterPanel'
export {
  FormActions,
  FormField,
  FormSection,
  FormSectionExample,
  type FormStep,
  FormSteps,
} from './forms/FormSection'
export {
  CompactSearchBar,
  SearchBar,
  SearchBarExample,
  type SearchFilter,
} from './forms/SearchBar'

// Layout Patterns
export {
  DashboardGrid,
  type DashboardWidget,
  GridCard,
  GridItem,
  GridLayout,
  GridLayoutExample,
  MasonryGrid,
  ResponsiveGrid,
} from './layout/GridLayout'
export {
  PageContainer,
  PageContainerExample,
  PageContent,
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
  PageSection,
  usePageContainer,
} from './layout/PageContainer'
export {
  PageHeader,
  type PageHeaderAction,
  PageHeaderExample,
  PageHeaderMeta,
  type PageHeaderTab,
  PageHeaderTabs,
} from './layout/PageHeader'

// Data Display Patterns
export {
  ContentList,
  type ContentListAction,
  type ContentListColumn,
  ContentListExample,
  type ContentListFilter,
  type ContentListItem,
} from './data-display/ContentList'
export {
  ContentCard,
  DataCard,
  type DataCardAction,
  DataCardExample,
  type DataCardMeta,
  StatsCard,
} from './data-display/DataCard'
export {
  CompactStatWidget,
  ProgressStatWidget,
  StatWidget,
  type StatWidgetAction,
  StatWidgetExample,
  type StatWidgetProgress,
  type StatWidgetTrend,
} from './data-display/StatWidget'

// Pattern Categories for Documentation
export const PATTERN_CATEGORIES = {
  navigation: {
    label: 'Navigation',
    description: 'Components for site navigation and hierarchy',
    components: ['AppSidebar', 'TopNavigation', 'Breadcrumbs']
  },
  forms: {
    label: 'Forms',
    description: 'Form-related patterns and interactions',
    components: ['SearchBar', 'FilterPanel', 'FormSection']
  },
  layout: {
    label: 'Layout',
    description: 'Page structure and content organization',
    components: ['PageHeader', 'PageContainer', 'GridLayout']
  },
  dataDisplay: {
    label: 'Data Display',
    description: 'Components for presenting and organizing data',
    components: ['DataCard', 'StatWidget', 'ContentList']
  }
} as const

// Pattern Examples for Storybook
export const PATTERN_EXAMPLES = {
  AppSidebarExample,
  TopNavigationExample,
  BreadcrumbsExample,
  SearchBarExample,
  FilterPanelExample,
  FormSectionExample,
  PageHeaderExample,
  PageContainerExample,
  GridLayoutExample,
  DataCardExample,
  StatWidgetExample,
  ContentListExample,
} as const
