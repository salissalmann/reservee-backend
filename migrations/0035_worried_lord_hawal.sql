CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"color_scheme" varchar(50),
	"icon_image" text,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"buttons" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"type" varchar(20) DEFAULT 'USER'
);
