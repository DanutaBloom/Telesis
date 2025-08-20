#!/usr/bin/env node
/**
 * Telesis API Integration Test Runner
 * Runs comprehensive tests for all API integrations and generates a report
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class APIIntegrationTester {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      integrations: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async runTests() {
    console.log('🚀 Starting Telesis API Integration Tests');
    console.log('=========================================\n');

    try {
      // Check environment configuration first
      await this.checkEnvironmentConfiguration();

      // Run unit integration tests
      console.log('📋 Running Unit Integration Tests...');
      await this.runUnitTests();

      // Run E2E integration tests
      console.log('\n🌐 Running E2E Integration Tests...');
      await this.runE2ETests();

      // Check API connectivity
      await this.checkAPIConnectivity();

      // Generate final report
      this.generateReport();

    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  async checkEnvironmentConfiguration() {
    console.log('⚙️ Checking Environment Configuration...\n');

    const requiredEnvVars = {
      'Clerk Authentication': [
        'CLERK_SECRET_KEY',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'NEXT_PUBLIC_CLERK_SIGN_IN_URL'
      ],
      'Stripe Payments': [
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'BILLING_PLAN_ENV'
      ],
      'Database': [
        'DATABASE_URL' // Optional - has PGlite fallback
      ],
      'OpenAI (Missing)': [
        'OPENAI_API_KEY',
        'OPENAI_ORG_ID'
      ]
    };

    Object.entries(requiredEnvVars).forEach(([service, vars]) => {
      const serviceStatus = {
        configured: 0,
        missing: 0,
        vars: {}
      };

      console.log(`${service}:`);
      
      vars.forEach(varName => {
        const isConfigured = !!process.env[varName];
        const status = isConfigured ? '✅' : '❌';
        const value = isConfigured ? 'Configured' : 'Missing';
        
        console.log(`  ${status} ${varName}: ${value}`);
        
        serviceStatus.vars[varName] = isConfigured;
        if (isConfigured) serviceStatus.configured++;
        else serviceStatus.missing++;
      });

      this.testResults.integrations[service.toLowerCase().replace(/[^a-z]/g, '_')] = serviceStatus;
      console.log('');
    });
  }

  async runUnitTests() {
    return new Promise((resolve, reject) => {
      const vitestProcess = spawn('npm', ['run', 'test', '--', 'tests/integration/'], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let hasError = false;

      vitestProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stdout.write(chunk);
      });

      vitestProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stderr.write(chunk);
        if (chunk.includes('Error') || chunk.includes('Failed')) {
          hasError = true;
        }
      });

      vitestProcess.on('close', (code) => {
        this.testResults.unitTests = {
          exitCode: code,
          output: output,
          status: code === 0 ? 'passed' : 'failed'
        };

        if (code === 0) {
          console.log('✅ Unit integration tests passed');
          this.testResults.summary.passed++;
        } else {
          console.log('❌ Unit integration tests failed');
          this.testResults.summary.failed++;
        }

        this.testResults.summary.total++;
        resolve();
      });

      vitestProcess.on('error', (error) => {
        console.error('Failed to run unit tests:', error);
        this.testResults.summary.failed++;
        reject(error);
      });
    });
  }

  async runE2ETests() {
    // Check if development server is running
    const serverRunning = await this.checkServerRunning();
    
    if (!serverRunning) {
      console.log('⚠️ Development server not running - starting it...');
      // Note: In a real scenario, you'd start the server here
      console.log('Please start the development server with: npm run dev');
      this.testResults.summary.warnings++;
      return;
    }

    return new Promise((resolve, reject) => {
      const playwrightProcess = spawn('npx', [
        'playwright', 
        'test', 
        'tests/e2e/api-integrations.e2e.ts',
        '--reporter=dot'
      ], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';

      playwrightProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stdout.write(chunk);
      });

      playwrightProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        process.stderr.write(chunk);
      });

      playwrightProcess.on('close', (code) => {
        this.testResults.e2eTests = {
          exitCode: code,
          output: output,
          status: code === 0 ? 'passed' : 'failed'
        };

        if (code === 0) {
          console.log('✅ E2E integration tests passed');
          this.testResults.summary.passed++;
        } else {
          console.log('❌ E2E integration tests failed');
          this.testResults.summary.failed++;
        }

        this.testResults.summary.total++;
        resolve();
      });

      playwrightProcess.on('error', (error) => {
        console.error('Failed to run E2E tests:', error);
        this.testResults.summary.failed++;
        reject(error);
      });
    });
  }

  async checkServerRunning() {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async checkAPIConnectivity() {
    console.log('\n🔗 Checking API Connectivity...\n');

    const endpoints = [
      { name: 'Health Check', url: 'http://localhost:3000/api/health', method: 'GET' },
      { name: 'Materials (Auth Required)', url: 'http://localhost:3000/api/materials', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, { method: endpoint.method });
        const status = response.status;
        const statusText = response.statusText;

        console.log(`${endpoint.name}: ${status} ${statusText}`);
        
        this.testResults.integrations[endpoint.name.toLowerCase().replace(/\s+/g, '_')] = {
          status: status,
          statusText: statusText,
          accessible: status < 500
        };

        if (status < 500) {
          this.testResults.summary.passed++;
        } else {
          this.testResults.summary.failed++;
        }

      } catch (error) {
        console.log(`${endpoint.name}: ❌ Connection failed - ${error.message}`);
        this.testResults.integrations[endpoint.name.toLowerCase().replace(/\s+/g, '_')] = {
          error: error.message,
          accessible: false
        };
        this.testResults.summary.failed++;
      }
      
      this.testResults.summary.total++;
    }
  }

  generateReport() {
    console.log('\n📊 Integration Test Report');
    console.log('=========================\n');

    // Summary
    const { total, passed, failed, warnings } = this.testResults.summary;
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Warnings: ${warnings} ⚠️`);
    console.log(`Success Rate: ${successRate}%\n`);

    // Integration Status
    console.log('🔌 Integration Status:');
    console.log('-----------------------');

    const integrationStatus = {
      'Clerk Authentication': this.getClerkStatus(),
      'Database Connection': this.getDatabaseStatus(),
      'Stripe Payments': this.getStripeStatus(),
      'OpenAI Integration': 'Not Configured ❌'
    };

    Object.entries(integrationStatus).forEach(([service, status]) => {
      console.log(`${service}: ${status}`);
    });

    // Recommendations
    console.log('\n💡 Recommendations:');
    console.log('-------------------');
    
    const recommendations = this.generateRecommendations();
    recommendations.forEach(rec => console.log(`• ${rec}`));

    // Save detailed report
    this.saveDetailedReport();

    console.log('\n📄 Detailed report saved to: test-results/api-integration-report.json');
    console.log('=========================\n');

    // Exit with appropriate code
    if (failed > 0) {
      console.log('❌ Some integration tests failed. Please review and fix issues.');
      process.exit(1);
    } else {
      console.log('✅ All integration tests passed successfully!');
    }
  }

  getClerkStatus() {
    const clerk = this.testResults.integrations.clerk_authentication;
    if (clerk && clerk.configured > 0) {
      return `Configured (${clerk.configured}/${clerk.configured + clerk.missing}) ✅`;
    }
    return 'Not Configured ❌';
  }

  getDatabaseStatus() {
    const health = this.testResults.integrations.health_check;
    if (health && health.accessible) {
      return 'Connected ✅';
    }
    return 'Connection Issues ⚠️';
  }

  getStripeStatus() {
    const stripe = this.testResults.integrations.stripe_payments;
    if (stripe && stripe.configured > 0) {
      return `Configured (${stripe.configured}/${stripe.configured + stripe.missing}) ✅`;
    }
    return 'Not Configured ❌';
  }

  generateRecommendations() {
    const recommendations = [];

    // Check Clerk
    const clerk = this.testResults.integrations.clerk_authentication;
    if (!clerk || clerk.missing > 0) {
      recommendations.push('Configure Clerk authentication keys in .env.local');
    }

    // Check Stripe  
    const stripe = this.testResults.integrations.stripe_payments;
    if (!stripe || stripe.missing > 0) {
      recommendations.push('Configure Stripe payment keys in .env.local');
    }

    // OpenAI
    recommendations.push('Add OpenAI API key for AI-powered learning features');

    // API Health
    const health = this.testResults.integrations.health_check;
    if (!health || !health.accessible) {
      recommendations.push('Ensure development server is running (npm run dev)');
    }

    // General
    recommendations.push('Set up proper error monitoring (Sentry)');
    recommendations.push('Configure rate limiting for production');
    recommendations.push('Add comprehensive logging for API operations');

    return recommendations;
  }

  saveDetailedReport() {
    // Ensure test-results directory exists
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Save detailed JSON report
    const reportPath = path.join(resultsDir, 'api-integration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));

    // Save markdown summary
    const markdownReport = this.generateMarkdownReport();
    const markdownPath = path.join(resultsDir, 'api-integration-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
  }

  generateMarkdownReport() {
    const { total, passed, failed, warnings } = this.testResults.summary;
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return `# Telesis API Integration Test Report

**Generated:** ${new Date(this.testResults.timestamp).toLocaleString()}
**Environment:** ${this.testResults.environment}

## Summary

- **Total Tests:** ${total}
- **Passed:** ${passed} ✅
- **Failed:** ${failed} ❌  
- **Warnings:** ${warnings} ⚠️
- **Success Rate:** ${successRate}%

## Integration Status

| Service | Status |
|---------|--------|
| Clerk Authentication | ${this.getClerkStatus()} |
| Database Connection | ${this.getDatabaseStatus()} |
| Stripe Payments | ${this.getStripeStatus()} |
| OpenAI Integration | Not Configured ❌ |

## Recommendations

${this.generateRecommendations().map(rec => `- ${rec}`).join('\n')}

## Next Steps

1. **Configure Missing Integrations:** Set up any missing environment variables
2. **OpenAI Integration:** Add OpenAI API key to enable AI-powered features
3. **Production Setup:** Configure proper monitoring and rate limiting
4. **Security Review:** Ensure all API endpoints have proper authentication
`;
  }
}

// Run the integration tests
if (require.main === module) {
  const tester = new APIIntegrationTester();
  tester.runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = APIIntegrationTester;