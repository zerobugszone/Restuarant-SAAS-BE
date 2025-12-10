CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "setting";
--> statement-breakpoint
CREATE SCHEMA "subscription";
--> statement-breakpoint
CREATE TABLE "auth"."superadmins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'owner' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "superadmins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth"."tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subdomain" varchar(100) NOT NULL,
	"database_url" varchar(500) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"tenant_id" uuid NOT NULL,
	"settings" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE "setting"."global_settings" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"setting" varchar(100) NOT NULL,
	"value" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription"."plan_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"feature_name" varchar(100) NOT NULL,
	"feature_limit" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription"."subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plan_type" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"billing_cycle" varchar(50),
	"amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "global_settings" CASCADE;--> statement-breakpoint
DROP TABLE "tenants" CASCADE;--> statement-breakpoint
DROP TABLE "subscriptions" CASCADE;--> statement-breakpoint
DROP TABLE "superadmins" CASCADE;--> statement-breakpoint
ALTER TABLE "subscription"."plan_features" ADD CONSTRAINT "plan_features_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "subscription"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription"."subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "auth"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP SCHEMA "plan_features";
