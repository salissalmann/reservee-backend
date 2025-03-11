import {
    pgTable,
    serial,
    varchar,
    text,
    integer,
} from "drizzle-orm/pg-core";

// Define the Organizations table
export const organizationsTable = pgTable("organizations", {
    id: serial("id").primaryKey(), // Auto-incremented primary key
    name: varchar("name", { length: 100 }).notNull().unique(), // Unique organization name
    description: varchar("description"), // Optional organization description
    type: varchar("type", { length: 50 }),
    logo: text("logo"), // Logo URL or base64 string
    created_by: integer("created_by").notNull(), // User ID of the creator
    updated_by: integer("updated_by").notNull(), // User ID of the creator
});
