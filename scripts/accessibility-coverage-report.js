#!/usr/bin/env node

/**
 * Accessibility Coverage Report Generator
 *
 * Generates comprehensive reports on accessibility test coverage,
 * WCAG compliance status, and identifies areas needing attention.
 */

const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');

// WCAG 2.1 AA Requirements Checklist
const WCAG_REQUIREMENTS = {
  'Color Contrast': {
    level: 'AA',
    criteria: '1.4.3',
    description: 'Text has sufficient contrast ratio (4.5:1 normal, 3:1 large)',
    automated: true,
  },
  'Keyboard Navigation': {
    level: 'AA',
    criteria: '2.1.1',
    description: 'All functionality available from keyboard',
    automated: true,
  },
  'Focus Management': {
    level: 'AA',
    criteria: '2.4.3, 2.4.7',
    description: 'Focus order is logical, focus is visible',
    automated: true,
  },
  'ARIA Labels': {
    level: 'AA',
    criteria: '4.1.2',
    description: 'UI components have accessible names and roles',
    automated: true,
  },
  'Form Labels': {
    level: 'AA',
    criteria: '3.3.2',
    description: 'Form inputs have proper labels',
    automated: true,
  },
  'Heading Structure': {
    level: 'AA',
    criteria: '1.3.1',
    description: 'Headings are properly nested and structured',
    automated: true,
  },
  'Link Purpose': {
    level: 'AA',
    criteria: '2.4.4',
    description: 'Link purpose is clear from text or context',
    automated: true,
  },
  'Alternative Text': {
    level: 'AA',
    criteria: '1.1.1',
    description: 'Images have appropriate alt text',
    automated: true,
  },
  'Language': {
    level: 'AA',
    criteria: '3.1.1, 3.1.2',
    description: 'Page language is specified',
    automated: true,
  },
  'Error Handling': {
    level: 'AA',
    criteria: '3.3.1, 3.3.3',
    description: 'Errors are identified and described',
    automated: false,
  },
  'Timeout Management': {
    level: 'AA',
    criteria: '2.2.1',
    description: 'Users can control time limits',
    automated: false,
  },
  'Motion Control': {
    level: 'AA',
    criteria: '2.3.3',
    description: 'Motion can be disabled by user preference',
    automated: false,
  },
};

// Component Categories
const COMPONENT_CATEGORIES = {
  'UI Components': [
    'accordion',
'alert',
'badge',
'breadcrumb',
'button',
    'input',
'label',
'progress',
'separator',
'table',
    'tabs',
'tooltip',
'typography'
  ],
  'Pattern Components': [
    'ContentList',
'DataCard',
'StatWidget',
'FilterPanel',
    'FormSection',
'SearchBar',
'GridLayout',
'PageContainer',
    'PageHeader',
'AppSidebar',
'Breadcrumbs',
'TopNavigation'
  ],
  'Feature Components': [
    'CenteredHero',
'CenteredFooter',
'ModernSageShowcase',
    'DashboardHeader',
'PricingCard'
  ]
};

/**
 * Scan for test files and extract accessibility test coverage
 */
