ALTER TABLE "system_users" ADD COLUMN "payment_intent_id" varchar(255);--> statement-breakpoint
ALTER TABLE "system_users" ADD COLUMN "has_paid_initial_fee" boolean DEFAULT false NOT NULL;