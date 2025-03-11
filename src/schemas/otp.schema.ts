import { pgTable, serial, text, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

// Define the OTP table schema
export const otpTable = pgTable('otp', {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    code: text('code').notNull(),
    is_disabled: boolean('is_disabled').default(false),
    is_used: boolean('is_used').default(false),
    is_for_password: boolean('is_for_password').default(false),
    provider: varchar('provider', { length: 50 }).notNull(), // Changed to varchar
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});
