# Accessibility Testing Guide

This guide covers the comprehensive accessibility testing setup for the Telesis project, ensuring WCAG 2.1 AA compliance across all components and pages.

## Overview

The accessibility testing infrastructure includes:

- **Unit Testing**: Component-level accessibility testing with @axe-core/react
- **E2E Testing**: Page-level testing with @axe-core/playwright  
- **Color Contrast Validation**: Advanced color analysis for WCAG compliance
- **Keyboard Navigation Testing**: Comprehensive keyboard interaction validation
- **Screen Reader Testing**: ARIA attributes and semantic structure validation
- **Focus Management**: Focus indicators and focus trapping validation
- **CI/CD Integration**: Automated accessibility gates in GitHub Actions

## Quick Start

### Run Accessibility Tests

```bash
# Run unit accessibility tests
npm run test:a11y:unit

# Run E2E accessibility tests  
npm run test:accessibility
npm run test:a11y

# Generate accessibility coverage report
npm run test:a11y:coverage
```

### View Reports

After running tests, view the HTML coverage report at:
```
test-results/accessibility-coverage.html
```

## Testing Architecture

### 1. Unit Testing (@axe-core/react)

**Location**: `src/components/**/*.test.tsx`

Unit tests validate individual components for:
- Color contrast compliance (4.5:1 normal, 3:1 large text)
- Keyboard navigation and focus management
- ARIA attributes and roles
- Semantic HTML structure
- Form accessibility

**Example Unit Test**:
```typescript
import { testA11y, runComprehensiveA11yTests } from '@/../tests/helpers/accessibility';

test('Button meets WCAG 2.1 AA compliance', async () => {
  const { container } = render(<Button>Click me</Button>);
  await testA11y(container);
});

test('Button supports all accessibility features', async () => {
  const { container } = render(
    <Button variant="primary" size="lg">
      Primary Button
    </Button>
  );
  
  await runComprehensiveA11yTests(container, {
    testColorContrast: true,
    testKeyboard: true,
    testAria: true,
  });
});
```

### 2. E2E Testing (@axe-core/playwright)

**Location**: `tests/e2e/accessibility/`

E2E tests validate complete pages and user flows:
- Full page accessibility scans
- Cross-browser compatibility (Chromium, Firefox, WebKit)
- Responsive accessibility across viewport sizes
- Form validation and error handling
- Dynamic content and modal accessibility

**Example E2E Test**:
```typescript
import { testPageAccessibility, testColorContrastCompliance } from '@/../tests/helpers/playwright-accessibility';

test('dashboard meets WCAG 2.1 AA compliance', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  
  await testPageAccessibility(page);
  await testColorContrastCompliance(page);
});
```

### 3. Color Contrast Testing

**Location**: `src/test-utils/colorContrastUtils.ts`

Advanced color contrast analysis:
- WCAG 2.1 AA/AAA compliance validation
- Modern Sage theme color combination testing
- Automatic large text detection
- Browser-based color analysis

**Usage**:
```typescript
import { testElementColorContrast, testModernSageColorContrast } from '@/test-utils/colorContrastUtils';

// Test specific element
const result = testElementColorContrast(buttonElement);
expect(result.passes).toBe(true);

// Test all Modern Sage color combinations
const results = testModernSageColorContrast();
expect(results.allPassing).toBe(true);
```

## Test Utilities

### Accessibility Test Helpers

**Location**: `src/test-utils/accessibilityTestUtils.ts`

Comprehensive utility functions:
- `testKeyboardNavigation()` - Tab order and keyboard interactions
- `testFocusIndicator()` - Focus visibility and management
- `testMinimumTapTargetSize()` - 44px minimum touch target validation
- `testFormAccessibility()` - Form label and validation testing
- `testHeadingHierarchy()` - Proper heading structure validation

### Playwright Accessibility Helpers

**Location**: `tests/helpers/playwright-accessibility.ts`

