import { SignJWT } from "jose";
import { OtpService } from "@/services/otp.service";
import { UserService } from "../services/user.service";
import { Context, Hono } from "hono";
import * as bcryptjs from "bcryptjs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { AuthMiddleware } from "@/utils/auth.middleware";
import { jwtVerify } from "jose";

// Define the environment variable interface
interface Env {
    CLOUDFLARE_R2_BUCKET: string;
    CLOUDFLARE_PUBLIC_R2_URL: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_R2_ACCESS_KEY_ID: string;
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
    CLOUDFLARE_PUBLIC_DOMAIN_URL: String
}

export const createS3Client = (env: Env) =>
    new S3Client({
        region: "auto", // Required for Cloudflare R2
        endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
            secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        },
    });

interface VeriffSession {
    verification: {
        id: string;
        status: string;
    };
}

export class UserController {
    private userService: UserService;
    private otpService: OtpService;
    private authMiddleware: AuthMiddleware;


    constructor(
        userService: UserService,
        otpService: OtpService,
        authMiddleware: AuthMiddleware,
    ) {
        this.userService = userService;
        this.otpService = otpService;
        this.authMiddleware = authMiddleware;
    }

    registerRoutes(app: Hono) {

        app.post("/auth/sign-up", async (c: Context) => {
            try {
                const body = await c.req.json();
                if (!body.first_name || !body.last_name || !body.email || !body.password || !body.phone_no || !body.country_code || !body.otp) {

                    return c.json(
                        {
                            statusCode: 400,
                            status: true,
                            message: `Missing required fields: email, first_name, last_name, password, phone_no, country_code, otp`,
                            data: null,
                            error: "Missing required fields: email, first_name, last_name, password, phone_no, country_code, otp"
                        },
                        400
                    );
                }

                const emailExists = await this.userService.getUserByEmail(body.email);

                if (emailExists) {
                    return c.json({ statusCode: 409, status: false, message: `Email already in use`, data: null }, 409);
                }

                const phoneExists = await this.userService.getUserByPhoneNumber(body.country_code, body.phone_no);
                if (phoneExists) {
                    return c.json({ statusCode: 409, status: false, message: "Phone number already in use", data: null }, 409);
                }

                const otpExists = await this.otpService.validateOtp(body.email, body.otp);
                if (!otpExists?.status) {
                    return c.json({ statusCode: 400, status: false, message: "Invalid Otp", data: null }, 400);
                }

                const user = await this.userService.insertUser(body);

                console.log('user-------------', user)


                //return access token and refresh token
                const payload = { username: user.first_name, sub: user.id.toString() };
                const secretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983");
                const accessToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("3d")
                    .sign(secretKey);

                const refreshSecretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983fairticketrefreshtoken");
                const refreshToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("7d")
                    .sign(refreshSecretKey);

                await this.userService.getUserByIdUpdateRefreshToken(user.id, refreshToken);

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "User signed up successfully",
                    data: {
                        ...user,
                    },
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
            } catch (error) {
                console.error("Error in UserController:", error);
                return c.json({ statusCode: 500, status: false, message: "Failed to sign up user", data: null, error: "Failed to sign up user" }, 500);
            }
        });


        app.post("/auth/log-in", async (c) => {
            try {
                const { email, password } = await c.req.json();

                if (!email || !password) {
                    return c.json({
                        statusCode: 409,
                        status: false,
                        message: "Missing required fields: email, password",
                        data: null,
                        error: "Missing required fields",
                    }, 400);
                }

                const user = await this.userService.getUserByEmail(email.toLowerCase());
                if (!user || !user.password) {
                    return c.json({
                        statusCode: 400,
                        status: false,
                        message: "Invalid Credentials",
                        data: null,
                        error: "Invalid Credentials",
                    }, 400);
                }

                const passwordCorrect = await bcryptjs.compare(password, user.password);
                if (!passwordCorrect) {
                    return c.json({
                        statusCode: 400,
                        status: false,
                        message: "Invalid Credentials",
                        data: null,
                        error: "Invalid Credentials",
                    }, 400);
                }

                if (!user.email_verified) {
                    return c.json({
                        statusCode: 400,
                        status: false,
                        message: "Email not verified",
                        data: null,
                        error: "Email not verified",
                    }, 400);
                }

                if (user.is_disabled) {
                    return c.json({
                        statusCode: 400,
                        status: false,
                        message: "Restricted User",
                        data: null,
                        error: "Restricted User",
                    }, 400);
                }

                // Generate tokens
                const payload = { username: user.first_name, sub: user.id.toString() };
                const secretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983");
                const accessToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("3d")
                    .sign(secretKey);

                const refreshSecretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983fairticketrefreshtoken");
                const refreshToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("7d")
                    .sign(refreshSecretKey);

                await this.userService.getUserByIdUpdateRefreshToken(user.id, refreshToken);

                // Return user data with organizations and roles
                const { password: _, ...safeUser } = user;
                return c.json({
                    status: true,
                    statusCode: 200,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    message: "Login Successful",
                    user: {
                        ...safeUser,
                    },
                }, 200);
            } catch (error) {
                console.error("Error in UserController (login):", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to log in user",
                    data: null,
                }, 500);
            }
        });