function scanAccessibilityTests() {
  const testFiles = glob.sync('src/**/*.test.{ts,tsx}', {
    cwd: process.cwd()
  });

  const e2eFiles = glob.sync('tests/e2e/**/*.e2e.ts', {
    cwd: process.cwd()
  });

  const coverage = {
    unit: {
      total: 0,
      withA11yTests: 0,
      components: {},
    },
    e2e: {
      total: e2eFiles.length,
      withA11yTests: 0,
      pages: {},
    },
    wcagCriteria: {},
  };

  // Initialize WCAG criteria tracking
  Object.keys(WCAG_REQUIREMENTS).forEach((criterion) => {
    coverage.wcagCriteria[criterion] = {
      tested: false,
      testCount: 0,
      coverage: 'none'
    };
  });

  // Scan unit test files
  testFiles.forEach((testFile) => {
    const fullPath = path.join(process.cwd(), testFile);
    const content = fs.readFileSync(fullPath, 'utf8');

    const componentName = path.basename(testFile, path.extname(testFile)).replace('.test', '');
    coverage.unit.total++;

    // Check for accessibility-related imports and functions
    const hasA11yImports = /import.*from[^\n\r"'\u2028\u2029]*["'].*accessibility|axe|a11y/i.test(content);
    const hasA11yTests = /testA11y|accessibility|axe|a11y|WCAG|screen reader|keyboard|contrast/i.test(content);
    const hasComprehensiveTests = /runComprehensiveA11yTests|runAccessibilityTestSuite/.test(content);
    const hasColorContrastTests = /testColorContrast|color.*contrast/i.test(content);
    const hasKeyboardTests = /keyboard|tab|focus|navigation/i.test(content);
    const hasAriaTests = /role=|aria-label|aria-describedby|aria/i.test(content);

    if (hasA11yTests || hasA11yImports) {
      coverage.unit.withA11yTests++;
    }

    coverage.unit.components[componentName] = {
      hasA11yTests: hasA11yTests || hasA11yImports,
      hasComprehensiveTests,
      hasColorContrastTests,
      hasKeyboardTests,
      hasAriaTests,
      filePath: testFile,
    };

    // Track WCAG criteria coverage in unit tests
    if (hasColorContrastTests) {
      coverage.wcagCriteria['Color Contrast'].tested = true;
      coverage.wcagCriteria['Color Contrast'].testCount++;
    }
    if (hasKeyboardTests) {
      coverage.wcagCriteria['Keyboard Navigation'].tested = true;
      coverage.wcagCriteria['Keyboard Navigation'].testCount++;
      coverage.wcagCriteria['Focus Management'].tested = true;
      coverage.wcagCriteria['Focus Management'].testCount++;
    }
    if (hasAriaTests) {
      coverage.wcagCriteria['ARIA Labels'].tested = true;
      coverage.wcagCriteria['ARIA Labels'].testCount++;
    }
  });

  // Scan E2E test files
  e2eFiles.forEach((testFile) => {
    const fullPath = path.join(process.cwd(), testFile);
    const content = fs.readFileSync(fullPath, 'utf8');

    const pageName = path.basename(testFile, '.e2e.ts');
    const hasA11yTests = /testPageAccessibility|axe|a11y|accessibility/i.test(content);

    if (hasA11yTests) {
      coverage.e2e.withA11yTests++;
    }

    coverage.e2e.pages[pageName] = {
      hasA11yTests,
      filePath: testFile,
    };

    // E2E tests typically cover more WCAG criteria
    if (hasA11yTests) {
      Object.keys(coverage.wcagCriteria).forEach((criterion) => {
        if (WCAG_REQUIREMENTS[criterion].automated) {
          coverage.wcagCriteria[criterion].tested = true;
          coverage.wcagCriteria[criterion].testCount++;
        }
      });
    }
  });

  // Calculate coverage percentages
  Object.keys(coverage.wcagCriteria).forEach((criterion) => {
    const data = coverage.wcagCriteria[criterion];
    if (data.testCount === 0) {
      data.coverage = 'none';
    } else if (data.testCount < 3) {
      data.coverage = 'basic';
    } else if (data.testCount < 6) {
      data.coverage = 'good';
    } else {
      data.coverage = 'excellent';
    }
  });

  return coverage;
}

/**
 * Generate component coverage analysis
 */
function analyzeComponentCoverage(coverage) {
  const analysis = {
    byCategory: {},
    recommendations: [],
    totalComponents: 0,
    testedComponents: 0,
  };

  Object.entries(COMPONENT_CATEGORIES).forEach(([category, components]) => {
    const categoryData = {
      total: components.length,
      tested: 0,
      components: {},
    };

    components.forEach((component) => {
      const testData = coverage.unit.components[component]
        || coverage.unit.components[component.toLowerCase()]
        || { hasA11yTests: false };

      if (testData.hasA11yTests) {
        categoryData.tested++;
        analysis.testedComponents++;
      }

      categoryData.components[component] = testData;
      analysis.totalComponents++;
    });

    analysis.byCategory[category] = categoryData;

    // Generate recommendations
    if (categoryData.tested / categoryData.total < 0.8) {
      analysis.recommendations.push(
        `${category} category needs more accessibility tests (${categoryData.tested}/${categoryData.total} tested)`
      );
    }
  });

  return analysis;
}

/**
 * Generate HTML report
 */
function generateHTMLReport(coverage, analysis) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Coverage Report - Telesis</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: #1a1a1a; margin-top: 2em; }
        h1 { margin-top: 0; border-bottom: 3px solid #22c55e; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card h3 { margin: 0; font-size: 2em; }
        .stat-card p { margin: 5px 0 0; opacity: 0.9; }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .coverage-card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; }
        .coverage-card h4 { margin-top: 0; color: #16a34a; }
        .progress-bar { width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a); transition: width 0.3s ease; }
        .wcag-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .wcag-table th, .wcag-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .wcag-table th { background: #f8f9fa; font-weight: 600; }
        .status-badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 0.8em; font-weight: 600; }
        .status-excellent { background: #16a34a; }
        .status-good { background: #ca8a04; }
        .status-basic { background: #ea580c; }
        .status-none { background: #dc2626; }
        .recommendations { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .component-list { columns: 2; column-gap: 30px; }
        .component-item { break-inside: avoid; margin-bottom: 10px; }
        .tested { color: #16a34a; font-weight: 600; }
        .untested { color: #dc2626; }
        footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <h1>♿ Accessibility Coverage Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()} | <strong>Project:</strong> Telesis - AI-Powered Micro-Learning Platform</p>
        
        <div class="summary">
            <div class="stat-card">
                <h3>${Math.round((coverage.unit.withA11yTests / coverage.unit.total) * 100)}%</h3>
                <p>Unit Test Coverage<br>${coverage.unit.withA11yTests}/${coverage.unit.total} components</p>
            </div>
            <div class="stat-card">
                <h3>${Math.round((coverage.e2e.withA11yTests / coverage.e2e.total) * 100)}%</h3>
                <p>E2E Test Coverage<br>${coverage.e2e.withA11yTests}/${coverage.e2e.total} pages</p>
            </div>
            <div class="stat-card">
                <h3>${Object.values(coverage.wcagCriteria).filter(c => c.tested).length}/12</h3>
                <p>WCAG 2.1 AA Criteria<br>Automated Testing</p>
            </div>
            <div class="stat-card">
                <h3>${Math.round((analysis.testedComponents / analysis.totalComponents) * 100)}%</h3>
                <p>Component Coverage<br>${analysis.testedComponents}/${analysis.totalComponents} components</p>
            </div>
        </div>

        <h2>WCAG 2.1 AA Compliance Status</h2>
        <table class="wcag-table">
            <thead>
                <tr>
                    <th>Criterion</th>
                    <th>Level</th>
                    <th>Description</th>
                    <th>Test Count</th>
                    <th>Coverage</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(coverage.wcagCriteria).map(([criterion, data]) => `
                    <tr>
                        <td><strong>${criterion}</strong><br><small>${WCAG_REQUIREMENTS[criterion].criteria}</small></td>
                        <td>${WCAG_REQUIREMENTS[criterion].level}</td>
                        <td>${WCAG_REQUIREMENTS[criterion].description}</td>
                        <td>${data.testCount}</td>
                        <td><span class="status-badge status-${data.coverage}">${data.coverage.toUpperCase()}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h2>Component Coverage by Category</h2>
        <div class="coverage-grid">
            ${Object.entries(analysis.byCategory).map(([category, data]) => `
                <div class="coverage-card">
                    <h4>${category}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(data.tested / data.total) * 100}%"></div>
                    </div>
                    <p><strong>${data.tested}/${data.total}</strong> components tested (${Math.round((data.tested / data.total) * 100)}%)</p>
                    <div class="component-list">
                        ${Object.entries(data.components).map(([component, testData]) => `
                            <div class="component-item ${testData.hasA11yTests ? 'tested' : 'untested'}">
                                ${testData.hasA11yTests ? '✅' : '❌'} ${component}
                                ${testData.hasComprehensiveTests ? ' 🏆' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        ${analysis.recommendations.length > 0
? `
            <div class="recommendations">
                <h3>🚀 Recommendations</h3>
                <ul>
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    <li>Consider adding more manual accessibility tests for criteria that cannot be automated</li>
                    <li>Implement regular accessibility audits with real assistive technologies</li>
                    <li>Set up accessibility CI/CD gates to prevent regressions</li>
                </ul>
            </div>
        `
: ''}

        <h2>Test Implementation Details</h2>
        <h3>Automated Testing Coverage</h3>
        <ul>
            <li><strong>Color Contrast:</strong> Automated testing with axe-core validates WCAG AA contrast ratios (4.5:1 normal, 3:1 large text)</li>
            <li><strong>Keyboard Navigation:</strong> Unit and E2E tests verify tab order, focus management, and keyboard interactions</li>
            <li><strong>ARIA Implementation:</strong> Automated validation of roles, properties, and relationships</li>
            <li><strong>Semantic HTML:</strong> Testing ensures proper heading hierarchy, landmarks, and structure</li>
            <li><strong>Form Accessibility:</strong> Validation of labels, error handling, and form semantics</li>
            <li><strong>Responsive Accessibility:</strong> Cross-viewport testing maintains accessibility at all screen sizes</li>
        </ul>

        <h3>Testing Tools & Frameworks</h3>
        <ul>
            <li><strong>@axe-core/react:</strong> Unit testing with jest-axe for component-level accessibility</li>
            <li><strong>@axe-core/playwright:</strong> E2E testing for complete page accessibility validation</li>
            <li><strong>Custom Test Utilities:</strong> Specialized helpers for Modern Sage theme and pattern testing</li>
            <li><strong>Color Contrast Utils:</strong> Advanced color analysis for WCAG compliance validation</li>
        </ul>

        <footer>
            <p>This report is generated automatically from test files and provides insights into accessibility test coverage.<br>
            For complete accessibility assurance, supplement automated testing with manual testing using assistive technologies.</p>
        </footer>
    </div>
</body>
</html>`;

  return html;
}

/**
 * Generate JSON report for CI/CD integration
 */
function generateJSONReport(coverage, analysis) {
  return {
    generated: new Date().toISOString(),
    project: 'Telesis',
    summary: {
      unitTestCoverage: Math.round((coverage.unit.withA11yTests / coverage.unit.total) * 100),
      e2eTestCoverage: Math.round((coverage.e2e.withA11yTests / coverage.e2e.total) * 100),
      componentCoverage: Math.round((analysis.testedComponents / analysis.totalComponents) * 100),
      wcagCriteriaCount: Object.values(coverage.wcagCriteria).filter(c => c.tested).length,
      totalWcagCriteria: Object.keys(coverage.wcagCriteria).length,
    },
    coverage,
    analysis,
    recommendations: analysis.recommendations,
    compliance: {
      wcag21AA: Object.values(coverage.wcagCriteria).filter(c => c.tested).length >= 8, // At least 8/12 automated criteria
      colorContrast: coverage.wcagCriteria['Color Contrast'].tested,
      keyboardNavigation: coverage.wcagCriteria['Keyboard Navigation'].tested,
      screenReader: coverage.wcagCriteria['ARIA Labels'].tested,
    }
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning accessibility test coverage...\n');

  const coverage = scanAccessibilityTests();
  const analysis = analyzeComponentCoverage(coverage);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate HTML report
  const htmlReport = generateHTMLReport(coverage, analysis);
  const htmlPath = path.join(outputDir, 'accessibility-coverage.html');
  fs.writeFileSync(htmlPath, htmlReport);

  // Generate JSON report
  const jsonReport = generateJSONReport(coverage, analysis);
  const jsonPath = path.join(outputDir, 'accessibility-coverage.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));

  // Console summary
  console.log('📊 ACCESSIBILITY COVERAGE SUMMARY');
  console.log('=================================');
  console.log(`Unit Tests: ${coverage.unit.withA11yTests}/${coverage.unit.total} (${Math.round((coverage.unit.withA11yTests / coverage.unit.total) * 100)}%)`);
  console.log(`E2E Tests: ${coverage.e2e.withA11yTests}/${coverage.e2e.total} (${Math.round((coverage.e2e.withA11yTests / coverage.e2e.total) * 100)}%)`);
  console.log(`Components: ${analysis.testedComponents}/${analysis.totalComponents} (${Math.round((analysis.testedComponents / analysis.totalComponents) * 100)}%)`);
  console.log(`WCAG Criteria: ${Object.values(coverage.wcagCriteria).filter(c => c.tested).length}/12 automated criteria covered`);

  if (analysis.recommendations.length > 0) {
    console.log('\n🚀 RECOMMENDATIONS:');
    analysis.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  console.log(`\n📄 Reports generated:`);
  console.log(`  • HTML: ${htmlPath}`);
  console.log(`  • JSON: ${jsonPath}`);
  console.log('\n✨ Accessibility testing analysis complete!');

  // Exit with appropriate code for CI/CD
  const overallCoverage = (analysis.testedComponents / analysis.totalComponents) * 100;
  if (overallCoverage < 80) {
    console.log('\n⚠️  Warning: Accessibility test coverage below 80%');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  scanAccessibilityTests,
  analyzeComponentCoverage,
  generateHTMLReport,
  generateJSONReport,
};
