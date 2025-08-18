# Product Requirements Document – Telesis

## 1. Executive Summary

Telesis is a Learning Intelligence Platform rather than just another LMS. It transforms lengthy, complex content into personalised, bite‑sized learning experiences that respect your time and preferred style. Trainers can upload PDFs, videos or presentations and, within seconds, our AI distils them into micro‑modules: short summaries, diagrams, audio briefs, practice cards and actionable guides.

Learners select how much time they have and how they like to learn; Telesis adapts the output accordingly. The platform will launch as 100 % free during the MVP phase while we establish product–market fit. We are building on the SaaS‑Boilerplate starter template, leveraging its built‑in authentication, multi‑tenancy and dashboard features 1.

The goal is to release a working product within four months, then iterate rapidly based on real user feedback.

---

## 2. Project Overview

**Name**: Telesis – Greek for "purposeful progress." Short, memorable and globally neutral.
**Tagline**: "Ask. Think. Apply." – inspired by the Socratic method and our belief that learning begins with questions, continues through reflection and culminates in practice.
**Mission**: Distil overwhelming content into adaptive micro‑learning experiences that help busy professionals upskill quickly and effectively. Empower trainers with tools to transform their materials into multiple formats without extra effort.
**Vision**: A world where knowledge is instantly accessible in the form you need, when you need it. Telesis will become the go‑to platform for adaptive, AI‑driven learning experiences across industries.

---

## 3. Goals & Objectives

Telesis aims to redefine how professional skills are acquired by focusing on speed, relevance and personalisation.

**Transform content** – Turn long‑form documents, videos and slide decks into concise, multimodal micro‑modules (text, audio, visual, practice) using AI.
**Respect time & style** – Let learners choose how much time they have and how they prefer to
learn; adapt the learning path accordingly.
**Empower creators** – Provide trainers with easy tools to upload content once and publish across Multiple formats without manual rework.
**Scale intelligently** – Use data to continuously improve recommendations and learning outcomes.
**Lay a modular foundation** – Build on the SaaS‑Boilerplate to deliver core features quickly while allowing future modules (e.g. multi‑tenant admin, SCORM) to be integrated later .
**MVP timeline** – Release a usable product within 16 weeks and ship improvements weekly based on feedback.

---

## 4. Core Innovation: AI‑Powered Content Intelligence

At the heart of Telesis is the Content Transformation Engine, a proprietary AI system that converts any training material into multiple micro‑learning formats. The process follows five stages: *input*, *analysis*, *generation*, *personalisation* and *delivery*.

### Supported Transformations

- **Documents (PDF/Docs)** → 5‑minute summaries, visual maps, audio briefs and practice cards.
- **Videos** → Transcripts, key points, quiz questions, practice cards and time‑stamped highlights.
- **Slides/Presentations** → Interactive diagrams, quiz sets and cheat sheets.
- **Legacy formats (SCORM)** → Break down SCORM packages into modern micro‑modules for backwards compatibility.

### AI Stack
- **GPT-5-nano**: Basic summaries and quiz generation (bulk tasks)
- **GPT-5-mini**: Complex transformations and analysis
- **GPT-5**: Premium features and advanced reasoning only
- **Whisper**: Audio/video transcription
- **Rate limiting**: 10 transformations/day per user to control costs

This engine is the key differentiator that enables Telesis to deliver personalised learning at scale while minimising manual effort for trainers.

---

## 5. Target Personas

| Persona                           | Needs                                                                                                   | Pain Points                                                                                            |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| **Busy Professional (Primary)**   | Rapidly acquire skills on tight schedules; personalised content in preferred modality                   | Courses are too long; information overload; lack of focus on practical outcomes                        |
| **Modern Trainer (Secondary)**   | Upload content once and automatically generate multiple learning formats; track which formats work best | Recreating materials for different media is time consuming; no insights on learner preferences         |
| **Organization Admin (Tertiary)** | Upskill teams quickly; monitor adoption and impact; ensure compliance                                   | Employees skip training due to time pressure; difficult to prove ROI; content becomes obsolete quickly |
| **Advanced Learner (Optional)**   | Dive deeper when needed; access a library of condensed knowledge; practice skills                       | Hard to transition from summary to mastery; generic material; no personalised path                     |

