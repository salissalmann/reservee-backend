import { serial,integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  user_query: text("user_query").notNull(),
  status: text("status").notNull().default("pending"), // You might want to use enum here
  response: text("response"),
  user_id: integer("user_id").notNull(),
  event_id: integer("event_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  is_disabled: boolean("is_disabled").default(false).notNull(),
  is_deleted: boolean("is_deleted").default(false).notNull(),
});
