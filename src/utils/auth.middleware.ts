import { Context, Next } from "hono";
import { jwtVerify } from "jose";
import { UserService } from "@/services/user.service";

// Add these interfaces at the top
interface RateLimitInfo {
    count: number;
    lastReset: number;
}

interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Maximum requests allowed in the window
}

export class AuthMiddleware {
    private userService: UserService;
    private rateLimiter: Map<string, RateLimitInfo>;
    private rateLimitConfig: RateLimitConfig;

    constructor(
        userService: UserService,
        config: RateLimitConfig = { windowMs: 15 * 60 * 1000, maxRequests: 100 }
    ) {
        this.userService = userService;
        this.rateLimiter = new Map();
        this.rateLimitConfig = config;
    }

    private getRateLimitInfo(ip: string): RateLimitInfo {
        const now = Date.now();
        let info = this.rateLimiter.get(ip);

        if (!info || now - info.lastReset >= this.rateLimitConfig.windowMs) {
            info = { count: 0, lastReset: now };
        }

        return info;
    }

    async authenticate(c: Context, next: Next): Promise<Response | void> {
        // Rate limiting check
        const ip = c.req.header('x-forwarded-for') || 'unknown';
        const rateLimitInfo = this.getRateLimitInfo(ip);
        
        if (rateLimitInfo.count >= this.rateLimitConfig.maxRequests) {
            return c.json({ 
                error: "Too many requests", 
                retryAfter: Math.ceil((rateLimitInfo.lastReset + this.rateLimitConfig.windowMs - Date.now()) / 1000) 
            }, 429);
        }

        rateLimitInfo.count++;
        this.rateLimiter.set(ip, rateLimitInfo);

        // Retrieve the secret from the environment
        const secretKey = c.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET not found in environment variables");
            return c.json({ error: "Internal Server Error" }, 500);
        }

        const secret = new TextEncoder().encode(secretKey);

        // Extract the Authorization header
        const authHeader = c.req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const token = authHeader.split(" ")[1];

        try {
            // Decode and verify the JWT
            const { payload } = await jwtVerify(token, secret);

            if (!payload.sub || typeof payload.sub !== "string") {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const userId = parseInt(payload.sub);
            if (isNaN(userId)) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // Check if the user exists in the database
            const user = await this.userService.getUserById(userId);

            if (!user) {
                return c.json({ error: "Unauthorized: User not found" }, 401);
            }

            // Set `user_id` in the context for further use
            c.set("user_id", userId);

            // Proceed to the next middleware or route handler
            await next();
            return; // Explicitly return after calling `next()`
        } catch (error) {
            console.error("Error authenticating token:", error);
            return c.json({ error: "Unauthorized" }, 401);
        }
    }
}