---

## 6. Core Features & Phasing

Telesis will roll out features in a phased approach that prioritises content transformation and personalised micro‑learning. SCORM support and pricing will be considered only after achieving product–market fit.

### Phase 1 – Foundation & Content Transformation (Weeks 1‑4)

- **Marketing website** with Home, About, Contact and Features pages; introduces the “Ask. Think. Apply.” philosophy.
- **User registration and login**: multi‑factor and social login via Clerk .
- **Content upload**: Trainers can upload PDFs, videos or slide decks.
- **AI‑powered transformation**: The system generates multiple micro‑modules from the uploaded content – 5‑minute summaries, diagrams, audio briefs and practice cards.
- **Dashboard basics**: Users can view uploaded content and generated modules.

### Phase 2 – Personalised Learning (Weeks 5‑8)

**Learner profile and quiz**: Collect learning style preferences (visual, auditory, reading/doing) and
time availability.
**Adaptive path selection**: Learners choose how much time they have (e.g. 5 minutes,
15 minutes) and preferred modality; the platform serves appropriate modules.
**Trainer analytics**: Provide basic insights on which formats learners select and complete.
**Feedback mechanism**: Collect user feedback on generated modules to improve AI quality.

### Phase 3 – Intelligence & Tracking (Weeks 9‑12)

- **Recommendation engine**: Use behavioural data to recommend next modules or topics.
- **Progress tracking**: Monitor which micro‑modules are completed and how well learners perform on practice exercises.
- **Adaptive refinement**: Adjust content generation based on what works best for different learner types.
- **Basic certifications**: Allow learners to earn micro‑certificates upon completing sets of modules.

## Phase 4 – Multi‑Tenant & Enterprise Features (Weeks 13‑16)

- **Organization creation & roles**: Allow admins to create organisations, invite members and assign roles .
- **Custom branding**: Enable organisations to customise logos and colours.
- **Department structure**: Create departments and assign teams to specific learning paths.
- **SSO integration**: Implement Auth0/SAML for enterprise clients.

## Phase 5 – Advanced & Monetization (Weeks 17‑24)

- **API & Mobile PWA**: Expose a REST/GraphQL API and build a Progressive Web App with offline support and push notifications.
- **Agentic AI & Insights**: Introduce advanced AI features that generate personalised learning roadmaps and coaching suggestions.
- **SCORM & Legacy Support**: Provide SCORM upload and tracking for clients who need traditional standards, using react‑scorm‑provider.
- **Pricing & Monetization**: Begin experimenting with a freemium model once usage patterns and value drivers are understood.

Throughout all phases, data collection and storage will be designed to support future AI capabilities.
This ensures that an agentic intelligence layer can be added later to generate dynamic learning
recommendations and pathways.

---

## 7. Technical Architecture

### 7.1 Frontend

- **Framework**: Next.js 14 with the App Router (from SaaS‑Boilerplate).
- **Language**: TypeScript.
- **UI/Styling**: Tailwind CSS and Shadcn UI components.
- **State management**: React Query (TanStack) and Zustand.
- **Forms & validation**: React Hook Form + Zod.
- **Internationalization**: next‑intl for multi‑language support .
- **Testing**: Vitest + Playwright.

### 7.2 Backend

- **Authentication**: Clerk – supports email/password, passwordless, social auth and MFA .
- **Database**: PostgreSQL via Drizzle ORM (default in SaaS‑Boilerplate).
- **File storage**: Supabase Storage for documents/video; Cloudinary for image optimization.
- **Hosting**: Vercel with Edge Functions for low latency.
- **Real‑time**: Supabase Realtime for live progress updates.

**Payments**: The SaaS‑Boilerplate includes an integration with Stripe for subscriptions and billing. For the
MVP, payment features will remain disabled and all accounts will be free. When we define a
monetisation model, the existing Stripe integration will be activated and customised.

