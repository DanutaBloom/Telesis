# Three Olives Logo Brand Guidelines

## Overview

The Three Olives logo is the visual embodiment of Telesis's learning philosophy: "Ask. Think. Apply." Rooted in Ancient Greek symbolism, the three olives represent the progressive journey from inquiry to wisdom to practical application.

## Philosophy & Symbolism

### Ancient Greek Heritage

The olive tree was sacred to Athena, goddess of wisdom and strategic thinking, making it the perfect symbol for a learning platform. Our logo draws from this rich philosophical tradition:

- **Athena's Gift**: The olive tree was Athena's patronage gift to Athens, directly linking olives to wisdom and learning
- **Olympic Victory**: Olive wreaths crowned Olympic victors, symbolizing achievement and mastery
- **Peace & Clarity**: The olive branch represents the clarity and peace of mind that comes from understanding

### The Three Pillars

Each olive represents a stage in the philosophical learning process:

1. **Ask (Socrates)** - *Outlined Olive*
   - Represents inquiry and potential
   - The Socratic method of disciplined questioning
   - Visual treatment: Outlined in Quietude color (#557C76) - WCAG AA Compliant

2. **Think (Plato)** - *Solid Sage Olive*
   - Embodies contemplation and deep reasoning
   - Plato's Academy focus on dialogue and refinement of ideas
   - Visual treatment: Solid fill in Quietude color (#557C76) - WCAG AA Compliant

3. **Apply (Aristotle)** - *Vibrant Growth Olive*
   - Represents successful application and concrete outcomes
   - Aristotelian empiricism and practical application
   - Visual treatment: Solid fill in Growth color (#4C9A2A)

## Logo Variants

### 1. Horizontal Layout (Primary)
- **Use**: Primary logo for headers, navigation, business cards
- **File**: `three-olives-horizontal.svg`
- **Proportions**: 5:1 ratio (width:height)
- **Min Size**: 120px width

### 2. Stacked Layout
- **Use**: Hero sections, marketing materials, social media
- **File**: `three-olives-stacked.svg` 
- **Features**: Includes tagline "Ask. Think. Apply."
- **Proportions**: 3:2 ratio (width:height)
- **Min Size**: 80px width

### 3. Logomark Only
- **Use**: Favicons, app icons, small spaces, watermarks
- **File**: `three-olives-logomark.svg`
- **Proportions**: 8:3 ratio (width:height)
- **Min Size**: 24px width

### 4. Favicon
- **Use**: Browser tabs, bookmarks, mobile app icons
- **File**: `three-olives-favicon.svg`
- **Simplification**: Uses circles instead of ellipses for clarity
- **Size**: 16x16px optimized

## Color Variations

### Full Color (Default)
- **Primary Use**: Digital applications, marketing materials
- **Colors**: 
  - Ask: Transparent with Quietude stroke (#557C76) - WCAG AA Compliant
  - Think: Quietude fill (#557C76) - WCAG AA Compliant 
  - Apply: Growth fill (#4C9A2A)
- **Background**: Light backgrounds only

### Monochrome
- **Use**: Single-color printing, embossing, limited color contexts
- **File**: `three-olives-monochrome.svg`
- **Implementation**: Uses `currentColor` - inherits text color
- **Minimum Contrast**: 4.5:1 for accessibility compliance

### Reverse (White)
- **Use**: Dark backgrounds, photography overlays
- **File**: `three-olives-reverse.svg`
- **Color**: Pure white (#ffffff)
- **Background**: Dark backgrounds with minimum 4.5:1 contrast

## Technical Specifications

### SVG Optimization
- **Format**: Scalable Vector Graphics (SVG)
- **Optimization**: SVGOMG optimized for minimal file size
- **Accessibility**: Includes `<title>` and `<desc>` elements
- **Attributes**: `role="img"` for screen readers

### Responsive Sizing
- **Small (32px)**: Simplified details, increased stroke width
- **Default (48px)**: Standard proportions
- **Large (64px+)**: Full detail preservation
- **Maximum**: Unlimited - vector scalability

### CSS Integration
```css
/* Modern Sage color variables available */
--sage-quietude: hsl(173, 23%, 71%);
--sage-growth: hsl(102, 58%, 38%);
```

## Usage Guidelines

### ✅ DO

- Use adequate clear space (minimum 1/2 logo height on all sides)
- Maintain original proportions when resizing
- Use appropriate variant for context and size
- Ensure sufficient color contrast (WCAG 2.1 AA: 4.5:1 minimum)
- Place on clean, uncluttered backgrounds
- Use monochrome version when color printing is unavailable

### ❌ DON'T

- Alter the logo colors except for approved variations
- Stretch, skew, or distort the logo proportions
- Place over busy backgrounds that compromise legibility
- Use low-resolution raster formats when SVG is available
- Separate the three olives or use them individually
- Add effects like drop shadows, outlines, or gradients
- Place text too close to the logo

## Minimum Clear Space

Maintain clear space around the logo equal to half the height of the logo on all sides. This ensures the logo has proper breathing room and maximum visual impact.

```
[----X----][LOGO][----X----]
     ↕           ↕
   1/2 logo    1/2 logo
   height      height
```

## Accessibility Compliance

### WCAG 2.1 AA Standards
- **Color Contrast**: All variants meet 4.5:1 minimum contrast ratio
- **Screen Readers**: SVGs include proper ARIA labels and descriptions
- **Keyboard Navigation**: Logo components are focusable when interactive
- **Alternative Text**: Descriptive alt text provided for all contexts

### Inclusive Design
- **Color Independence**: Logo meaning doesn't rely solely on color
- **Size Flexibility**: Readable across all device sizes
- **Motor Accessibility**: Click/tap targets meet 44px minimum when interactive

## File Organization

```
public/logos/
├── three-olives-horizontal.svg     # Primary horizontal logo
├── three-olives-stacked.svg        # Stacked with tagline
├── three-olives-logomark.svg       # Icon-only version
├── three-olives-monochrome.svg     # Single color version
├── three-olives-reverse.svg        # White for dark backgrounds
└── three-olives-favicon.svg        # 16x16 optimized version

src/components/brand/
├── ThreeOlivesLogo.tsx             # React component
└── index.ts                        # Exports
```

## Implementation Examples

### React Component Usage
```tsx
import { ThreeOlivesLogo } from '@/components/brand';

// Primary logo
<ThreeOlivesLogo variant="horizontal" size="lg" />

// Favicon/icon usage
<ThreeOlivesLogo variant="logomark" size="sm" />

// Dark background
<ThreeOlivesLogo colorScheme="reverse" />

// Monochrome
<ThreeOlivesLogo colorScheme="monochrome" />
```

### HTML/CSS Usage
```html
<!-- Direct SVG usage -->
<img src="/logos/three-olives-horizontal.svg" alt="Telesis - Ask, Think, Apply" />

<!-- Inline SVG for styling control -->
<svg class="logo">
  <!-- SVG content -->
</svg>
```

## Brand Consistency

The Three Olives logo is a cornerstone of Telesis's visual identity. Consistent application across all touchpoints reinforces brand recognition and builds trust with users. When in doubt, refer to these guidelines or contact the design team.

## Contact

For questions about logo usage, additional formats, or brand guidelines:
- Design System: `/src/components/brand/`
- Documentation: `/docs/three-olives-brand-guidelines.md`
- Examples: ModernSageShowcase component

---

*Last updated: Sprint 2, TEL-12 Three Olives Logo Design*