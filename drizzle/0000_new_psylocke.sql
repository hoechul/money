CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"company_name" text,
	"contact_name" text,
	"contact_phone" text,
	"contact_email" text,
	"consent_agreed" boolean NOT NULL,
	"profile" jsonb NOT NULL,
	"eligible_count" integer NOT NULL,
	"conditional_count" integer NOT NULL,
	"ineligible_count" integer NOT NULL,
	"eligible_programs" jsonb NOT NULL,
	"conditional_programs" jsonb NOT NULL,
	"watch_external_programs" jsonb NOT NULL
);
