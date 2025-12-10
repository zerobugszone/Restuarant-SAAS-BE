ALTER TABLE "tenants" DROP CONSTRAINT "tenants_database_name_unique";--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "database_url" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "database_name";--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "database_host";--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "database_port";