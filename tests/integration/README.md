# Telesis API Integration Tests

This directory contains comprehensive integration tests for all external API integrations in the Telesis platform.

## Overview

The integration tests verify connectivity, authentication, error handling, and proper configuration for:

1. **Clerk Authentication** - User authentication and session management
2. **PostgreSQL/Supabase Database** - Database connectivity and CRUD operations  
3. **Stripe Integration** - Payment processing and subscription management
4. **OpenAI Integration** - AI-powered content transformation (planned)

## Test Files

### `api-integrations.test.ts`
Comprehensive unit integration tests covering:
- Environment variable validation
- API connectivity testing
- Authentication middleware verification
- Database schema validation
- Security headers and rate limiting
- Error handling and logging

### `openai-integration.test.ts`  
OpenAI integration readiness tests covering:
- Configuration analysis and recommendations
- Mock AI client testing
- Database schema integration
- Missing endpoint identification
- Implementation checklist

## Running Integration Tests

### Quick Test Run
```bash
# Run all integration tests
npm run test:integration

# Run specific test file
npx vitest tests/integration/api-integrations.test.ts
```

### Comprehensive Integration Testing
```bash
# Run full integration test suite with reporting
npm run test:api-integrations
```

This command will:
1. Check environment configuration
2. Run unit integration tests
3. Run E2E integration tests (if dev server running)
4. Test API connectivity
5. Generate comprehensive report

### E2E Integration Tests
```bash
# Start development server first
npm run dev

# Then run E2E tests in another terminal
npx playwright test tests/e2e/api-integrations.e2e.ts
```

## Environment Setup

### Required Environment Variables

Create `.env.local` with the following:

```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

# Database (Optional - falls back to PGlite)
DATABASE_URL=postgresql://username:password@host:port/database

# Stripe Payments (Required)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
BILLING_PLAN_ENV=dev

# OpenAI Integration (Missing - Required for AI features)
OPENAI_API_KEY=sk-your_openai_key_here
OPENAI_ORG_ID=org-your_org_id_here
```

## Test Results

Integration tests generate detailed reports in:
- `test-results/api-integration-report.json` - Detailed JSON report
- `test-results/api-integration-report.md` - Human-readable summary

## Integration Status

### ✅ Fully Configured
- **Clerk Authentication**: Multi-tenant auth with organizations
- **Database**: Drizzle ORM with PostgreSQL/PGlite fallback
- **Stripe Payments**: Full subscription and payment processing

### ⚠️ Partially Configured  
- **API Security**: Rate limiting and security headers implemented
- **Error Handling**: Comprehensive error responses and logging

### ❌ Missing Configuration
- **OpenAI Integration**: Required for AI-powered learning features
- **Production Monitoring**: Sentry error tracking setup needed
- **Advanced Rate Limiting**: Redis-based rate limiting for production

## Common Issues

### Database Connection Failed
```bash
# Check if DATABASE_URL is set (optional)
echo $DATABASE_URL

# Tests will use PGlite fallback for local development
# No action needed for local testing
```

### Authentication Tests Failing
```bash
# Verify Clerk keys are properly configured
echo $CLERK_SECRET_KEY | head -c 10
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | head -c 10

# Keys should start with sk_test_ and pk_test_ respectively
```

### Stripe Tests Failing  
```bash
# Verify Stripe keys are configured
echo $STRIPE_SECRET_KEY | head -c 10
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | head -c 10

# Test webhook secret
echo $STRIPE_WEBHOOK_SECRET | head -c 10
```

### E2E Tests Not Running
```bash
# Ensure development server is running
npm run dev

# Check if server responds
curl http://localhost:3000/api/health
```

## Adding New Integration Tests

When adding a new external API integration:

1. **Environment Configuration**
   - Add required environment variables to `src/libs/Env.ts`
   - Update `.env.local` template in this README
   - Add validation in integration tests

2. **Unit Tests**
   - Add integration tests to `api-integrations.test.ts`
   - Test connectivity, authentication, error handling
   - Mock API responses when appropriate

3. **E2E Tests** 
   - Add endpoint tests to `../e2e/api-integrations.e2e.ts`
   - Test real browser interactions
   - Verify security headers and CORS

4. **Documentation**
   - Update this README with new integration details
   - Document configuration requirements
   - Add troubleshooting section

## Security Considerations

Integration tests verify:
- ✅ Authentication required for protected endpoints
- ✅ Security headers properly set (XSS, CSRF protection)
- ✅ Rate limiting implemented
- ✅ Error responses don't expose sensitive data
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Organization-scoped data access

## Next Steps

1. **Configure OpenAI Integration**
   - Add API key to environment
   - Implement AI transformation endpoints
   - Create content generation workflows

2. **Production Hardening**
   - Set up Redis for distributed rate limiting  
   - Configure Sentry for error monitoring
   - Implement comprehensive audit logging

3. **Performance Testing**
   - Add load testing for API endpoints
   - Monitor response times and throughput
   - Test concurrent user scenarios