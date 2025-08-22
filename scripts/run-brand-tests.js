#!/usr/bin/env node

/**
 * Brand System E2E Test Runner
 * 
 * This script provides a convenient way to run all brand-related E2E tests
 * with proper configuration and reporting.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Test configurations
const testSuites = {
  all: {
    name: 'All Brand Tests',
    pattern: 'tests/e2e/brand/',
    description: 'Run all brand system E2E tests'
  },
  core: {
    name: 'Core Brand System',
    pattern: 'tests/e2e/brand/comprehensive-brand-system.e2e.ts',
    description: 'Test TelesisLogo component and core brand functionality'
  },
  visual: {
    name: 'Visual Regression',
    pattern: 'tests/e2e/brand/logo-visual.e2e.ts',
    description: 'Test visual consistency and regression detection'
  },
  accessibility: {
    name: 'Accessibility Compliance',
    pattern: 'tests/e2e/brand/logo-accessibility.e2e.ts',
    description: 'Test WCAG compliance and accessibility features'
  },
  responsive: {
    name: 'Responsive Design',
    pattern: 'tests/e2e/brand/responsive-typography.e2e.ts',
    description: 'Test responsive behavior across all breakpoints'
  },
  themes: {
    name: 'Theme Switching',
    pattern: 'tests/e2e/brand/theme-switching.e2e.ts',
    description: 'Test dark/light theme transitions and brand adaptation'
  },
  browsers: {
    name: 'Cross-Browser Compatibility',
    pattern: 'tests/e2e/brand/cross-browser-compatibility.e2e.ts',
    description: 'Test brand components across different browsers'
  },
  performance: {
    name: 'Performance Testing',
    pattern: 'tests/e2e/brand/logo-performance.perf.ts',
    description: 'Test logo loading and rendering performance'
  },
  validation: {
    name: 'Brand Validation',
    pattern: 'tests/e2e/brand/telesis-branding-validation.e2e.ts',
    description: 'Test brand consistency across application pages'
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const suiteArg = args[0] || 'all';
const additionalArgs = args.slice(1);

// Help function
function showHelp() {
  console.log(`${colors.bright}${colors.cyan}🧪 Telesis Brand System E2E Test Runner${colors.reset}\n`);
  console.log(`${colors.bright}Usage:${colors.reset} npm run brand:test [suite] [options]\n`);
  console.log(`${colors.bright}Available Test Suites:${colors.reset}`);
  
  Object.entries(testSuites).forEach(([key, suite]) => {
    console.log(`  ${colors.yellow}${key.padEnd(12)}${colors.reset} ${suite.name}`);
    console.log(`  ${colors.dim}${''.padEnd(12)} ${suite.description}${colors.reset}`);
  });
  
  console.log(`\n${colors.bright}Examples:${colors.reset}`);
  console.log(`  npm run brand:test                    # Run all brand tests`);
  console.log(`  npm run brand:test core               # Run core brand system tests`);
  console.log(`  npm run brand:test visual             # Run visual regression tests`);
  console.log(`  npm run brand:test accessibility      # Run accessibility tests`);
  console.log(`  npm run brand:test --headed           # Run with visible browser`);
  console.log(`  npm run brand:test --debug            # Run with debug output`);
  
  console.log(`\n${colors.bright}Additional Playwright Options:${colors.reset}`);
  console.log(`  --headed          Run tests in headed mode (visible browser)`);
  console.log(`  --debug           Run tests in debug mode`);
  console.log(`  --ui              Run tests with Playwright UI mode`);
  console.log(`  --reporter=html   Generate HTML report`);
  console.log(`  --project=name    Run tests for specific project`);
}

// Main execution function
async function runTests() {
  // Show help if requested
  if (suiteArg === 'help' || suiteArg === '--help' || suiteArg === '-h') {
    showHelp();
    return;
  }

  // Get test suite configuration
  const suite = testSuites[suiteArg];
  if (!suite) {
    console.error(`${colors.red}❌ Unknown test suite: ${suiteArg}${colors.reset}`);
    console.log(`\nAvailable suites: ${Object.keys(testSuites).join(', ')}`);
    console.log(`Run 'npm run brand:test help' for more information.`);
    process.exit(1);
  }

  console.log(`${colors.bright}${colors.cyan}🧪 Running Telesis Brand Tests${colors.reset}`);
  console.log(`${colors.bright}Suite:${colors.reset} ${suite.name}`);
  console.log(`${colors.bright}Description:${colors.reset} ${suite.description}`);
  console.log(`${colors.bright}Pattern:${colors.reset} ${suite.pattern}\n`);

  // Check if test files exist
  const testPath = path.join(process.cwd(), suite.pattern);
  if (!fs.existsSync(testPath)) {
    console.error(`${colors.red}❌ Test file not found: ${testPath}${colors.reset}`);
    process.exit(1);
  }

  // Build command arguments
  const playwrightArgs = [
    'test',
    suite.pattern,
    '--reporter=html,line', // Generate both HTML report and line output
    ...additionalArgs
  ];

  console.log(`${colors.dim}Running: npx playwright ${playwrightArgs.join(' ')}${colors.reset}\n`);

  // Execute Playwright tests
  const playwright = spawn('npx', ['playwright', ...playwrightArgs], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  playwright.on('close', (code) => {
    if (code === 0) {
      console.log(`\n${colors.green}✅ Tests completed successfully!${colors.reset}`);
      console.log(`\n${colors.bright}Test Report:${colors.reset}`);
      console.log(`  HTML Report: ${colors.cyan}npx playwright show-report${colors.reset}`);
      console.log(`  Results: ./test-results/playwright-report/index.html`);
      
      // Show additional information for specific suites
      if (suiteArg === 'visual') {
        console.log(`\n${colors.bright}Visual Regression:${colors.reset}`);
        console.log(`  Screenshots saved to: ./test-results/`);
        console.log(`  Compare actual vs expected images in HTML report`);
      }
      
      if (suiteArg === 'accessibility') {
        console.log(`\n${colors.bright}Accessibility Report:${colors.reset}`);
        console.log(`  WCAG compliance results available in HTML report`);
        console.log(`  Check console output for detailed accessibility violations`);
      }
      
      if (suiteArg === 'performance') {
        console.log(`\n${colors.bright}Performance Metrics:${colors.reset}`);
        console.log(`  Performance data available in HTML report`);
        console.log(`  Check console for detailed timing information`);
      }
    } else {
      console.log(`\n${colors.red}❌ Tests failed with exit code ${code}${colors.reset}`);
      console.log(`\n${colors.bright}Troubleshooting:${colors.reset}`);
      console.log(`  1. Check HTML report: ${colors.cyan}npx playwright show-report${colors.reset}`);
      console.log(`  2. Review failed test screenshots in ./test-results/`);
      console.log(`  3. Run with --headed flag to see browser interactions`);
      console.log(`  4. Use --debug flag for step-by-step debugging`);
    }
    
    process.exit(code);
  });

  playwright.on('error', (error) => {
    console.error(`${colors.red}❌ Failed to run tests: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

// Handle process signals
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}⚠️  Test execution interrupted${colors.reset}`);
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}⚠️  Test execution terminated${colors.reset}`);
  process.exit(143);
});

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}❌ Unexpected error: ${error.message}${colors.reset}`);
  process.exit(1);
});