import {
  bigint,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Telesis-specific schemas for AI-powered learning platform

export const materialsSchema = pgTable('materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
  trainerId: text('trainer_id').notNull(), // Clerk user ID
  title: text('title').notNull(),
  description: text('description'),
  fileType: varchar('file_type', { length: 50 }), // 'pdf', 'video', 'slides'
  originalUri: text('original_uri').notNull(),
  fileSize: integer('file_size'), // in bytes
  status: varchar('status', { length: 20 }).default('uploaded'), // 'uploaded', 'processing', 'completed', 'failed'
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const microModulesSchema = pgTable('micro_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  materialId: uuid('material_id').notNull().references(() => materialsSchema.id),
  organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
  type: varchar('type', { length: 20 }).notNull(), // 'summary', 'visual', 'audio', 'practice', 'quiz'
  title: text('title').notNull(),
  content: jsonb('content').notNull(), // Stores the actual micro-learning content
  contentUri: text('content_uri'), // For generated files (audio, images)
  duration: integer('duration'), // estimated time in minutes
  difficulty: varchar('difficulty', { length: 10 }).default('medium'), // 'easy', 'medium', 'hard'
  learningStyle: varchar('learning_style', { length: 20 }), // 'visual', 'auditory', 'reading', 'kinesthetic'
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const aiTransformationsSchema = pgTable('ai_transformations', {
  id: uuid('id').defaultRandom().primaryKey(),
  materialId: uuid('material_id').notNull().references(() => materialsSchema.id),
  modelUsed: text('model_used').notNull(), // 'gpt-4', 'claude-3', etc.
  transformationType: varchar('transformation_type', { length: 50 }).notNull(),
  inputTokens: integer('input_tokens'),
  outputTokens: integer('output_tokens'),
  processingTime: integer('processing_time'), // in seconds
  qualityScore: integer('quality_score'), // 1-10 rating
  userFeedback: jsonb('user_feedback'), // Stores ratings and comments
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'processing', 'completed', 'failed'
  errorMessage: text('error_message'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const userPreferencesSchema = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(), // Clerk user ID
  learningStyle: jsonb('learning_style').default(['reading']), // array of preferred styles
  timePreference: integer('time_preference').default(15), // minutes available per session
  topicsInterested: jsonb('topics_interested').default([]), // array of topics
  difficultyPreference: varchar('difficulty_preference', { length: 10 }).default('medium'),
  notificationsEnabled: jsonb('notifications_enabled').default({
    email: true,
    push: false,
    reminders: true,
  }),
  completedPaths: jsonb('completed_paths').default([]), // learning paths completed
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const enrollmentsSchema = pgTable('enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  moduleId: uuid('module_id').notNull().references(() => microModulesSchema.id),
  organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
  progress: integer('progress').default(0), // percentage 0-100
  timeSpent: integer('time_spent').default(0), // minutes spent
  lastAccessed: timestamp('last_accessed', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  rating: integer('rating'), // 1-5 stars
  feedback: text('feedback'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const learningPathsSchema = pgTable('learning_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
  creatorId: text('creator_id').notNull(), // Trainer who created the path
  title: text('title').notNull(),
  description: text('description'),
  moduleIds: jsonb('module_ids').default([]), // ordered array of micro_module IDs
  estimatedDuration: integer('estimated_duration'), // total minutes
  difficulty: varchar('difficulty', { length: 10 }).default('medium'),
  tags: jsonb('tags').default([]), // searchable tags
  isPublic: jsonb('is_public').default(true),
  enrollmentCount: integer('enrollment_count').default(0),
  averageRating: integer('average_rating'), // 1-5 stars
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
