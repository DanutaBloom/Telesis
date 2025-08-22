#!/usr/bin/env node

/**
 * Modern Sage Color Contrast Validator
 *
 * Tests actual color values from the Modern Sage palette
 * against WCAG 2.1 AA contrast requirements
 */

// WCAG 2.1 AA Standards
const WCAG_CONTRAST_RATIOS = {
  NORMAL_TEXT_AA: 4.5,
  LARGE_TEXT_AA: 3.0,
  NORMAL_TEXT_AAA: 7.0,
  LARGE_TEXT_AAA: 4.5,
  NON_TEXT_AA: 3.0,
};

/**
 * Parse RGB color string to RGB values
 */
function parseRGB(rgb) {
  // Handle rgb(r, g, b) and rgba(r, g, b, a)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) {
 return null;
}
  return {
    r: Number.parseInt(match[1], 10),
    g: Number.parseInt(match[2], 10),
    b: Number.parseInt(match[3], 10),
  };
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  }
: null;
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0; let g = 0; let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

/**
 * Convert RGB to relative luminance
 */
function getRelativeLuminance(r, g, b) {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  const rLinear = rs <= 0.03928 ? rs / 12.92 : ((rs + 0.055) / 1.055) ** 2.4;
  const gLinear = gs <= 0.03928 ? gs / 12.92 : ((gs + 0.055) / 1.055) ** 2.4;
  const bLinear = bs <= 0.03928 ? bs / 12.92 : ((bs + 0.055) / 1.055) ** 2.4;

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
  // Parse colors
  let rgb1, rgb2;

  if (color1.startsWith('#')) {
    rgb1 = hexToRgb(color1);
  } else if (color1.startsWith('rgb')) {
    rgb1 = parseRGB(color1);
  } else if (color1.startsWith('hsl')) {
    // Parse HSL
    const hslMatch = color1.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      rgb1 = hslToRgb(Number.parseInt(hslMatch[1]), Number.parseInt(hslMatch[2]), Number.parseInt(hslMatch[3]));
    }
  }

  if (color2.startsWith('#')) {
    rgb2 = hexToRgb(color2);
  } else if (color2.startsWith('rgb')) {
    rgb2 = parseRGB(color2);
  } else if (color2.startsWith('hsl')) {
    // Parse HSL
    const hslMatch = color2.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      rgb2 = hslToRgb(Number.parseInt(hslMatch[1]), Number.parseInt(hslMatch[2]), Number.parseInt(hslMatch[3]));
    }
  }

  if (!rgb1 || !rgb2) {
    console.warn(`Unable to parse colors: ${color1}, ${color2}`);
    return 0;
  }

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Modern Sage Color Palette (from design system)
const MODERN_SAGE_COLORS = {
  // Sage colors (from HSL values in logo component)
  'sage-quietude': 'hsl(171, 19%, 41%)', // From logo component
  'sage-growth': 'hsl(102, 58%, 38%)', // From logo component

  // Standard colors for comparison
  'white': '#ffffff',
  'black': '#000000',
  'slate-900': '#0f172a',
  'slate-50': '#f8fafc',
  'slate-500': '#64748b',
  'slate-400': '#94a3b8',

  // Green variants (potential button colors)
  'green-500': '#22c55e',
  'green-600': '#16a34a',
  'green-700': '#15803d',
  'green-400': '#4ade80',
};

