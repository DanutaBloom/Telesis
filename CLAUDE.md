# Telesis - Next.js SaaS Boilerplate with AI Learning Platform

## Common Commands
```bash
npm run dev               # Start development server (includes Spotlight)
npm run dev:next         # Start only Next.js server
npm run build            # Build for production
npm run start            # Start production server
npm run check-types      # TypeScript validation
npm test                 # Run Vitest unit tests
npm run test:e2e         # Run Playwright E2E tests
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations (production)
npm run db:studio        # Open Drizzle Studio
npm run storybook        # Start Storybook dev server
```

## Core Files & Architecture
- `/src/models/Schema.ts` - Drizzle ORM database schema
- `/src/libs/Env.ts` - Type-safe environment variables with T3 Env
- `/src/libs/DB.ts` - Database connection and setup
- `/src/components/ui/` - Shadcn UI components
- `/src/features/` - Feature-specific components
- `/src/app/[locale]/` - Next.js App Router with i18n
- `/migrations/` - Drizzle database migrations
- `/src/locales/` - i18n translation files

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Authentication**: Clerk (multi-tenant, social auth, MFA)
- **Database**: Drizzle ORM with PostgreSQL
- **Payments**: Stripe integration
- **UI**: Shadcn UI + Tailwind CSS
- **i18n**: next-intl with Crowdin integration
- **Testing**: Vitest + Playwright
- **Monitoring**: Sentry error tracking
- **Logging**: Pino.js with Better Stack

## Database Schema (Telesis Features)
The boilerplate includes custom schemas for AI learning platform:
- `materialsSchema` - Training content uploads
- `microModulesSchema` - AI-generated learning modules
- `aiTransformationsSchema` - AI processing tracking
- `userPreferencesSchema` - Learning preferences
- `enrollmentsSchema` - User progress tracking
- `learningPathsSchema` - Structured learning journeys

## Environment Setup
```bash
# Required environment variables (.env.local)
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
BILLING_PLAN_ENV=dev

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOGTAIL_SOURCE_TOKEN=xxx
NODE_ENV=development
```

## Code Style Guidelines
- TypeScript strict mode enforced
- Use Shadcn UI components exclusively
- Tailwind CSS for styling
- Zod for runtime validation
- React Hook Form for forms
- Async/await over promises
- ESLint + Prettier formatting

## Testing Strategy
1. **Unit Tests**: Vitest with React Testing Library
2. **E2E Tests**: Playwright for user flows
3. **Visual Testing**: Percy (optional)
4. **Storybook**: Component development and testing
5. **Test Location**: Co-located with source files

## Authentication Features
- Multi-tenant organizations
- Social login (Google, GitHub, etc.)
- Multi-Factor Authentication (MFA)
- User impersonation
- Role-based access control
- Passwordless login with Passkeys

## Database Operations
```bash
# Generate migration after schema changes
npm run db:generate

# Apply migrations (production)
npm run db:migrate

# Explore database
npm run db:studio
# Opens https://local.drizzle.studio
```

## Stripe Integration
1. Set up Stripe CLI: `stripe login`
2. Create pricing: `npm run stripe:setup-price`
3. Configure customer portal at dashboard.stripe.com
4. For local webhooks, Stripe CLI handles forwarding automatically

## Development Workflow
1. **Branch naming**: `feature/description` or `fix/issue-number`
2. **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
3. **Testing**: Write tests before implementation (TDD)
4. **Deployment**: GitHub Actions CI/CD pipeline
5. **Code quality**: ESLint, Prettier, Husky pre-commit hooks

## i18n (Internationalization)
- **Framework**: next-intl
- **Translation management**: Crowdin
- **Files**: `/src/locales/en.json`, `/src/locales/fr.json`
- **Setup**: Configure CROWDIN_PROJECT_ID and CROWDIN_PERSONAL_TOKEN in GitHub Actions

## Production Deployment
1. Set environment variables in hosting platform
2. Run `npm run build` - migrations auto-execute
3. Required env vars: `DATABASE_URL`, `CLERK_SECRET_KEY`
4. Optional: Configure Sentry DSN for error monitoring

## Key Development Notes
- Database migrations are auto-applied during app startup
- PGlite provides offline development database
- Spotlight provides local Sentry debugging
- Use `npm run commit` for guided conventional commits
- Visual testing runs only in GitHub Actions
- Bundle analyzer: `npm run build-stats`

## Project Context
Telesis is an AI-powered micro-learning platform built on a robust SaaS boilerplate that includes:
- Multi-tenant authentication and organizations
- Subscription billing with Stripe
- AI content transformation pipeline
- Personalized learning experiences
- Progress tracking and analytics

The codebase combines production-ready SaaS infrastructure with custom AI learning features.
