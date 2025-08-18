# Test Utilities Documentation

## Overview

This directory contains testing utilities specifically designed for the Telesis application, with special focus on testing Tailwind CSS implementations.

## CSS Testing Configuration

### Current Setup

- **Vitest**: Main testing framework with React Testing Library
- **JSDOM**: DOM environment for testing
- **Tailwind CSS**: Configured with PostCSS processing in tests
- **Global CSS Import**: Tailwind styles are imported in test setup

### CSS Processing in Tests

The test environment is configured to process CSS through PostCSS and Tailwind:

```typescript
// vitest.config.mts
export default defineConfig({
  css: {
    postcss: './postcss.config.js',
  },
  // ...
});
```

## CSS Testing Utilities

### Available Utilities

#### `expectElementToHaveClasses(element, classes)`
Asserts that an element has all the specified Tailwind classes.

```typescript
expectElementToHaveClasses(button, [
  'bg-blue-500',
  'hover:bg-blue-700',
  'text-white'
]);
```

#### `expectElementByTestIdToHaveClasses(testId, classes)`
Same as above but finds element by test ID first.

```typescript
expectElementByTestIdToHaveClasses('primary-button', [
  'bg-primary',
  'text-white'
]);
```

#### `expectElementToHaveResponsiveClasses(element, responsiveClasses)`
Tests responsive breakpoint classes.

```typescript
expectElementToHaveResponsiveClasses(container, {
  base: ['w-full'],
  sm: ['sm:w-1/2'],
  md: ['md:w-1/3'],
  lg: ['lg:w-1/4']
});
```

#### `expectElementToHaveDarkModeClasses(element, lightClasses, darkClasses)`
Tests both light and dark mode variants.

```typescript
expectElementToHaveDarkModeClasses(
  element,
  ['bg-white', 'text-gray-900'],
  ['dark:bg-gray-800', 'dark:text-white']
);
```

#### `getComputedStyles(element)`
Returns computed CSS styles (useful for debugging).

```typescript
const styles = getComputedStyles(element);
console.log(styles.display, styles.backgroundColor);
```

## Testing Best Practices

### 1. Test Class Application
Always test that Tailwind classes are correctly applied:

```tsx
it('should apply correct styling classes', () => {
  render(<Button variant="primary" />);
  const button = screen.getByRole('button');

  expectElementToHaveClasses(button, [
    'bg-primary',
    'text-primary-foreground',
    'hover:bg-primary/90'
  ]);
});
```

### 2. Test Responsive Behavior
Verify responsive classes are present:

```tsx
it('should be responsive', () => {
  render(<Card />);
  const card = screen.getByTestId('card');

  expectElementToHaveResponsiveClasses(card, {
    base: ['p-4'],
    md: ['md:p-6'],
    lg: ['lg:p-8']
  });
});
```

### 3. Test Accessibility
Always include accessibility attribute testing:

```tsx
it('should have proper accessibility attributes', () => {
  render(<Button />);
  const button = screen.getByRole('button');

  expectElementToHaveA11yAttributes(button, {
    'aria-label': 'Submit form',
    'type': 'submit'
  });
});
```

### 4. Test Variants and States
Test different component variants:

```tsx
describe('Button variants', () => {
  it('should render primary variant correctly', () => {
    render(<Button variant="primary" />);
    expectElementToHaveClasses(screen.getByRole('button'), [
      'bg-primary',
      'text-primary-foreground'
    ]);
  });

  it('should render secondary variant correctly', () => {
    render(<Button variant="secondary" />);
    expectElementToHaveClasses(screen.getByRole('button'), [
      'bg-secondary',
      'text-secondary-foreground'
    ]);
  });
});
```

## Limitations

### CSS Processing in JSDOM
**Important**: JSDOM has limited CSS processing capabilities:

- ✅ Class names are preserved and testable with `toHaveClass()`
- ❌ Computed styles may not reflect actual Tailwind values
- ❌ CSS custom properties might resolve to browser defaults
- ❌ Complex CSS features like grid/flexbox may not compute correctly

### What to Test
Focus on testing:
- ✅ Class application
- ✅ Conditional classes
- ✅ Responsive class presence
- ✅ Accessibility attributes
- ✅ Component behavior and interactions

Avoid testing:
- ❌ Exact computed style values
- ❌ CSS animations/transitions
- ❌ Complex layout calculations

## Usage Examples

### Basic Component Test
```tsx
import { expectElementToHaveClasses, render, screen } from '@/test-utils';

describe('MyComponent', () => {
  it('should render with correct styling', () => {
    render(<MyComponent />);
    const element = screen.getByTestId('my-component');

    expectElementToHaveClasses(element, [
      'flex',
      'items-center',
      'justify-center',
      'p-4',
      'bg-background'
    ]);
  });
});
```

### Advanced Component Test
```tsx
import { expectElementToHaveClasses, render, screen, userEvent } from '@/test-utils';

describe('InteractiveCard', () => {
  it('should change classes on hover state', async () => {
    const user = userEvent.setup();
    render(<InteractiveCard />);

    const card = screen.getByTestId('card');

    // Test initial state
    expectElementToHaveClasses(card, [
      'bg-card',
      'hover:bg-card/80',
      'transition-colors'
    ]);

    // Test interaction
    await user.hover(card);
    // Note: JSDOM won't apply :hover styles, but classes should be present
  });
});
```

## Migration from Existing Tests

To update existing tests to use these utilities:

1. Import utilities from `@/test-utils`
2. Replace manual class checking with utility functions
3. Add responsive and accessibility testing
4. Focus on class presence rather than computed styles

This provides a robust foundation for testing Tailwind CSS implementations while working within JSDOM's limitations.