The entire codebase follows a **modular architecture**. Features such as course management, SCORM
support and reporting are encapsulated in separate modules. This approach allows future expansion—
organisations will eventually be able to enable or disable modules and customise workflows without
changing the core framework.

### 7.3 AI/ML Stack

The MVP will start with a lean AI stack to reduce integration complexity. Two core services are used:

- **OpenAI GPT‑5** – Provides text summarisation and question generation for uploaded documents
and transcripts.
- **Whisper** – Converts audio and video into transcripts that can be summarised.

Future expansions may integrate additional providers (e.g. visual diagram generation and voice
synthesis) as user feedback warrants. A vector database (e.g. Pinecone or Weaviate) will be considered
once personalised recommendations rely on semantic search.

---

## 8. Brand & Design System

### 8.1 Brand Identity

- **Name: Telesis** — conveys purposeful progress and learning.
- **Values**: accessible, professional, growth‑oriented. The logo concept is described in Section 8.4 and revolves around a growing branch with three nodes representing the pillars Ask, Think and Apply.

### 8.2 Visual Identity

Telesis adopts a **Modern Sage** palette to convey calm confidence and growth.

- **Primary colour**: #A8C0BD (Quietude) – evokes trust and serenity.
- **Accent colour**: #4C9A2A (Growth Green) – signals progress and action.
- **Neutral palette**: Soft greys and off‑white tones for clarity and contrast.
- **Typography**: Inter for body text and SF Mono for code snippets.
- **Spacing**: 8‑pixel grid; consistent margins and paddings.

### 8.3 Component Library

Structure inspired by accessible design guidelines:

src/components/
├── ui/ # Base buttons, inputs, cards, dialogs
├── patterns/ # Navigation, data tables, file upload, search bar
└── features/ # CourseCard, ProgressBar, OrgChart, ScormPlayer

All components must comply with WCAG 2.1 AA guidelines: keyboard navigation, screen‑reader support,
high contrast modes and focus indicators.

### 8.4 Logo Concept

The Telesis logo features three olives with leaves, drawing from Ancient Greek symbolism where olives represented wisdom, learning, and divine knowledge. The three olives embody the classical pillars of learning—Ask, Think, and Apply—connecting to the philosophical tradition of Socrates, Plato, and Aristotle. This design honors the olive's historical association with Athena, goddess of wisdom, and the Academy where philosophical inquiry flourished. The minimalist black silhouette ensures scalability across applications, from favicons to presentation graphics, while maintaining the symbolic weight of this ancient emblem of knowledge and growth.

### 8.5 Design Philosophy & Standards

Telesis uses **Shadcn UI** as its complete design system. This provides:
- Consistent components based on Radix UI primitives
- Built-in accessibility (WCAG 2.1 AA compliant)
- Full Tailwind CSS integration
- Customizable theming via CSS variables

We do not mix other design systems to ensure consistency and maintainability.

#### Core design principles

- **Structure and order** – logical layout and clear hierarchy make complex tasks intuitive.
- **Simplicity** – every element has a purpose; remove anything unnecessary.
- **Accessibility** – the application must be usable by everyone; a11y is a baseline requirement.
- **Craftsmanship** – robust, well‑documented components give developers confidence and speed.

#### Quality pillars

- **Accessibility (a11y)** – Radix UI covers most accessibility details; we supplement with automated tests using axe-core .
- **Internationalization (i18n)** – next-intl makes it simple to localise the app into multiple languages.
- **Security** – input validation with Zod; dependency scanning via Snyk/Dependabot; multi‑factor authentication via Clerk.
- **Performance** – server‑side rendering and code splitting via Next.js; regular Lighthouse audits.
- **Privacy** – data minimization and transparent privacy policies; compliant with GDPR.
- **Theming & Brandability** – CSS variables and design tokens allow each organisation to customise logos and colours.
- **Consistent naming** – components use PascalCase, functions camelCase and utility files kebab‑case; ESLint and Prettier enforce compliance.

We avoid mixing other design styles such as Material Design or Windows Metro; they do not align with the chosen HIG principles and minimalist philosophy. By following one coherent design system, we speed up development, increase quality and create a recognizable Telesis look.

