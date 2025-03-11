CREATE TABLE IF NOT EXISTS "seat_reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"area_id" varchar(255) NOT NULL,
	"seat_number" varchar(50) NOT NULL,
	"reserved_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true
);
