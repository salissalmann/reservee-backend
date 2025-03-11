import {
    pgTable,
    serial,
    integer,
} from "drizzle-orm/pg-core";

export const wishlistTable = pgTable("wishlist", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull(), // Creator's ID
        //ids of events
    event_ids: integer("event_ids").array(),
});