---

## 9. Detailed Project Setup

### 9.1 Repository Initialization

#### Clone boilerplate

- git clone <https://github.com/ixartz/SaaS-Boilerplate> telesis-app
- cd telesis-app
- pnpm install

#### Copy environment example and configure

- cp .env.example .env.local

#### Populate CLERK_* keys, DATABASE_URL, etc

#### Database setup

- pnpm db:push # apply schema
- pnpm db:seed # add test data (dev only)

#### Start development server

- pnpm dev

### 9.2 Claude Project Setup ( claude_project.md )

#### Telesis LMS Project

##### Tech Stack

- Next.js 14 (App Router)
- SaaS‑Boilerplate template
- Clerk auth
- Drizzle ORM + PostgreSQL
- Shadcn UI components

##### Current Sprint

Week 1–2: marketing pages & branding

##### Architecture Decisions

- Multi‑tenant via `organization_id`
- SCORM via `react-scorm-provider`
- File storage: Supabase Storage

##### Conventions

- Feature branches: `feature/[ticket]-description`
- Commit messages: conventional commits
- Components: PascalCase
- Utilities: camelCase

### 9.3 Development Environment

The PRD intentionally omits low‑level **Model Context Protocol (MCP)** details and AI personas. These are
developer tools that evolve quickly and do not impact product requirements. All MCP configuration and
Claude project setup are documented separately in /docs/DEVELOPER_SETUP.md.

#### Required Tools

- Node.js 18+ with pnpm
- Git with conventional commit hooks
- VS Code with recommended extensions (ESLint, Prettier, Tailwind IntelliSense)
- Claude Projects configured with the necessary MCP tools (Context7, Zen, Sequential planning, Memory, GitHub MCP, etc.)

#### Documentation

Refer to /docs/DEVELOPER_SETUP.md for:

- Detailed MCP configuration
- Claude project setup
- Local environment setup
- Recommended VS Code extensions

### 9.4 Repository Structure

telesis/
├── apps/
│ └── web/
│ ├── app/ # Next.js App Router
│ │ ├── (marketing)/ # Public routes
│ │ ├── (auth)/ # Auth flow
│ │ ├── (dashboard)/ # Protected routes
│ │ └── api/
│ ├── components/
│ │ ├── ui/ # Shadcn components
│ │ ├── features/ # Business components
│ │ └── layouts/
│ └── lib/
│ ├── db/ # Drizzle queries
│ └── utils/
├── packages/
│ ├── database/ # Schema & migrations
| └── scorm/ # SCORM handler
├── docs/
│ ├── ADR/ # Architecture decisions
│ └── API/
└── .github/
└── workflows/ # CI/CD pipelines

This monorepo structure separates the web application, shared packages (such as database schemas
and SCORM handlers) and documentation. It also ensures that CI/CD pipelines are configured in a
dedicated .github directory.

### 9.5 Development Workflow

#### Branch Strategy

- **main** → production (protected)
- **develop** → staging
- **feature/[JIRA-ID]-description** → feature branches

#### Code Review Process

1. Create a pull request (PR) from a feature branch to **develop**.
2. Automated checks run (linting, type checking, tests).
3. Manual review is required by at least one maintainer.
4. Use squash merge only, to keep the commit history clean.

#### Release Cycle

- Weekly releases to staging (every Friday).
- Bi‑weekly production releases.
- Hotfixes go directly to **main** in emergencies.

### 9.6 Environment Strategy

| Environment     | URL                     | Purpose              | Deploy Trigger       |
|-----------------|-------------------------|----------------------|----------------------|
| **Development** | Localhost: 3000         | Local Development    | Manual               |
| **Preview**     | pr-*.telesis.vercel.app | Pull request revieuw | PR creation          |
| **Staging**     | staging.telesis.app     | QA testing           | Merge to develop     |
| **Production**  | telesis.app             | Live users           | Merge to main        |

## 10. Implementation Roadmap & Milestones

---

