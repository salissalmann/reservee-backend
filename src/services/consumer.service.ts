import { eq, and } from "drizzle-orm"; // Import query helpers
import * as bcrypt from "bcryptjs";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { SignUpUserDto } from "@/types/auth.types";
import { userTable } from "@/schemas/users.schema";

export class ConsumerService {
    private db: NeonHttpDatabase;

    constructor(db: NeonHttpDatabase) {
        this.db = db;
    }


    async getUserByEmail(email: string) {
        const user = await this.db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email)) // Use `eq` for equality comparison
            .limit(1);
        return user[0];
    }

    async updateUser(
        userId: number,
        updates: Partial<{
            password: string;
            first_name: string;
            last_name: string;
            email: string;
            email_verified: boolean;
            is_disabled: boolean;
            phone_no: string;
            country_code: string;
            image: string;
            city: string;
            state: string;
            country: string;
            dob: string | Date;
            gender: string;
        }>
    ) {
        if (Object.keys(updates).length === 0) {
            throw new Error("No fields to update");
        }

        // Prepare the updates object with proper data transformations
        const preparedUpdates: Record<string, any> = { ...updates };

        if (updates.dob instanceof Date) {
            preparedUpdates.dob = updates.dob.toISOString().split("T")[0]; // Convert Date to 'YYYY-MM-DD'
        }

        const [updatedUser] = await this.db
            .update(userTable)
            .set(preparedUpdates) // Use the transformed updates
            .where(eq(userTable.id, userId))
            .returning();

        return updatedUser;
    }

    async getUserByIdUpdateRefreshToken(userId: number, refresh_token: string) {

        const [updatedUser] = await this.db
            .update(userTable)
            .set({ refresh_token: refresh_token }) // Use the transformed updates
            .where(eq(userTable.id, userId))
            .returning();

        return updatedUser;

    }

    async getUserById(userId: number) {
        const user = await this.db
            .select()
            .from(userTable)
            .where(eq(userTable.id, userId))
            .limit(1);

        return user[0] || null; // Return the user or null if not found
    }

    async getUserByPhoneNumber(country_code: string, phone_no: string) {
        const user = await this.db
            .select()
            .from(userTable)
            .where(
                and(
                    eq(userTable.country_code, country_code),
                    eq(userTable.phone_no, phone_no)
                )
            )
            .limit(1);
        return user[0] || null;
    }

    private cleanObject(obj: Record<string, any>): Record<string, any> {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, value ?? ""]) // Replace undefined with empty string
        );
    }

    async insertUser(body: SignUpUserDto) {
        const {
            email,
            phone_no,
            country_code,
            password,
            first_name,
            last_name,
            otp, // Include for potential future validations
            ...rest
        } = body;

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            first_name: first_name,                 // Required field
            last_name: last_name ?? "",            // Default to empty string if undefined
            email,                                 // Required field
            phone_no,                              // Required field
            country_code: country_code ?? "",      // Default to empty string if undefined
            is_disabled: false,                    // Default value
            email_verified: true,                  // Default value
            password: hashedPassword,              // Hashed password
            ...this.cleanObject(rest),             // Clean optional fields
        };

        // Insert into the database
        const [user] = await this.db
            .insert(userTable)
            .values(userData)
            .returning();

        return user;
    }

    async insertGoogleUser(body: any) {
        const {
            email,
            phone_no,
            country_code,
            password,
            first_name,
            last_name,
            image,
            wallet_address,
            wallet_private_key,
            ...rest
        } = body;

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            first_name: first_name,                 // Required field
            last_name: last_name ?? "",            // Default to empty string if undefined
            email,                                 // Required field
            phone_no,
            image,                              // Required field
            country_code: country_code ?? "",      // Default to empty string if undefined
            is_disabled: false,                    // Default value
            email_verified: true,                  // Default value
            password: hashedPassword,
            wallet_address: wallet_address,
            wallet_private_key: wallet_private_key,
            ...this.cleanObject(rest),             // Clean optional fields
        };

        // Insert into the database
        const [user] = await this.db
            .insert(userTable)
            .values(userData)
            .returning();

        return user;
    }

    async insertMemberUser(body: SignUpUserDto) {
        const {
            email,
            phone_no,
            country_code,
            password,
            first_name,
            last_name,
            ...rest
        } = body;

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            first_name: first_name,                 // Required field
            last_name: last_name ?? "",            // Default to empty string if undefined
            email,                                 // Required field
            phone_no,                              // Required field
            country_code: country_code ?? "",      // Default to empty string if undefined
            is_disabled: false,                    // Default value
            email_verified: true,                  // Default value
            password: hashedPassword,              // Hashed password
            ...this.cleanObject(rest),             // Clean optional fields
        };

        // Insert into the database
        const [user] = await this.db
            .insert(userTable)
            .values(userData)
            .returning();

        return user;
    }

}
