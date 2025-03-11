import { eq, and, ne, or } from "drizzle-orm"; // Import query helpers
import * as bcrypt from "bcryptjs";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { SignUpUserDto } from "@/types/auth.types";
import { systemUserTable } from "@/schemas/system_users.schema";
import { wishlistTable } from "@/schemas/wishlist.schema";
import { notificationsTable } from "@/schemas/notifications";

export class UserService {
    private db: NeonHttpDatabase;

    constructor(db: NeonHttpDatabase) {
        this.db = db;
    }

    async getUserByEmail(email: string) {
        const user = await this.db
            .select()
            .from(systemUserTable)
            .where(eq(systemUserTable.email, email)) // Use `eq` for equality comparison
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
            .update(systemUserTable)
            .set(preparedUpdates) // Use the transformed updates
            .where(eq(systemUserTable.id, userId))
            .returning();

        return updatedUser;
    }

    async getUserByIdUpdateRefreshToken(userId: number, refresh_token: string) {

        const [updatedUser] = await this.db
            .update(systemUserTable)
            .set({ refresh_token: refresh_token }) // Use the transformed updates
            .where(eq(systemUserTable.id, userId))
            .returning();

        return updatedUser;

    }
    async getUserById(userId: number) {
        const user = await this.db
            .select()
            .from(systemUserTable)
            .where(eq(systemUserTable.id, userId))
            .limit(1);

        const wishlist = await this.db
            .select()
            .from(wishlistTable)
            .where(eq(wishlistTable.user_id, userId))
            .limit(1);

        const userWithWishlist = {
            ...user[0],
            wishlist: wishlist.length > 0 ? wishlist[0].event_ids : []
        };

        return userWithWishlist || null; // Return the user or null if not found
    }

    async getUserByPhoneNumber(country_code: string, phone_no: string) {
        const user = await this.db
            .select()
            .from(systemUserTable)
            .where(
                and(
                    eq(systemUserTable.country_code, country_code),
                    eq(systemUserTable.phone_no, phone_no)
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
            .insert(systemUserTable)
            .values(userData)
            .returning();


        await this.db.insert(notificationsTable).values({
            user_id: user.id,
            title: "Welcome to FairTicket",
            description: `Your account has been created successfully`,
            icon_type: "SUCCESS",
            type: "USER",
            buttons: [
                {
                    text: "View Events",
                    url: `/events`
                }
            ]
        });


        return user;
    }

    async insertGoogleUser(body: SignUpUserDto) {
        const {
            email,
            phone_no,
            country_code,
            password,
            first_name,
            last_name,
            image,
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
            password: hashedPassword,              // Hashed password
            ...this.cleanObject(rest),             // Clean optional fields
        };

        // Insert into the database
        const [user] = await this.db
            .insert(systemUserTable)
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
            invitation_id, // Extract invitation ID from body
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
            invitation_id: invitation_id ?? null,  // Include invitation ID or null if undefined
            ...this.cleanObject(rest),             // Clean optional fields
        };

        // Insert into the database
        const [user] = await this.db
            .insert(systemUserTable)
            .values(userData)
            .returning();

        return user;
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password!);
        if (!isPasswordCorrect) {
            throw new Error("Old password is incorrect");
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const [updatedUser] = await this.db
            .update(systemUserTable)
            .set({ password: hashedPassword })
            .where(eq(systemUserTable.id, userId))
            .returning();
        return updatedUser;
    }

    async updateProfile(userId: number, updates: Partial<{
        first_name: string;
        last_name: string;
        email: string;
        phone_no: string;
        city: string;
        state: string;
        country: string;
        dob: string | Date;
        gender: string;
        is_public: boolean;
        country_code: string;
        image: string;
    }>) {
        const preparedUpdates: Record<string, any> = { ...updates };
        if (updates.dob instanceof Date) {
            preparedUpdates.dob = updates.dob.toISOString().split("T")[0]; // Convert Date to 'YYYY-MM-DD'
        }
        const [updatedUser] = await this.db
            .update(systemUserTable)
            .set(preparedUpdates)
            .where(eq(systemUserTable.id, userId))
            .returning();
        return updatedUser;
    }

}
