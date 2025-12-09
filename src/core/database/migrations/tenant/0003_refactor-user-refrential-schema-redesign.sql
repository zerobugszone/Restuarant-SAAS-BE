ALTER TABLE "auth"."role_permissions" ALTER COLUMN "role_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "auth"."role_permissions" ALTER COLUMN "permission_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "auth"."user_roles" ALTER COLUMN "role_id" SET DATA TYPE uuid;