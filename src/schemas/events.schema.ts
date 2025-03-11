import {
    pgTable,
    serial,
    text,
    boolean,
    json,
    timestamp,
    varchar,
    numeric,
    integer,
} from "drizzle-orm/pg-core";

export const eventTable = pgTable("events", {
    id: serial("id").primaryKey(),
    org_id: integer("org_id"), // Foreign key to organizations
    user_id: integer("user_id").notNull(), // Creator's ID
    event_title: varchar("event_title", { length: 255 }).notNull(),
    event_type: varchar("event_type", { length: 20 }).notNull(), // Single Day or Multiple Days
    date_times: json("date_times").notNull(), // Array of date/time objects
    price_starting_range: numeric("price_starting_range").notNull(),
    price_ending_range: numeric("price_ending_range").notNull(),
    event_desc: text("event_desc"), // Stores description.summary
    event_tags: json("event_tags"), // Array of tags
    images: json("images"), // Stores images.files array
    is_published: boolean("is_published").default(false), // Default to unpublished
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    is_featured: boolean("is_featured").default(false),
    is_disabled: boolean("is_disabled").default(false),
    is_deleted: boolean("is_deleted").default(false),
    created_by: integer("created_by").notNull(), // User ID of the creator
    updated_by: integer("updated_by").notNull(), // User ID of the updater
});