// Test combinations based on the failing tests
const COLOR_COMBINATIONS_TO_TEST = [
  // Primary button combinations (the failing test case)
  {
    name: 'Primary Button - White on Green-500',
    foreground: MODERN_SAGE_COLORS.white,
    background: MODERN_SAGE_COLORS['green-500'],
    context: 'Primary CTA buttons',
    expected: 'Should meet AA standard (4.5:1)'
  },
  {
    name: 'Primary Button - White on Green-600',
    foreground: MODERN_SAGE_COLORS.white,
    background: MODERN_SAGE_COLORS['green-600'],
    context: 'Primary CTA buttons (darker)',
    expected: 'Should meet AA standard (4.5:1)'
  },
  {
    name: 'Primary Button - White on Green-700',
    foreground: MODERN_SAGE_COLORS.white,
    background: MODERN_SAGE_COLORS['green-700'],
    context: 'Primary CTA buttons (darkest)',
    expected: 'Should meet AA standard (4.5:1)'
  },

  // Secondary button combinations
  {
    name: 'Secondary Button - Green-500 on White',
    foreground: MODERN_SAGE_COLORS['green-500'],
    background: MODERN_SAGE_COLORS.white,
    context: 'Secondary buttons with border',
    expected: 'Should meet AA standard (4.5:1)'
  },
  {
    name: 'Secondary Button - Green-600 on White',
    foreground: MODERN_SAGE_COLORS['green-600'],
    background: MODERN_SAGE_COLORS.white,
    context: 'Secondary buttons with border (darker)',
    expected: 'Should meet AA standard (4.5:1)'
  },

  // Brand color combinations
  {
    name: 'Sage Quietude on White',
    foreground: MODERN_SAGE_COLORS['sage-quietude'],
    background: MODERN_SAGE_COLORS.white,
    context: 'Brand primary text',
    expected: 'Should meet AA standard (4.5:1)'
  },
  {
    name: 'Sage Growth on White',
    foreground: MODERN_SAGE_COLORS['sage-growth'],
    background: MODERN_SAGE_COLORS.white,
    context: 'Brand accent text',
    expected: 'Should meet AA standard (4.5:1)'
  },

  // Body text combinations
  {
    name: 'Body Text - Slate-900 on White',
    foreground: MODERN_SAGE_COLORS['slate-900'],
    background: MODERN_SAGE_COLORS.white,
    context: 'Main body text',
    expected: 'Should exceed AA standard'
  },
  {
    name: 'Muted Text - Slate-500 on White',
    foreground: MODERN_SAGE_COLORS['slate-500'],
    background: MODERN_SAGE_COLORS.white,
    context: 'Secondary/muted text',
    expected: 'Should meet AA standard (4.5:1)'
  },
];

console.log('🎨 Modern Sage Color Contrast Validation\n');
console.log('='.repeat(70));
console.log('Testing color combinations against WCAG 2.1 AA standards (4.5:1 ratio)\n');

let passCount = 0;
const totalCount = COLOR_COMBINATIONS_TO_TEST.length;
const failures = [];

COLOR_COMBINATIONS_TO_TEST.forEach((combo, index) => {
  const ratio = calculateContrastRatio(combo.foreground, combo.background);
  const meetsAA = ratio >= WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AA;
  const meetsAAA = ratio >= WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AAA;

  const status = meetsAAA ? 'AAA ✨' : meetsAA ? 'AA ✅' : 'FAIL ❌';

  console.log(`${index + 1}. ${combo.name}`);
  console.log(`   Foreground: ${combo.foreground}`);
  console.log(`   Background: ${combo.background}`);
  console.log(`   Contrast Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`   Status: ${status}`);
  console.log(`   Context: ${combo.context}`);
  console.log(`   Expected: ${combo.expected}`);
  console.log('');

  if (meetsAA) {
    passCount++;
  } else {
    failures.push({
      ...combo,
      ratio: ratio.toFixed(2),
      required: WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AA
    });
  }
});

// Summary Report
console.log('='.repeat(70));
console.log('📊 SUMMARY REPORT');
console.log('='.repeat(70));

const passPercentage = Math.round((passCount / totalCount) * 100);

console.log(`\n🎯 Overall Results: ${passCount}/${totalCount} combinations pass WCAG AA (${passPercentage}%)`);

if (failures.length > 0) {
  console.log(`\n❌ Failed Combinations (${failures.length}):`);
  console.log('-'.repeat(50));

  failures.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.name}`);
    console.log(`   Current Ratio: ${failure.ratio}:1`);
    console.log(`   Required Ratio: ${failure.required}:1`);
    console.log(`   Gap: ${(failure.required - Number.parseFloat(failure.ratio)).toFixed(2)}`);
    console.log('');
  });

  console.log('🔧 RECOMMENDED FIXES:');

  failures.forEach((failure) => {
    if (failure.name.includes('Primary Button')) {
      console.log(`• For "${failure.name}": Use a darker green (green-600 or green-700) instead of green-500`);
    } else if (failure.name.includes('Secondary Button')) {
      console.log(`• For "${failure.name}": Use a darker green for better contrast`);
    } else {
      console.log(`• For "${failure.name}": Adjust colors to achieve ${failure.required}:1 minimum ratio`);
    }
  });
}