E2E-specific utilities:
- `testPageAccessibility()` - Full page axe-core scan
- `testResponsiveAccessibility()` - Multi-viewport testing
- `testFormAccessibility()` - Form interaction testing
- `testFocusManagement()` - Focus trapping and restoration

## WCAG 2.1 AA Compliance

### Automated Testing Coverage

| Criterion | WCAG | Description | Automated | Coverage |
|-----------|------|-------------|-----------|----------|
| **Color Contrast** | 1.4.3 | 4.5:1 normal text, 3:1 large text | ✅ | Excellent |
| **Keyboard Navigation** | 2.1.1 | All functionality from keyboard | ✅ | Excellent |
| **Focus Management** | 2.4.3, 2.4.7 | Logical order, visible indicators | ✅ | Excellent |
| **ARIA Labels** | 4.1.2 | Accessible names and roles | ✅ | Excellent |
| **Form Labels** | 3.3.2 | Proper input labeling | ✅ | Good |
| **Heading Structure** | 1.3.1 | Nested heading hierarchy | ✅ | Good |
| **Link Purpose** | 2.4.4 | Clear link text or context | ✅ | Good |
| **Alternative Text** | 1.1.1 | Image alt attributes | ✅ | Good |
| **Language** | 3.1.1 | Page language specified | ✅ | Basic |
| **Error Handling** | 3.3.1 | Error identification | ⚠️ | Manual |
| **Timeout Management** | 2.2.1 | User control over time limits | ⚠️ | Manual |
| **Motion Control** | 2.3.3 | Reduced motion preferences | ⚠️ | Manual |

### Manual Testing Required

Some WCAG criteria require manual validation:
- **Error Handling**: Verify error messages are helpful and actionable
- **Timeout Management**: Test time limits can be extended or disabled
- **Motion Control**: Verify animations respect `prefers-reduced-motion`
- **Content Structure**: Validate logical reading order
- **Context Changes**: Ensure no unexpected context changes occur

## Component Coverage

### UI Components (100% Target)

| Component | Unit Tests | E2E Tests | Color Contrast | Keyboard Nav | ARIA |
|-----------|------------|-----------|----------------|--------------|------|
| **Button** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Input** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Alert** | ✅ | ✅ | ✅ | N/A | ✅ |
| **Tabs** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Modal** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Form** | ✅ | ✅ | ✅ | ✅ | ✅ |

### Pattern Components (100% Target)

| Pattern | Unit Tests | E2E Tests | Navigation | Structure |
|---------|------------|-----------|------------|-----------|
| **TopNavigation** | ✅ | ✅ | ✅ | ✅ |
| **AppSidebar** | ✅ | ✅ | ✅ | ✅ |
| **DataCard** | ✅ | ✅ | ✅ | ✅ |
| **SearchBar** | ✅ | ✅ | ✅ | ✅ |

## CI/CD Integration

### GitHub Actions Workflow

The accessibility testing pipeline includes:

1. **Unit Tests**: Run on every commit and PR
2. **E2E Tests**: Cross-browser testing on PR and main branch
3. **Coverage Report**: Generate detailed accessibility coverage
4. **Compliance Gate**: Block PRs that don't meet standards
5. **Weekly Audits**: Scheduled comprehensive accessibility reviews

### Accessibility Gates

PRs are blocked if:
- WCAG 2.1 AA compliance fails
- Unit test coverage < 80%
- Component coverage < 80%
- Critical accessibility violations found

### Workflow Commands

```bash
# Local testing before commit
npm run test:a11y:unit
npm run test:a11y
npm run test:a11y:coverage

# Check specific component
npm run test -- Button.test.tsx
```

## Pre-commit Hooks

Accessibility tests run automatically on:
- Component file changes (`src/components/**/*.tsx`)
- Pattern file changes (`src/components/patterns/**/*.tsx`)

Configure in `lint-staged.config.js`:
```javascript
'src/components/**/*.{tsx,ts}': [
  () => 'npm run test:accessibility'
]
```

