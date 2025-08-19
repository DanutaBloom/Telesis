#!/usr/bin/env node
/**
 * Telesis Test Runner
 * 
 * Comprehensive test runner for all test types:
 * - Unit tests (Vitest)
 * - Component tests with theme validation
 * - E2E tests (Playwright) 
 * - Security tests
 * - Performance tests
 * - Accessibility tests
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configurations
const TEST_CONFIGS = {
  unit: {
    command: 'npm',
    args: ['run', 'test'],
    description: '🧪 Unit Tests (Vitest)',
    timeout: 60000,
  },
  'unit:watch': {
    command: 'npm',
    args: ['run', 'test', '--', '--watch'],
    description: '🧪 Unit Tests (Watch Mode)',
    timeout: 0, // No timeout for watch mode
  },
  'unit:coverage': {
    command: 'npm',
    args: ['run', 'test', '--', '--coverage'],
    description: '📊 Unit Tests with Coverage',
    timeout: 120000,
  },
  e2e: {
    command: 'npx',
    args: ['playwright', 'test'],
    description: '🎭 E2E Tests (Playwright)',
    timeout: 600000, // 10 minutes
  },
  'e2e:headed': {
    command: 'npx',
    args: ['playwright', 'test', '--headed'],
    description: '🎭 E2E Tests (Headed)',
    timeout: 600000,
  },
  'e2e:debug': {
    command: 'npx',
    args: ['playwright', 'test', '--debug'],
    description: '🐛 E2E Tests (Debug Mode)',
    timeout: 0,
  },
  security: {
    command: 'npx',
    args: ['playwright', 'test', '--grep', '@security'],
    description: '🔒 Security Tests',
    timeout: 300000, // 5 minutes
  },
  performance: {
    command: 'npx',
    args: ['playwright', 'test', '--grep', '@performance'],
    description: '⚡ Performance Tests',
    timeout: 300000,
  },
  accessibility: {
    command: 'npx',
    args: ['playwright', 'test', '--grep', '@a11y'],
    description: '♿ Accessibility Tests',
    timeout: 180000,
  },
  theme: {
    command: 'npm',
    args: ['run', 'test', '--', '--grep', 'Modern Sage'],
    description: '🎨 Modern Sage Theme Tests',
    timeout: 60000,
  },
  auth: {
    command: 'npx',
    args: ['playwright', 'test', 'tests/e2e/auth/'],
    description: '🔐 Authentication Tests',
    timeout: 300000,
  },
  'org-management': {
    command: 'npx',
    args: ['playwright', 'test', 'tests/e2e/admin/organization-management.e2e.ts'],
    description: '🏢 Organization Management Tests',
    timeout: 240000,
  },
  'api-security': {
    command: 'npx',
    args: ['playwright', 'test', 'tests/e2e/security/api-security.security.ts'],
    description: '🛡️ API Security Tests',
    timeout: 180000,
  },
};

// Test suites
const TEST_SUITES = {
  all: ['unit', 'e2e', 'security'],
  quick: ['unit', 'theme'],
  ci: ['unit:coverage', 'e2e', 'security', 'accessibility'],
  dev: ['unit:watch'],
  security: ['security', 'api-security'],
  core: ['unit', 'auth', 'org-management'],
  theme: ['unit', 'theme'],
  performance: ['performance'],
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color] || colors.reset}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
  console.log(colorize(message, color));
}

function logError(message) {
  console.error(colorize(message, 'red'));
}

function logSuccess(message) {
  console.log(colorize(message, 'green'));
}

function logWarning(message) {
  console.log(colorize(message, 'yellow'));
}

function logInfo(message) {
  console.log(colorize(message, 'cyan'));
}

function showUsage() {
  log('\n🧪 Telesis Test Runner', 'bright');
  log('================================\n');
  
  log('Usage: npm run test:runner [suite|test] [options]\n', 'cyan');
  
  log('Available Test Suites:', 'bright');
  Object.entries(TEST_SUITES).forEach(([suite, tests]) => {
    log(`  ${colorize(suite, 'yellow')}: ${tests.join(', ')}`);
  });
  
  log('\nAvailable Individual Tests:', 'bright');
  Object.entries(TEST_CONFIGS).forEach(([test, config]) => {
    log(`  ${colorize(test, 'yellow')}: ${config.description}`);
  });
  
  log('\nOptions:', 'bright');
  log('  --help, -h     Show this help message');
  log('  --list, -l     List available tests and suites');
  log('  --verbose, -v  Verbose output');
  log('  --dry-run, -d  Show what would be executed without running');
  log('  --sequential   Run tests sequentially instead of in parallel');
  
  log('\nExamples:', 'bright');
  log('  npm run test:runner quick       # Run quick test suite');
  log('  npm run test:runner unit        # Run unit tests only');
  log('  npm run test:runner ci          # Run CI test suite');
  log('  npm run test:runner theme       # Run theme-related tests');
  log('  npm run test:runner -- --verbose # Run with verbose output');
}

function listTests() {
  log('\n📋 Available Tests and Suites\n', 'bright');
  
  log('Test Suites:', 'cyan');
  Object.entries(TEST_SUITES).forEach(([suite, tests]) => {
    log(`  📦 ${colorize(suite, 'yellow')}: ${tests.join(', ')}`);
  });
  
  log('\nIndividual Tests:', 'cyan');
  Object.entries(TEST_CONFIGS).forEach(([test, config]) => {
    log(`  🧪 ${colorize(test, 'yellow')}: ${config.description}`);
  });
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = 60000, verbose = false, description = '' } = options;
    
    if (verbose || options.dryRun) {
      log(`\n${description}`, 'bright');
      log(`Command: ${command} ${args.join(' ')}`, 'cyan');
      if (options.dryRun) {
        resolve({ success: true, output: 'Dry run - command not executed' });
        return;
      }
    }
    
    const child = spawn(command, args, {
      stdio: verbose ? 'inherit' : 'pipe',
      shell: process.platform === 'win32',
    });
    
    let output = '';
    let errorOutput = '';
    
    if (!verbose) {
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });
    }
    
    const timeoutId = timeout > 0 ? setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout) : null;
    
    child.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      
      if (code === 0) {
        resolve({ success: true, output, errorOutput });
      } else {
        reject(new Error(`Command failed with code ${code}\n${errorOutput}`));
      }
    });
    
    child.on('error', (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(error);
    });
  });
}

async function runTest(testName, options = {}) {
  const config = TEST_CONFIGS[testName];
  if (!config) {
    throw new Error(`Unknown test: ${testName}`);
  }
  
  const startTime = Date.now();
  
  try {
    logInfo(`\n▶️  Running ${config.description}...`);
    
    await runCommand(config.command, config.args, {
      timeout: config.timeout,
      verbose: options.verbose,
      dryRun: options.dryRun,
      description: config.description,
    });
    
    const duration = Date.now() - startTime;
    logSuccess(`✅ ${config.description} completed in ${duration}ms`);
    
    return { success: true, duration, test: testName };
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`❌ ${config.description} failed after ${duration}ms`);
    logError(error.message);
    
    return { success: false, duration, test: testName, error: error.message };
  }
}

async function runTestSuite(suiteName, options = {}) {
  const tests = TEST_SUITES[suiteName];
  if (!tests) {
    throw new Error(`Unknown test suite: ${suiteName}`);
  }
  
  log(`\n🚀 Running test suite: ${colorize(suiteName, 'bright')}`, 'cyan');
  log(`Tests: ${tests.join(', ')}\n`);
  
  const results = [];
  const startTime = Date.now();
  
  if (options.sequential) {
    // Run tests sequentially
    for (const testName of tests) {
      const result = await runTest(testName, options);
      results.push(result);
      
      if (!result.success && options.failFast) {
        break;
      }
    }
  } else {
    // Run tests in parallel
    const promises = tests.map(testName => runTest(testName, options));
    const parallelResults = await Promise.allSettled(promises);
    
    parallelResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          success: false,
          test: tests[index],
          error: result.reason?.message || 'Unknown error',
          duration: 0,
        });
      }
    });
  }
  
  const totalDuration = Date.now() - startTime;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`\n📊 Test Suite Results for ${colorize(suiteName, 'bright')}:`, 'cyan');
  log(`   Total: ${results.length} tests`);
  log(`   ${colorize(`Passed: ${successful}`, 'green')}`);
  log(`   ${colorize(`Failed: ${failed}`, failed > 0 ? 'red' : 'reset')}`);
  log(`   Duration: ${totalDuration}ms\n`);
  
  if (failed > 0) {
    logError('Failed tests:');
    results.filter(r => !r.success).forEach(result => {
      logError(`  ❌ ${result.test}: ${result.error}`);
    });
  }
  
  return {
    success: failed === 0,
    results,
    duration: totalDuration,
    suite: suiteName,
  };
}

function checkPrerequisites() {
  const issues = [];
  
  // Check if playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'ignore' });
  } catch {
    issues.push('Playwright is not installed. Run: npx playwright install');
  }
  
  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    issues.push('Dependencies not installed. Run: npm install');
  }
  
  // Check if test directories exist
  const testDirs = ['tests', 'src/test-utils'];
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      issues.push(`Test directory missing: ${dir}`);
    }
  });
  
  if (issues.length > 0) {
    logError('\n❌ Prerequisites check failed:');
    issues.forEach(issue => logError(`   - ${issue}`));
    logError('');
    return false;
  }
  
  logSuccess('✅ Prerequisites check passed');
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    sequential: args.includes('--sequential'),
    failFast: args.includes('--fail-fast'),
    help: args.includes('--help') || args.includes('-h'),
    list: args.includes('--list') || args.includes('-l'),
  };
  
  const testArgs = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
  
  if (options.help || testArgs.includes('help')) {
    showUsage();
    process.exit(0);
  }
  
  if (options.list || testArgs.includes('list')) {
    listTests();
    process.exit(0);
  }
  
  if (testArgs.length === 0) {
    logWarning('No test specified. Use --help to see available options.');
    showUsage();
    process.exit(1);
  }
  
  log('\n🧪 Telesis Test Runner', 'bright');
  log('================================\n');
  
  if (!options.dryRun && !checkPrerequisites()) {
    process.exit(1);
  }
  
  const target = testArgs[0];
  let success = true;
  
  try {
    if (TEST_SUITES[target]) {
      // Run test suite
      const result = await runTestSuite(target, options);
      success = result.success;
    } else if (TEST_CONFIGS[target]) {
      // Run individual test
      const result = await runTest(target, options);
      success = result.success;
    } else {
      logError(`Unknown test or suite: ${target}`);
      logInfo('Use --list to see available options');
      success = false;
    }
  } catch (error) {
    logError(`\n❌ Test runner error: ${error.message}`);
    success = false;
  }
  
  log('\n================================');
  if (success) {
    logSuccess('🎉 All tests completed successfully!');
    process.exit(0);
  } else {
    logError('💥 Some tests failed!');
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled Rejection at: ${promise}`);
  logError(`Reason: ${reason}`);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runTest, runTestSuite, TEST_CONFIGS, TEST_SUITES };