        app.post("/auth/refresh-token", async (c) => {
            try {
                const { refresh_token } = await c.req.json();
                if (!refresh_token) {
                    return c.json(
                        {
                            statusCode: 400,
                            status: false,
                            message: "Refresh token is required",
                            error: "Missing refresh token",
                        },
                        400
                    );
                }

                const refreshSecretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983fairticketrefreshtoken");
                let decodedToken;

                // Verify the refresh token
                try {
                    decodedToken = await jwtVerify(refresh_token, refreshSecretKey);
                } catch (err) {
                    // Narrow the type of err
                    if (err instanceof Error) {
                        if ((err as any).name === "JWTExpired") {
                            return c.json(
                                {
                                    statusCode: 401,
                                    status: false,
                                    message: "Refresh token has expired",
                                    error: "Token expired",
                                },
                                401
                            );
                        }
                        return c.json(
                            {
                                statusCode: 401,
                                status: false,
                                message: "Invalid refresh token",
                                error: "Token verification failed",
                            },
                            401
                        );
                    }
                    return c.json(
                        {
                            statusCode: 500,
                            status: false,
                            message: "An unknown error occurred",
                            error: "Unknown error",
                        },
                        500
                    );
                }

                const userId: string | undefined = decodedToken.payload.sub;

                // Ensure userId is a valid number
                if (!userId || isNaN(Number(userId))) {
                    throw new Error("Invalid or missing userId in token payload");
                }

                const numericUserId: number = Number(userId);

                // Retrieve user from the database
                const user = await this.userService.getUserById(numericUserId);
                if (!user || user.refresh_token !== refresh_token) {
                    return c.json(
                        {
                            statusCode: 401,
                            status: false,
                            message: "Invalid or mismatched refresh token",
                            error: "Unauthorized",
                        },
                        401
                    );
                }

                if (user.is_disabled) {
                    return c.json(
                        {
                            statusCode: 403,
                            status: false,
                            message: "User is disabled",
                            error: "Access restricted",
                        },
                        403
                    );
                }

                // Generate new tokens
                const payload = { username: user.first_name, sub: user.id.toString() };
                const secretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983");
                const newAccessToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("3d")
                    .sign(secretKey);

                const newRefreshToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("7d")
                    .sign(refreshSecretKey);

                // Update refresh token in the database
                await this.userService.getUserByIdUpdateRefreshToken(user.id, newRefreshToken);

                const { password: _, ...safeUser } = user;

                return c.json(
                    {
                        status: true,
                        statusCode: 200,
                        message: "Token refreshed successfully",
                        access_token: newAccessToken,
                        refresh_token: newRefreshToken,
                        user: safeUser,
                    },
                    200
                );
            } catch (error) {
                console.error("Error in UserController (refresh-token):", error);
                return c.json(
                    {
                        statusCode: 500,
                        status: false,
                        message: "Failed to refresh token",
                        error: "Failed to refresh token",
                    },
                    500
                );
            }
        });