| Weeks     | Deliverables                                                                                                                                                                                                              |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1-2**   | **Basic upload & single transformation** – - Clone and setup SaaS-Boilerplate
- Implement Clerk authentication
- Basic file upload endpoint |
| **3-4**   | **Authentication & dashboard** – - PDF → text summary using GPT-5-nano
- Simple dashboard UI with Shadcn components
- Stripe integration (€10/month subscription)                                                 |
| **5-6**   | **Additional output formats** – Extend the transformation engine to produce a second and third format (e.g. audio brief via Whisper and a practice question set). Refine the dashboard UI.                                |
| **7-8**   | **Basic personalisation** – Add a simple learner preferences form (style and time). Use preferences to prioritise which outputs are shown. Start collecting feedback.                                                     |
| **9-10**  | **Recommendation & tracking** – Implement a lightweight recommendation logic based on previously consumed modules. Add progress indicators.                                                                               |
| **11-12** | **Multi‑tenant foundation** – Introduce organisation creation, member invites and role assignments. Implement custom branding and basic department structures.                                                            |
| **13-14** | **API & PWA** – Build a REST API for content retrieval and progress updates. Develop a Progressive Web App with offline capability and push notifications.                                                                |
| **15-16** | **Enterprise features & optional SCORM** – Integrate SSO via Auth0/SAML. Make SCORM react‑scorm‑provider. Prepare for monetisation experiments by enabling Stripe subscriptions.                                          |

---

## 11. Content Strategy

The strength of Telesis lies in the AI‑powered transformation engine. To showcase this during early testing, trainers will be encouraged to upload existing materials rather than create bespoke courses.

### Demonstration Content

During the personalisation and intelligence phases, seed the platform with a variety of source materials that can be transformed into micro‑modules. Examples include:

1. **Welcome to Telesis** – A PDF describing the platform’s philosophy and how to use it. The transformation engine will generate a 5‑minute summary, an audio brief and practice questions.
2. **Digital Skills Essentials** – A long video or deck covering core digital literacy topics. This will showcase how visual maps, audio summaries and practice exercises are produced from one source.
3. **Advanced Topic Example** – A technical white paper or research article used to test how the system distils complex information.

Trainers can experiment with uploading their own materials to see how the engine performs across different content types. Feedback from these early uploads will inform improvements to the AI algorithms.

---

## 12. Org Chart Tool

- Use the **react-organizational-chart** library to allow trainers to build visual organizational charts. Features include adding roles, hierarchy, drag‑and‑drop and label editing.
- Provide export functionality via **html2canvas** and **jspdf** to generate PDF/PNG for sharing with clients or presentations.
- Store org chart data as JSON (tree structure) in the **org_charts** table.

---

## 13. SCORM Integration Details

SCORM support is not part of the MVP scope. However, some enterprise customers may require support for legacy SCORM packages.
Integration will therefore be addressed in the later phase dedicated to legacy and monetisation features.

- **Install SCORM libraries** - npm install react-scorm-provider scorm-again

- **Create components** – Develop a ScormUploader to upload SCORM zip files and store them in Supabase Storage. Build a ScormPlayer that wraps ScormProvider from react-scorm-
provider ; load the SCORM content in an iframe and handle progress events.
- **Persist session data** – Save SCORM session data (scores, completion status) via API routes into the enrollments table.
- **Consider** scorm-again – For offline or cross‑frame use cases, explore scorm-again and its offline modules.

---

## 14. Figma Integration

- Design all pages and components in Figma using the defined brand colours and typography.
- Use Figma Dev Mode to extract CSS/variables and generate React components where possible.
- Synchronize design tokens (colours, spacing, typography) with Tailwind and Shadcn themes to maintain consistency.
- Iterate on user feedback from trainers and learners during design reviews.

---

## 15. Data Model (Simplified)