// Specific recommendations for Modern Sage palette
console.log('\n💡 MODERN SAGE PALETTE RECOMMENDATIONS:');

console.log('\n🟢 Primary Button Colors:');
const whiteonGreen500 = calculateContrastRatio('#ffffff', '#22c55e');
const whiteonGreen600 = calculateContrastRatio('#ffffff', '#16a34a');
const whiteonGreen700 = calculateContrastRatio('#ffffff', '#15803d');

console.log(`   • Green-500 (#22c55e): ${whiteonGreen500.toFixed(2)}:1 ${whiteonGreen500 >= 4.5 ? '✅' : '❌'}`);
console.log(`   • Green-600 (#16a34a): ${whiteonGreen600.toFixed(2)}:1 ${whiteonGreen600 >= 4.5 ? '✅' : '❌'} (RECOMMENDED)`);
console.log(`   • Green-700 (#15803d): ${whiteonGreen700.toFixed(2)}:1 ${whiteonGreen700 >= 4.5 ? '✅' : '❌'}`);

console.log('\n🎨 Brand Colors:');
const sageQuietudeRatio = calculateContrastRatio('hsl(171, 19%, 41%)', '#ffffff');
const sageGrowthRatio = calculateContrastRatio('hsl(102, 58%, 38%)', '#ffffff');

console.log(`   • Sage Quietude: ${sageQuietudeRatio.toFixed(2)}:1 ${sageQuietudeRatio >= 4.5 ? '✅' : '❌'}`);
console.log(`   • Sage Growth: ${sageGrowthRatio.toFixed(2)}:1 ${sageGrowthRatio >= 4.5 ? '✅' : '❌'}`);

console.log('\n📋 ACTION ITEMS:');
if (passPercentage < 100) {
  console.log('1. Update button component to use green-600 instead of green-500 for primary buttons');
  console.log('2. Test all color combinations in actual components');
  console.log('3. Update colorContrastUtils.ts with corrected color values');
  console.log('4. Re-run accessibility tests to verify improvements');
  console.log('5. Consider AAA compliance (7:1 ratio) for enhanced accessibility');
}

console.log('\n✨ VALIDATION COMPLETE');

// Generate recommendations file
const fs = require('node:fs');

const recommendations = `
MODERN SAGE COLOR CONTRAST RECOMMENDATIONS
Generated: ${new Date().toLocaleString()}

SUMMARY: ${passPercentage}% of color combinations meet WCAG AA standards

FAILING COMBINATIONS:
${failures.map(f => `- ${f.name}: ${f.ratio}:1 (needs ${f.required}:1)`).join('\n')}

RECOMMENDED FIXES:
1. Primary Buttons: Use green-600 (#16a34a) background for white text
2. Secondary Buttons: Ensure green text on white meets 4.5:1 ratio
3. Brand Colors: Verify Sage Quietude and Sage Growth meet standards

NEXT STEPS:
- Update button component color variants
- Test color changes in actual UI components  
- Validate with screen readers and high contrast mode
- Document approved color combinations for design system
`;

fs.writeFileSync('color-contrast-recommendations.txt', recommendations);
console.log('📄 Recommendations saved to: color-contrast-recommendations.txt');

process.exit(failures.length === 0 ? 0 : 1);