        app.post("/file-upload", async (c) => {
            try {
                const env = c.env as Env;
                console.log("Environment variables:", env); // Debugging

                const { CLOUDFLARE_R2_BUCKET, CLOUDFLARE_PUBLIC_DOMAIN_URL } = env;

                if (!CLOUDFLARE_R2_BUCKET) {
                    console.error("CLOUDFLARE_R2_BUCKET_NAME is not set");
                    return c.json({ statusCode: 500, status: false, message: `"Server configuration error"`, data: null }, 500);
                }

                const formData = await c.req.parseBody();
                const file = formData?.file;

                if (!file || typeof file === "string") {
                    return c.json({ statusCode: 400, status: false, message: "No valid file found in the request", data: null }, 400);
                }

                const uniqueFileName = `${uuidv4()}.${file.name.split(".").pop()}`;
                const params = {
                    Bucket: CLOUDFLARE_R2_BUCKET,
                    Key: uniqueFileName,
                    Body: file,
                };

                const client = createS3Client(env);
                await client.send(new PutObjectCommand(params));

                const fileUrl = `${CLOUDFLARE_PUBLIC_DOMAIN_URL}/${uniqueFileName}`;
                console.log(CLOUDFLARE_PUBLIC_DOMAIN_URL, fileUrl)
                return c.json({ statusCode: 200, status: true, message: "File uploaded successfully", data: fileUrl, fileUrl });
            } catch (error) {
                console.error("File upload error:", error);
                return c.json({ statusCode: 409, status: false, message: `Email already in use`, data: null, error: "An error occurred during the file upload" }, 500);
            }
        });

        app.post("/auth/google/log-in", async (c) => {
            try {
                // Step 1: Parse incoming JSON body
                const body = await c.req.json();

                // Step 2: Validate required fields
                if (!body.first_name || !body.email) {
                    return c.json(
                        {
                            statusCode: 400,
                            status: false,
                            message: "Missing required fields: first_name, email",
                            error: "Missing required fields",
                        },
                        400
                    );
                }

                // Step 3: Check if user exists by email
                let user = await this.userService.getUserByEmail(body.email.toLowerCase());
                let new_user = false;

                // Step 4: If user doesn't exist, create a new user
                if (!user) {
                    user = await this.userService.insertGoogleUser({
                        first_name: body.first_name,
                        last_name: body.last_name ?? "",  // Set empty string if undefined
                        email: body.email,
                        phone_no: body.phone_no ?? "",   // Default to empty string if not provided
                        image: body.image ?? "",          // Default to empty string if not provided
                        country_code: body.country_code ?? "",  // Default to empty string if not provided
                        password: "",  // Default password or some secure placeholder (consider setting this to a value if required)
                    });
                    new_user = true;
                }

                // Step 5: Create JWT Payload and Tokens
                const payload = { username: user.first_name, sub: user.id.toString() };

                // Create access token (3 days expiration)
                const secretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983");
                const accessToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("3d")
                    .sign(secretKey);

                const refreshSecretKey = new TextEncoder().encode("asdllkasfdservdfdrrr12345678696983fairticketrefreshtoken");
                const refreshToken = await new SignJWT(payload)
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("7d")
                    .sign(refreshSecretKey);

                // Step 6: Save refresh token (optional, depending on your requirements)
                if (!new_user) {
                    await this.userService.getUserByIdUpdateRefreshToken(user.id, refreshToken);
                }

                // Step 7: Return the response
                const { password, ...userData } = user; // Exclude sensitive data like password
                return c.json({
                    status: true,
                    statusCode: 201,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    message: "Login Successful",
                    user: userData,
                    is_new_user: new_user,
                }, 200);

            } catch (error) {
                // Step 8: Error handling
                console.error("Error in Google login:", error);
                return c.json(
                    {
                        statusCode: 500,
                        status: false,
                        message: "Failed to log in user",
                        data: null,
                        error: "Failed to log in user",
                    },
                    500
                );
            }
        });

