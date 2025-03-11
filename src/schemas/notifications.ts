import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    integer,
    jsonb,
    boolean,
} from "drizzle-orm/pg-core";

export const notificationsTable = pgTable("notifications", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull(), // Creator's ID
    color_scheme: varchar("color_scheme", { length: 50 }),
    icon_type: varchar("icon_type", { length: 20 }).notNull().$type<"WARNING" | "INFO" | "SUCCESS" | "ERROR">(), 
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    buttons: jsonb("buttons").default("[]"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    type: varchar("type", { length: 20 }).default("USER"), //either ["USER", "VENDOR", "ALL", "ADMIN"]
    is_read: boolean("is_read").default(false),
});

// -- Example JSON structure for buttons:
// -- [
// --   { "text": "View", "icon": "https://example.com/view-icon.png", "color": "#FF5733", "url": "https://example.com/view" },
// --   { "text": "Dismiss", "color": "#CCCCCC", "url": null }
// -- ]

