CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar,
	"type" varchar(50),
	"logo" text,
	"created_by" integer NOT NULL,
	"is_published" boolean DEFAULT false,
	"updated_by" integer NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"event_title" varchar(255) NOT NULL,
	"event_type" varchar(20) NOT NULL,
	"date_times" json NOT NULL,
	"price_starting_range" numeric NOT NULL,
	"price_ending_range" numeric NOT NULL,
	"currency" varchar(10) NOT NULL,
	"venue_name" varchar(255),
	"venue_address" text,
	"venue_coords" json,
	"venue_config" varchar,
	"event_desc" text,
	"event_tags" json,
	"images" json,
	"video" varchar(255),
	"is_published" boolean DEFAULT false,
	"tx_id" varchar(400),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_featured" boolean DEFAULT false,
	"is_disabled" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"ticket_types" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"role_id" integer NOT NULL,
	"message" varchar(500),
	"link_id" varchar(255) NOT NULL,
	"invitation_status" varchar(20) DEFAULT 'Pending',
	"is_used" boolean DEFAULT false,
	"is_disabled" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"org_id" integer NOT NULL,
	"event_id" integer,
	"org_name" varchar(255),
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"modules" jsonb DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"color_scheme" varchar(50),
	"icon_type" varchar(20) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"buttons" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"type" varchar(20) DEFAULT 'USER',
	"is_read" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"ticket_id" integer,
	"quantity" integer DEFAULT 1,
	"price" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"type" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderQRCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"area_id" varchar(255),
	"seat_number" varchar(255),
	"ticket_id" integer,
	"ticket_qty_index" integer,
	"code" varchar(350),
	"is_scanned" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seat_map_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_item_id" integer NOT NULL,
	"area_name" varchar(255) NOT NULL,
	"area_id" varchar(255) NOT NULL,
	"seat_number" varchar(50) NOT NULL,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"total_amount" numeric NOT NULL,
	"event_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"status" varchar(50) DEFAULT 'pending',
	"payment_id" varchar,
	"type" varchar(20) NOT NULL,
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar,
	"type" varchar(50),
	"logo" text,
	"categories" integer[],
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	CONSTRAINT "organizations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otp" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"is_disabled" boolean DEFAULT false,
	"is_used" boolean DEFAULT false,
	"is_for_password" boolean DEFAULT false,
	"provider" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_query" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_disabled" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles_module" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"front_end_routes" varchar(255)[] NOT NULL,
	"backend_routes" varchar(255)[] NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	"created_by" integer,
	"updated_by" integer,
	"is_disabled" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	"created_by" integer,
	"updated_by" integer,
	"is_disabled" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar NOT NULL,
	"country_code" varchar(10),
	"phone_no" varchar(15),
	"password" varchar(100),
	"wallet_address" varchar(255),
	"wallet_private_key" varchar(255),
	"is_google" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	"created_by" integer,
	"updated_by" integer,
	"is_disabled" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"refresh_token" varchar(1000),
	"dob" date,
	"gender" varchar(50),
	"invitation_id" integer,
	CONSTRAINT "system_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar,
	"type" varchar(50),
	"logo" text,
	"org_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"is_published" boolean DEFAULT false,
	"updated_by" integer NOT NULL,
	CONSTRAINT "ticket_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"seating_plan" varchar,
	"event_id" integer NOT NULL,
	"org_id" integer NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"quantity_sold" integer DEFAULT 0,
	"price" integer,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"is_disabled" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"event_id" integer,
	"modules" jsonb DEFAULT '[]',
	"is_disabled" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar NOT NULL,
	"country_code" varchar(10),
	"phone_no" varchar(15),
	"password" varchar(100),
	"wallet_address" varchar(255),
	"wallet_private_key" varchar(255),
	"is_google" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	"created_by" integer,
	"updated_by" integer,
	"is_disabled" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"refresh_token" varchar(1000),
	"dob" date,
	"gender" varchar(50),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderQRCodes" ADD CONSTRAINT "orderQRCodes_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderQRCodes" ADD CONSTRAINT "orderQRCodes_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seat_map_details" ADD CONSTRAINT "seat_map_details_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_module" ADD CONSTRAINT "roles_module_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system_users" ADD CONSTRAINT "system_users_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_categories" ADD CONSTRAINT "ticket_categories_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_system_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