        app.post("/file-upload/multiple", async (c) => {
            try {
                const env = c.env as Env;
                console.log("Environment variables:", env); // Debugging

                const { CLOUDFLARE_R2_BUCKET, CLOUDFLARE_PUBLIC_R2_URL } = env;

                if (!CLOUDFLARE_R2_BUCKET) {
                    console.error("CLOUDFLARE_R2_BUCKET_NAME is not set");
                    return c.json({ statusCode: 500, status: false, message: `"Server configuration error"`, data: null }, 500);
                }

                const formData = await c.req.parseBody({ all: true });
                console.log("formData:", formData); // Debugging
                let files: File | File[] | string | (string | File)[] = formData?.files;
                console.log("\n\nfiles-------", files);

                if (!files) {
                    return c.json({ statusCode: 400, status: false, message: "No files found", data: null }, 400);
                }

                // Wrap single file in an array
                if (!Array.isArray(files)) {
                    files = [files];
                }

                // Check if the array is empty or contains invalid entries
                if (!files.length || !files.every(file => typeof file === "object" && file.name)) {
                    return c.json({ statusCode: 400, status: false, message: "No valid files found in the request", data: null }, 400);
                }

                console.log("Processed files:", files);



                const client = createS3Client(env);

                // Array to store URLs of uploaded files
                const uploadedFileUrls = [];

                for (const file of files) {
                    if (typeof file === "string") continue; // Skip invalid entries

                    const uniqueFileName = `${uuidv4()}.${file.name.split(".").pop()}`;
                    const params = {
                        Bucket: CLOUDFLARE_R2_BUCKET,
                        Key: uniqueFileName,
                        Body: file,
                    };

                    try {
                        await client.send(new PutObjectCommand(params));
                        const fileUrl = `${CLOUDFLARE_PUBLIC_R2_URL}/${uniqueFileName}`;
                        uploadedFileUrls.push(fileUrl);
                    } catch (uploadError) {
                        console.error(`Error uploading file ${file.name}:`, uploadError);
                    }
                }

                if (uploadedFileUrls.length === 0) {
                    return c.json({ statusCode: 500, status: false, message: "Failed to upload all files", data: null }, 500);
                }

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Files uploaded successfully",
                    data: uploadedFileUrls,
                });
            } catch (error) {
                console.error("File upload error:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "An error occurred during the file upload",
                    data: null,
                    error: "An error occurred during the file upload",
                });
            }
        });

        app.get("/users", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                // Use middleware to authenticate and extract `user_id` from context
                const userId = parseInt(c.get("user_id"));

                if (!userId) {
                    return c.json({ statusCode: 401, status: false, message: "Unauthorized", data: null }, 401);
                }

                // Fetch the user data by ID
                const user = await this.userService.getUserById(userId);

                if (!user) {
                    return c.json({ statusCode: 404, status: false, message: "User not found", data: null }, 404);
                }

                // Exclude the password field
                const { password, ...userData } = user;

                return c.json({
                    status: true,
                    statusCode: 200,
                    // access_token: accessToken,
                    // refresh_token: refreshToken,
                    message: "Data fetched successfully",
                    user: {
                        ...userData,
                    },
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                return c.json({ statusCode: 500, status: false, message: "Failed to fetch user data", data: null }, 500);
            }
        });

        app.post("/auth/forgot-password", async (c: Context) => {
            try {
                const { email } = await c.req.json();

                // Validate email input
                if (!email || typeof email !== "string") {
                    return c.json({ statusCode: 400, status: false, message: "Invalid email provided.", data: null }, 400);
                }

                // Check if user exists
                const user = await this.userService.getUserByEmail(email.toLowerCase());
                if (!user) {
                    return c.json({ statusCode: 404, status: false, message: "User with this email does not exist.", data: null }, 404);
                }

                // Send OTP for password reset
                await this.otpService.sendEmailOtp(`${user.first_name} ${user.last_name}`, email, true, c.env.SENDGRID_API_KEY);

                return c.json({
                    statusCode: 200, status: true,
                    message: `A password reset OTP has been sent to your email (${user.email}).`,
                    data: { id: user.id, email: user.email },
                }, 200);
            } catch (error) {
                console.error("Error in forgot-password:", error);
                return c.json({ statusCode: 500, status: false, message: "Failed to process forgot-password request.", data: null }, 500);
            }
        }); 

        app.post("/auth/reset-password", async (c: Context) => {
            try {
                const { email, otp, new_password } = await c.req.json();

                // Validate input
                if (!email || !otp || !new_password) {
                    return c.json({ statusCode: 400, status: false, message: "Missing required fields: email, otp, new_password", data: null }, 400);
                }

                // Check if user exists
                const user = await this.userService.getUserByEmail(email.toLowerCase());
                if (!user) {
                    return c.json({ statusCode: 404, status: false, message: "User does not exist on the provided email.", data: null, }, 404);
                }

                // Validate OTP
                const otpValid = await this.otpService.validatePasswordOtp(email, otp);
                if (!otpValid) {
                    return c.json({ statusCode: 409, status: false, message: "Invalid or expired OTP", data: null, }, 409);
                }

                // Hash the new password
                const hashedPassword = await bcryptjs.hash(new_password, 10);

                // Update the user's password
                await this.userService.updateUser(user.id, { password: hashedPassword });

                return c.json({
                    message: "Password reset successfully.",
                });
            } catch (error) {
                console.error("Error in reset-password:", error);
                return c.json({ statusCode: 500, status: false, message: "Failed to process reset-password request.", data: null }, 500);
            }
        });

        app.put(
            "/users/onboard",
            async (c, next) => await this.authMiddleware.authenticate(c, next), // Middleware to authenticate user
            async (c: Context) => {
                try {
                    // Extract the authenticated user's ID from the context
                    const userId = parseInt(c.get("user_id"));

                    if (!userId) {
                        return c.json({ statusCode: 401, status: false, message: "Unauthorized", data: null, }, 401);
                    }

                    // Parse the request body for updates
                    const updates = await c.req.json();

                    // Validate the updates object
                    const validFields = [
                        "first_name",
                        "last_name",
                        "phone_no",
                        "country_code",
                        "image",
                        "city",
                        "state",
                        "country",
                        "dob",
                        "gender",
                    ];

                    // Filter out invalid fields from the updates
                    const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
                        if (validFields.includes(key) && updates[key] !== undefined) {
                            acc[key] = updates[key];
                        }
                        return acc;
                    }, {} as Record<string, any>);

                    if (Object.keys(filteredUpdates).length === 0) {
                        return c.json({ statusCode: 400, status: false, message: "No valid fields to update", data: null, error: "No valid fields to update" }, 400);
                    }

                    // Hash the password if it exists in the updates
                    if (filteredUpdates.password) {
                        filteredUpdates.password = await bcryptjs.hash(filteredUpdates.password, 10);
                    }

                    // Update the user
                    const updatedUser = await this.userService.updateUser(userId, filteredUpdates);

                    if (!updatedUser) {
                        return c.json({ statusCode: 500, status: false, message: "Failed to update user", data: null }, 500);
                    }

                    // Exclude sensitive fields like password from the response
                    const { password, ...safeUser } = updatedUser;

                    return c.json({
                        message: "User updated successfully",
                        user: safeUser,
                    });
                } catch (error) {
                    console.error("Error updating user:", error);
                    return c.json({ statusCode: 500, status: false, message: "Failed to update user", data: null, }, 500);
                }
            }
        );

        app.put("/users/change-password", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const { old_password, new_password } = await c.req.json();
                const userId = parseInt(c.get("user_id"));
                if (!userId) {
                    return c.json({ statusCode: 401, status: false, message: "Unauthorized", data: null }, 401);
                }
                const user = await this.userService.getUserById(userId);
                if (!user) {
                    return c.json({ statusCode: 404, status: false, message: "User not found", data: null }, 404);
                }
                const isPasswordCorrect = await bcryptjs.compare(old_password, user.password!);
                if (!isPasswordCorrect) {
                    return c.json({ statusCode: 409, status: false, message: "Old password is incorrect", data: null }, 409);
                }
                await this.userService.changePassword(userId, old_password, new_password);
                return c.json({ statusCode: 200, status: true, message: "Password changed successfully", data: null }, 200);
            } catch (error) {
                console.error("Error changing password:", error);
                return c.json({ statusCode: 500, status: false, message: "Failed to change password", data: null }, 500);
            }
        });

        app.put("/users/profile", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            const userId = parseInt(c.get("user_id"));
            const { first_name, last_name, email, phone_no, city, state, country, dob, gender, is_public, country_code, image } = await c.req.json();
            if (!userId) {
                return c.json({ statusCode: 401, status: false, message: "Unauthorized", data: null }, 401);
            }
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return c.json({ statusCode: 404, status: false, message: "User not found", data: null }, 404);
            }
            await this.userService.updateProfile(userId, {
                first_name,
                last_name,
                email,
                phone_no,
                city,
                state,
                country,
                dob,
                gender,
                is_public,
                country_code,
                image,
            });

            return c.json({
                status: true,
                statusCode: 200,
                message: "Profile updated successfully",
                user: {
                    ...user,
                },
            });
        });


    }
}