'''
users (
id uuid primary key,
email text unique not null,
password_hash text,
role text not null, -- 'learner', 'trainer', 'both'
organization_id uuid references organizations,
created_at timestamp default now()
)

organizations (
id uuid primary key,
name text not null,
slug text unique not null,
owner_id uuid references users,
created_at timestamp default now()
)

teams (
11
id uuid primary key,
organization_id uuid references organizations,
name text not null
)

team_members (
team_id uuid references teams,
user_id uuid references users,
role text,
primary key (team_id, user_id)
)

courses (
id uuid primary key,
trainer_id uuid references users,
organization_id uuid references organizations,
title text not null,
description text,
level text,
status text default 'draft',
created_at timestamp default now()
)

modules (
id uuid primary key,
course_id uuid references courses,
type text, -- 'text', 'pdf', 'video', 'scorm'
content_uri text not null,
"order" integer
)

enrollments (
user_id uuid references users,
course_id uuid references courses,
progress numeric default 0,
completed_at timestamp,
primary key (user_id, course_id)
)

org_charts (
id uuid primary key,
trainer_id uuid references users,
title text,
chart_data jsonb,
created_at timestamp default now()
)

-- Materials uploaded by trainers
materials (
id uuid primary key,
trainer_id uuid references users,
organization_id uuid references organizations,
title text not null,
type text, -- 'pdf', 'video', 'slides'
original_uri text not null,
created_at timestamp default now()
)

-- Micro‑modules generated by the AI transformation engine
micro_modules (
id uuid primary key,
material_id uuid references materials,
organization_id uuid references organizations,
type text, -- 'summary', 'visual', 'audio', 'practice', etc.
content_uri text not null,
duration integer, -- estimated time in minutes
created_at timestamp default now()
)

-- AI transformation tracking
ai_transformations (
id uuid primary key,
material_id uuid references materials,
model_used text, -- e.g. 'gpt-4', 'claude-3', etc.
input_tokens integer,
output_tokens integer,
transformation_type text,
quality_score numeric,
user_feedback jsonb,
created_at timestamp default now()
)

-- User learning preferences
user_preferences (
user_id uuid references users,
learning_style text[], -- array of preferred styles
['visual','audio','reading']
time_preference integer, -- minutes available per session
topics_interested text[],
completed_paths jsonb
)
'''

---

## 16. Success Metrics

- **MVP adoption**: ≥ 10 trainers and 50 learners in the first month after launch.
- **Course completion rate**: ≥ 70 % within three months.
- **Monthly active users**: ≥ 500 by month 6.
- **Uptime**: ≥ 99.5 %.

### Performance Metrics

- **First Contentful Paint**: < 1.2 s
- **Time to Interactive**: < 2.5 s
- **Lighthouse Score**: > 90
- **Bundle size**: < 200 KB (initial)
- **API response time**: < 200 ms (95th percentile)

---

## 17. Risks & Mitigation

| Risk                                  | Mitigation                                                                                                                     |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **Scope creep**                       | Limit each phase to defined features; maintain backlog for later phases.                                                       |
| **Complex integrations** (SCORM, SSO) | Prototype integrations in isolation before production.                                                                         |
| **Performance issues**                | Use CDN for static assets; optimise queries; monitor via Sentry and Vercel analytics.                                          |
| **Low adoption**                      | Engage early adopters; gather feedback; iterate quickly.                                                                       |
| **Security & compliance**             | Apply OWASP best practices; encrypt data at rest and in transit; prepare for GDPR compliance and later SOC 2/ISO 27001 audits. |

---

## 18. Go/No‑Go Checklist

Before development begins, ensure that:
[ ] GitHub repository telesis-app is initialized with main/develop branches and CI/CD pipeline.
[ ] Vercel account is set up with the repo connected.
[ ] Clerk account is created and configured for auth keys.
[ ] Postgres database is provisioned (e.g. Neon/Planetscale); environment variables are configured.
[ ] Supabase account is ready for file storage and realtime features.
[ ] Figma workspace and design system are ready.
[ ] Claude and MCP servers are configured locally.
[ ] Domain telesis.app (or alternative) is registered and DNS configured.

---

## 19. Launch Strategy

1. **Private Beta** (end of month 4): onboard select trainers and organizations; gather feedback on onboarding, course creation and SCORM upload.
2. **Public Beta** (month 6): open registration to the public; monitor usage; address critical issues.
3. **Growth Phase** (post‑month 6): roll out paid plans, AI recommendations and mobile apps; continue to refine the platform based on metrics.

