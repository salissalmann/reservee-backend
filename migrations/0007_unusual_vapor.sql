CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_ids" integer[]
);
--> statement-breakpoint
ALTER TABLE "system_users" ADD COLUMN "kyc_status" varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "system_users" ADD COLUMN "veriff_id" varchar(255);--> statement-breakpoint
ALTER TABLE "system_users" ADD COLUMN "kyc_verified_at" date;