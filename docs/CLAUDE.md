# Telesis - AI-Powered Learning Platform

## Common Commands
```bash
npm run dev          # Start development server
npm test            # Run test suite
npm run build       # Build for production
npm run type-check  # TypeScript validation
npx supabase start  # Start local Supabase
npx supabase db push # Push migrations
```

## Core Files
- `/src/lib/supabase.ts` - Database client setup
- `/src/lib/stripe.ts` - Payment integration
- `/src/lib/ai/transform.ts` - AI content transformation
- `/src/components/ui/` - Shadcn UI components only
- `/supabase/migrations/` - Database schema

## Code Style Guidelines
- Use Shadcn UI components exclusively
- TypeScript strict mode enabled
- Prefer async/await over promises
- Use Zod for runtime validation
- Mobile-first responsive design
- WCAG 2.1 AA accessibility required

## Testing Instructions
1. Write tests BEFORE implementation (TDD)
2. Test file naming: `*.test.ts` or `*.test.tsx`
3. Run single tests during development, not full suite
4. E2E tests use Playwright
5. Mock external APIs (Stripe, OpenAI)

## Repository Etiquette
- Branch naming: `feature/description` or `fix/issue-number`
- Commit style: Conventional commits (feat:, fix:, docs:)
- Always squash merge to main
- PR requires passing tests
- Update CHANGELOG.md for features

## Environment Setup
```bash
# Required environment variables (.env.local)
SUPABASE_URL=
SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
```

## Development Warnings
- Shadcn UI form components require React Hook Form - don't use native forms
- Supabase local dev uses different ports (54321 for API, 54322 for Studio)
- Stripe webhooks in dev need `stripe listen --forward-to localhost:3000/api/webhooks`
- TypeScript strict mode will catch null/undefined - don't use 'any' to bypass

## Project Context
Telesis transforms training content into micro-learning modules using AI.

**Core Features:**
1. Upload content (PDF, video, presentations)
2. AI transforms to multiple formats (text, audio, quiz, visual)
3. Adaptive learning - users pick time & style
4. Track progress through modules

**Tech Focus:**
- Get AI transformation working first
- Make UI clean with Shadcn
- Store data in Supabase
- Authentication that works

## Linear Workflow
- Start work: `@linear-pm "pull TEL-XX and move to In Progress"`
- Create issue: `@linear-pm "create issue for [work]"`
- Add progress: `@linear-pm "add comment about implementation"`
- Complete: `@linear-pm "move TEL-XX to In Review"`
- Never auto-move to Done - manual verification required

## Workflow Tips
- Read existing code before writing new code
- Use `gh` CLI for GitHub operations
- Take screenshots to verify UI changes
- Check file structure before creating new components
- Run type-check after code changes