---

## 20. Monitoring & Observability

### Application Monitoring

To keep the MVP lean, monitoring will rely on two tools:

- **Sentry** – Capture errors and performance traces across the frontend and backend.
- **Vercel Analytics** – Track web vitals and high‑level usage metrics without custom instrumentation.

### Infrastructure Monitoring

- **Vercel** – Use built‑in deployment logs and edge function metrics for operational visibility.
- **Database provider** – Rely on Neon or Planetscale’s dashboards for database performance; additional tooling will be added only if necessary.

### Alerting Rules

- **Error rate threshold** – If the error rate exceeds 1 % of requests, trigger a PagerDuty alert.
- **API latency threshold** – When 95th percentile latency exceeds 500 ms, send a Slack notification.

We will revisit monitoring tooling and alerting thresholds as the platform scales.

---

## 21. Data Privacy & Compliance

Telesis treats user data with the highest respect and complies with applicable privacy laws such as the
General Data Protection Regulation (GDPR).

### GDPR Requirements

- **Cookie consent** – Display a banner on first visit asking users to accept or reject analytics cookies.
- **Privacy policy and Terms of Service** – Publish clear policies describing what data is collected, why it is collected and how it will be used.
- **Data export** – Provide users and organizations with a way to download their personal data and training records.
- **Right to deletion** – Allow users to request deletion of their data; permanently remove personal data within 30 days of the request.
- **Data processing agreements (DPA)** – Sign DPAs with any third‑party processors (e.g. Supabase, Clerk, Stripe) and provide DPAs to enterprise customers on request.

### Data Retention

- **User accounts** – Retain user profile information for three years after the last activity; purge
dormant accounts thereafter.
- **Course progress** – Keep progress and certification records indefinitely unless the user requests deletion.
- **Payment records** – Retain transaction records for seven years to comply with fiscal and legal requirements.

---

## 22. Customer Support Strategy

Providing excellent support is critical to user satisfaction and retention. Telesis will offer multiple support channels and service‑level objectives.

### Support Channels

- **Email support** – Centralised inbox (<support@telesis.app>) with ticketing.
- **Live chat widget** – Embedded chat on the dashboard for real‑time assistance during business hours.
- **Community forum** – A public forum for users to ask questions, share best practices and vote on feature requests.

### Service‑Level Objectives

- **First response time** – Aim to respond to new tickets within 24 hours.
- **Resolution time** – Target resolution within 72 hours for routine issues and four hours for critical production incidents.
- **Availability** – Support team available Monday–Friday, 09:00–18:00 CET; emergency on‑call for high severity issues.

#### Priority Levels

To ensure timely responses, support requests will be categorised:

- **P1 (Critical)** – Production down or data loss; response within one hour; resolution within four hours.
- **P2 (High)** – Major feature broken or significant performance degradation; response within four hours; resolution within 24 hours.
- **P3 (Medium)** – Minor bugs that impair functionality but have workarounds; response within 24 hours; resolution within 72 hours.
- **P4 (Low)** – Feature requests and cosmetic issues; response within 72 hours; address in future releases.

### Self‑Service Resources

- **Knowledge base** – A searchable library of articles, how‑to guides and troubleshooting steps.
- **FAQs** – Frequently asked questions about account setup, course creation and SCORM uploads.
- **Video tutorials** – Short walkthroughs covering common tasks for trainers and learners.

### Feedback Loop

- Gather user feedback via surveys and Net Promoter Score (NPS) at regular intervals.
- Use feedback to inform product roadmap and improve support processes.

---

## 23. Backup & Disaster Recovery

Telesis will implement robust backup and recovery procedures to protect data and ensure availability.

### Backup Strategy

- **Automated backups** – Perform daily snapshots of the PostgreSQL database and Supabase Storage; encrypt backups at rest.
- **Offsite storage** – Store backups in a separate geographic region to protect against regional outages.
- **Verification** – Test restore procedures weekly to verify backup integrity.

### Disaster Recovery