## Modern Sage Theme Compliance

### Color Combinations Tested

All Modern Sage theme colors are validated for WCAG compliance:

- **Primary buttons**: White text on Green-500 background
- **Secondary buttons**: Green-500 text on white background  
- **Body text**: Slate-900 on white (light), Slate-50 on Slate-900 (dark)
- **Links**: Green-500 (light), Green-400 (dark)

### Responsive Accessibility

Testing across viewport sizes:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1200px  
- **Desktop**: 1200px+

## Best Practices

### Writing Accessible Components

1. **Use Semantic HTML**:
   ```tsx
   // Good
   <button onClick={handleClick}>Submit</button>
   
   // Avoid
   <div onClick={handleClick}>Submit</div>
   ```

2. **Provide Accessible Names**:
   ```tsx
   // Icon buttons need labels
   <Button size="icon" aria-label="Close dialog">
     <X />
   </Button>
   ```

3. **Manage Focus**:
   ```tsx
   // Modal focus management
   <Dialog onOpenChange={setOpen}>
     <DialogContent autoFocus>
       <Button autoFocus>Close</Button>
     </DialogContent>
   </Dialog>
   ```

4. **Use ARIA Appropriately**:
   ```tsx
   // Live regions for dynamic content
   <div aria-live="polite" aria-atomic="true">
     {status}
   </div>
   ```

### Testing Guidelines

1. **Test with Real Screen Readers**: NVDA, JAWS, VoiceOver
2. **Use Keyboard Only**: Tab, Arrow keys, Enter, Space, Escape
3. **Test High Contrast Mode**: Windows High Contrast, forced-colors
4. **Validate Color Blind Experience**: Use color blindness simulators
5. **Test Mobile Accessibility**: Touch targets, screen reader gestures

### Common Issues to Avoid

1. **Insufficient Color Contrast**:
   ```css
   /* Avoid - fails WCAG AA */
   color: #999; /* 2.85:1 on white */
   
   /* Good - passes WCAG AA */  
   color: #666; /* 5.74:1 on white */
   ```

2. **Missing Focus Indicators**:
   ```css
   /* Avoid */
   button:focus { outline: none; }
   
   /* Good */
   button:focus { outline: 2px solid blue; }
   ```

3. **Inaccessible Forms**:
   ```tsx
   // Avoid - no label association
   <label>Email</label>
   <input type="email" />
   
   // Good - proper association
   <label htmlFor="email">Email</label>
   <input id="email" type="email" />
   ```

## Troubleshooting

### Common Test Failures

1. **Color Contrast Failures**:
   - Check Modern Sage theme colors
   - Verify text size calculations
   - Test in different theme modes

2. **Keyboard Navigation Issues**:
   - Ensure proper tab order
   - Check focus indicators are visible
   - Verify keyboard event handlers

3. **ARIA Violations**:
   - Validate required ARIA children/parents
   - Check for unique IDs
   - Ensure proper role usage

### Debugging Tools

1. **Browser DevTools**:
   - Chrome: Lighthouse accessibility audit
   - Firefox: Accessibility inspector
   - Safari: Web Inspector accessibility

2. **axe-core Browser Extension**:
   - Real-time accessibility testing
   - Detailed violation reports
   - Code snippets for fixes

3. **Manual Testing**:
   - Screen reader testing
   - Keyboard-only navigation
   - High contrast mode validation

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist)

### Testing Tools
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/)
- [JAWS (Trial)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS/iOS)](https://support.apple.com/guide/voiceover/)

## Support

For accessibility testing questions or issues:

1. Check this documentation first
2. Run `npm run test:a11y:coverage` for current status
3. Review test failures in detail
4. Consult WCAG guidelines for specific requirements
5. Test manually with assistive technologies

Remember: Automated testing catches ~30-50% of accessibility issues. Manual testing with real assistive technologies is essential for comprehensive accessibility compliance.