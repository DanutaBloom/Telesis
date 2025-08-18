CREATE TABLE IF NOT EXISTS "ai_transformations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_id" uuid NOT NULL,
	"model_used" text NOT NULL,
	"transformation_type" varchar(50) NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"processing_time" integer,
	"quality_score" integer,
	"user_feedback" jsonb,
	"status" varchar(20) DEFAULT 'pending',
	"error_message" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"module_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"progress" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"last_accessed" timestamp,
	"completed_at" timestamp,
	"rating" integer,
	"feedback" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"creator_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"module_ids" jsonb DEFAULT '[]'::jsonb,
	"estimated_duration" integer,
	"difficulty" varchar(10) DEFAULT 'medium',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"is_public" jsonb DEFAULT 'true'::jsonb,
	"enrollment_count" integer DEFAULT 0,
	"average_rating" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"trainer_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_type" varchar(50),
	"original_uri" text NOT NULL,
	"file_size" integer,
	"status" varchar(20) DEFAULT 'uploaded',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "micro_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"content_uri" text,
	"duration" integer,
	"difficulty" varchar(10) DEFAULT 'medium',
	"learning_style" varchar(20),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"learning_style" jsonb DEFAULT '["reading"]'::jsonb,
	"time_preference" integer DEFAULT 15,
	"topics_interested" jsonb DEFAULT '[]'::jsonb,
	"difficulty_preference" varchar(10) DEFAULT 'medium',
	"notifications_enabled" jsonb DEFAULT '{"email":true,"push":false,"reminders":true}'::jsonb,
	"completed_paths" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_transformations" ADD CONSTRAINT "ai_transformations_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_module_id_micro_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."micro_modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials" ADD CONSTRAINT "materials_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "micro_modules" ADD CONSTRAINT "micro_modules_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "micro_modules" ADD CONSTRAINT "micro_modules_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
