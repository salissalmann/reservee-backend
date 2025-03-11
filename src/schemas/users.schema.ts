import {
    pgTable,
    serial,
    varchar,
    text,
    boolean,
    date,
    pgEnum,
    integer,
} from 'drizzle-orm/pg-core';

// Define gender enum
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

// Define the User table
export const userTable = pgTable('users', {
    id: serial('id').primaryKey(), // Primary key with auto increment
    first_name: varchar('first_name', { length: 100 }).notNull(),
    last_name: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email').notNull().unique(), // Unique email
    country_code: varchar('country_code', { length: 10 }),
    phone_no: varchar('phone_no', { length: 15 }),
    password: varchar('password', { length: 100 }),
    wallet_address: varchar('wallet_address', { length: 255 }),
    wallet_private_key: varchar('wallet_private_key', { length: 255 }),
    is_google: boolean('is_google').default(false).notNull(),
    image: text('image'),
    created_at: date('created_at').defaultNow(),
    updated_at: date('updated_at').defaultNow(),
    created_by: integer('created_by'),
    updated_by: integer('updated_by'),
    is_disabled: boolean('is_disabled').default(false).notNull(),
    is_deleted: boolean('is_deleted').default(false).notNull(),
    email_verified: boolean('email_verified').default(false).notNull(),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    refresh_token: varchar('refresh_token', { length: 1000 }),
    dob: date('dob'),
    gender: varchar('gender', { length: 50 })
});

