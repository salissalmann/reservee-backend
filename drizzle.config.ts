import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./src/schemas/**/*.ts", // Adjust the path to match your schema files
    out: "./migrations", // Directory for generated migrations
    dialect: "postgresql", // Ensure the dialect is set to "postgresql"
    dbCredentials: {
        host: "ep-hidden-glade-a1paosgz-pooler.ap-southeast-1.aws.neon.tech", // Updated host from your Neon DB URL
        port: 5432, // Default PostgreSQL port
        user: "reservee-db_owner", // Updated user
        password: "npg_YcOyNe4T9QJm", // Updated password
        database: "reservee-db", // Updated database name
        ssl: "require", // Use SSL connection
    },
});

