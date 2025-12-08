CREATE TABLE "customers" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"loyalty_points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"item_name" varchar(100) NOT NULL,
	"quantity" integer NOT NULL,
	"unit" varchar(20),
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_categories" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"price" numeric NOT NULL,
	"category_id" varchar(36),
	"is_available" boolean DEFAULT true NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"menu_item_id" varchar(36) NOT NULL,
	"quantity" integer NOT NULL,
	"notes" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"customer_id" varchar(36),
	"table_id" varchar(36),
	"status" varchar(30) NOT NULL,
	"total" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"code" varchar(10) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "qr_codes" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"table_id" varchar(36),
	"menu_section_id" varchar(36),
	"code" varchar(255) NOT NULL,
	"type" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_settings" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"theme" varchar(50),
	"currency" varchar(10),
	"tax" numeric DEFAULT '0' NOT NULL,
	"service_charge" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"role_id" varchar(36) NOT NULL,
	"permission_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "tables" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"number" varchar(10) NOT NULL,
	"capacity" integer NOT NULL,
	"section" varchar(50),
	"qr_code" varchar(255),
	"is_occupied" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"amount" numeric NOT NULL,
	"method" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"role_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_tenant_id_unique" UNIQUE("tenant_id")
);