- **Replication** – Use database and storage providers that support multi‑region replication to minimise downtime.
- **RTO (Recovery Time Objective)** – Four hours; the maximum acceptable time to restore service after a catastrophic failure.
- **RPO (Recovery Point Objective)** – One hour; the maximum acceptable amount of data loss measured in time.
- **Runbooks** – Maintain detailed runbooks covering failover and recovery steps, including contact lists and decision trees.

---

## 24. Pricing & Business Model

**Launch pricing**: €10/month from day one
- Includes 10 AI transformations per day
- Unlimited content uploads
- All output formats included

**Why paid from start:**
- Covers AI API costs
- Filters for serious early adopters
- Generates immediate revenue metrics
- Validates willingness to pay

### Post‑MVP Considerations

After validating the core proposition, Telesis may adopt a freemium model. Potential tiers could include:

- **Free Plan** – Continue to allow unlimited uploads and micro‑modules with basic analytics and community support.
- **Pro Plan** – Offer additional storage, advanced analytics and personalised recommendations for a monthly fee.
- **Enterprise Plan** – Provide custom branding, SSO integration, API access and dedicated support with usage‑based pricing.

No final pricing has been set. Detailed pricing strategy will be defined in a separate Marketing &
Monetisation Plan once the MVP is live and user insights are collected.

---

## 25. Data Portability & Exit Strategy

Telesis believes that users and organisations own their data. Should a customer decide to leave the platform, we will make migration simple and transparent.

### User Data Export

- **Full export** – Provide a complete export of a user’s data (profile, materials, micro‑modules, progress and certificates) in machine‑readable formats (JSON/CSV) upon request.
- **SCORM & originals** – Allow download of any SCORM packages or original source files uploaded by trainers.
- **Certificates** – Generate PDF certificates for learners to keep even after leaving the platform.

### Migration Support

- **Grace period** – After subscription cancellation, keep the account active for 30 days to allow data export and transition.
- **API access** – Maintain API endpoints so customers can automate migrations to other systems.
- **Self‑hosting roadmap** – Consider offering a self‑hosted version of the platform in the future to enable full control and customisation.

---

## 26. Future: Agentic Intelligence Layer

The ultimate vision for Telesis includes an agentic intelligence layer that can proactively guide learners along personalised paths and coach them toward mastery.

### Data Collection (start day 1)

- Track every interaction: clicks, hovers, scrolls and time spent on each micro‑module.
- Record completion patterns and performance on practice exercises.
- Capture explicit feedback signals (ratings, comments, quiz responses).

### Vector Embeddings & Knowledge Graph

- Generate embeddings for all source materials and micro‑modules using OpenAI or similar models.
- Store embeddings in a vector database (e.g. Pinecone/Weaviate) to enable semantic search and similarity matching.
- Build a knowledge graph linking related concepts across materials to support deeper reasoning.

### Personalisation Engine

- Apply collaborative filtering and content‑based recommendation techniques to suggest next modules and resources.
- Use reinforcement learning to optimise sequences of modules based on measured learning outcomes (e.g. quiz scores, retention).
- Leverage AI agents to coach users, answer questions and adapt content in real time.

By following this master PRD and leveraging the SaaS‑Boilerplate’s built‑in features 1, Telesis can
launch a robust training platform that scales with user needs while maintaining a clean, accessible design inspired by our minimalist design principles.

---

[^1] [^2] GitHub - ixartz/SaaS-Boilerplate: SaaS Boilerplate built with Next.js + Tailwind CSS + Shadcn UI + TypeScript. ⚡ Full-stack React application with Auth, Multi-tenancy, Roles & Permissions, i18n, Landing Page, DB, Logging, Testing
<https://github.com/ixartz/SaaS-Boilerplate>

[^3] GitHub - S4-NetQuest/react-scorm-provider: Components to easily enable SCORM API communication in React projects.
<https://github.com/S4-NetQuest/react-scorm-provider>

[^4] GitHub - jcputney/scorm-again: A modern SCORM JavaScript runtime library.
<https://github.com/jcputney/scorm-again>

---
