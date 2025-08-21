import { z } from 'zod';

/**
 * Zod validation schemas for API security
 * SECURITY: Prevents XSS, injection attacks, and data corruption (OWASP A03)
 */

// Common validation patterns
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CLERK_ID_REGEX = /^[\w-]+$/;

// Sanitization transforms
const sanitizeString = (str: string) =>
  str.trim().replace(/<[^>]*>/g, ''); // Basic HTML tag removal

const sanitizeOptionalString = z
  .string()
  .optional()
  .transform(val => val ? sanitizeString(val) : undefined);

// Internal use only - not exported
// const sanitizeRequiredString = z
//   .string()
//   .min(1, 'Required field cannot be empty')
//   .transform(sanitizeString);

const createSanitizedString = (minLength: number = 1, maxLength?: number) => {
  let schema = z.string().min(minLength, 'Required field cannot be empty');
  if (maxLength) {
    schema = schema.max(maxLength, `Must be less than ${maxLength} characters`);
  }
  return schema.transform(sanitizeString);
};

/**
 * Materials API Validation Schemas
 */
export const CreateMaterialSchema = z.object({
  organizationId: z
    .string()
    .min(1, 'Organization ID is required')
    .regex(CLERK_ID_REGEX, 'Invalid organization ID format')
    .max(100, 'Organization ID too long'),

  trainerId: z
    .string()
    .min(1, 'Trainer ID is required')
    .regex(CLERK_ID_REGEX, 'Invalid trainer ID format')
    .max(100, 'Trainer ID too long'),

  title: createSanitizedString(1, 200),

  description: sanitizeOptionalString
    .refine(val => !val || val.length <= 1000, 'Description must be less than 1000 characters'),

  fileType: z
    .enum(['pdf', 'video', 'slides', 'document', 'image'], {
      errorMap: () => ({ message: 'Invalid file type. Must be pdf, video, slides, document, or image' }),
    }),

  originalUri: z
    .string()
    .min(1, 'File URI is required')
    .url('Must be a valid URL')
    .max(500, 'URI too long'),

  fileSize: z
    .number()
    .int('File size must be an integer')
    .min(1, 'File size must be greater than 0')
    .max(1024 * 1024 * 1024, 'File size cannot exceed 1GB') // 1GB limit
    .optional(),
});

export const GetMaterialsQuerySchema = z.object({
  organizationId: z
    .string()
    .regex(CLERK_ID_REGEX, 'Invalid organization ID format')
    .optional(),

  trainerId: z
    .string()
    .regex(CLERK_ID_REGEX, 'Invalid trainer ID format')
    .optional(),

  status: z
    .enum(['uploaded', 'processing', 'completed', 'failed'])
    .optional(),

  fileType: z
    .enum(['pdf', 'video', 'slides', 'document', 'image'])
    .optional(),

  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),

  offset: z
    .number()
    .int('Offset must be an integer')
    .min(0, 'Offset cannot be negative')
    .optional()
    .default(0),
});

/**
 * Organizations API Validation Schemas
 */
export const CreateOrganizationSchema = z.object({
  id: z
    .string()
    .min(1, 'Organization ID is required')
    .regex(CLERK_ID_REGEX, 'Invalid organization ID format')
    .max(100, 'Organization ID too long'),

  stripeCustomerId: z
    .string()
    .startsWith('cus_', 'Invalid Stripe customer ID format')
    .max(100, 'Stripe customer ID too long')
    .optional()
    .nullable(),
});

export const UpdateOrganizationSchema = z.object({
  stripeCustomerId: z
    .string()
    .startsWith('cus_', 'Invalid Stripe customer ID format')
    .max(100, 'Stripe customer ID too long')
    .optional()
    .nullable(),

  stripeSubscriptionId: z
    .string()
    .startsWith('sub_', 'Invalid Stripe subscription ID format')
    .max(100, 'Stripe subscription ID too long')
    .optional()
    .nullable(),

  stripeSubscriptionPriceId: z
    .string()
    .startsWith('price_', 'Invalid Stripe price ID format')
    .max(100, 'Stripe price ID too long')
    .optional()
    .nullable(),

  stripeSubscriptionStatus: z
    .enum(['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'])
    .optional()
    .nullable(),
});

export const GetOrganizationsQuerySchema = z.object({
  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot exceed 50')
    .optional()
    .default(10),

  offset: z
    .number()
    .int('Offset must be an integer')
    .min(0, 'Offset cannot be negative')
    .optional()
    .default(0),

  hasStripeCustomer: z
    .boolean()
    .optional(),
});

/**
 * Micro Modules API Validation Schemas
 */
export const CreateMicroModuleSchema = z.object({
  materialId: z
    .string()
    .regex(UUID_REGEX, 'Invalid material ID format'),

  organizationId: z
    .string()
    .regex(CLERK_ID_REGEX, 'Invalid organization ID format')
    .max(100, 'Organization ID too long'),

  type: z
    .enum(['summary', 'visual', 'audio', 'practice', 'quiz'], {
      errorMap: () => ({ message: 'Invalid module type' }),
    }),

  title: createSanitizedString(1, 200),

  content: z
    .record(z.any()) // JSONB content - basic validation
    .refine((content) => {
      const str = JSON.stringify(content);
      return str.length <= 10000; // 10KB limit for content
    }, 'Content is too large'),

  contentUri: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URI too long')
    .optional(),

  duration: z
    .number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 minute')
    .max(120, 'Duration cannot exceed 120 minutes')
    .optional(),

  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .optional()
    .default('medium'),

  learningStyle: z
    .enum(['visual', 'auditory', 'reading', 'kinesthetic'])
    .optional(),
});

/**
 * User Preferences Validation Schemas
 */
export const UpdateUserPreferencesSchema = z.object({
  learningStyle: z
    .array(z.enum(['visual', 'auditory', 'reading', 'kinesthetic']))
    .min(1, 'At least one learning style must be selected')
    .max(4, 'Cannot select more than 4 learning styles')
    .optional(),

  timePreference: z
    .number()
    .int('Time preference must be an integer')
    .min(5, 'Minimum session time is 5 minutes')
    .max(180, 'Maximum session time is 180 minutes')
    .optional(),

  topicsInterested: z
    .array(createSanitizedString(1, 50))
    .max(20, 'Cannot select more than 20 topics')
    .optional(),

  difficultyPreference: z
    .enum(['easy', 'medium', 'hard'])
    .optional(),

  notificationsEnabled: z
    .object({
      email: z.boolean(),
      push: z.boolean(),
      reminders: z.boolean(),
    })
    .optional(),
});

/**
 * Common path parameter validation
 */
export const IdParamSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .max(100, 'ID too long'),
});

export const UUIDParamSchema = z.object({
  id: z
    .string()
    .regex(UUID_REGEX, 'Invalid UUID format'),
});

/**
 * Type inference helpers
 */
export type CreateMaterialRequest = z.infer<typeof CreateMaterialSchema>;
export type GetMaterialsQuery = z.infer<typeof GetMaterialsQuerySchema>;
export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationSchema>;
export type GetOrganizationsQuery = z.infer<typeof GetOrganizationsQuerySchema>;
export type CreateMicroModuleRequest = z.infer<typeof CreateMicroModuleSchema>;
export type UpdateUserPreferencesRequest = z.infer<typeof UpdateUserPreferencesSchema>;
