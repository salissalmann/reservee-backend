import { ExecutionContext, Hono } from "hono";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { OtpService } from "./services/otp.service";
import { OtpController } from "./controllers/otp.controller";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { OrganizationService } from "./services/organizations.service";
import { OrganizationController } from "./controllers/organizations.controller";
import { AuthMiddleware } from "./utils/auth.middleware"; // Import AuthMiddleware
import { EventService } from "./services/events.service";
import { EventController } from "./controllers/events.controller";
import { cors } from "hono/cors";
import { NotificationsService } from "./services/notifications.service";
import { NotificationsController } from "./controllers/notifications.controller";
import { swaggerUI } from '@hono/swagger-ui'
import { swaggerConfig } from './swagger/config'
import { WishlistService } from "./services/wishlist.service";
import { WishlistController } from "./controllers/wishlist.controller"; 

// Define Env interface
interface Env {
    DATABASE_URL: string; // Add any other required environment variables here
}

// Function to create a database connection
export function createDbConnection(env: Env) {
    // Use the Neon connection string from the `env` object
    const connection = neon(env.DATABASE_URL);
    return drizzle(connection); // Create and return Drizzle instance
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const app = new Hono();

        app.use(
            "*",
            cors({
                origin: "*",
                credentials: true,
            })
        );

        // Mount Swagger UI
        app.use('/swagger', swaggerUI({ url: '/swagger.json' }));
        app.get('/swagger.json', (c) => c.json(swaggerConfig));

        const db = createDbConnection(env);

        // Initialize services
        const otpService = new OtpService(db);
        const userService = new UserService(db);
        const orgService = new OrganizationService(db); // Initialize OrganizationService
        const eventService = new EventService(db);
        const notificationsService = new NotificationsService(db);
        const wishlistService = new WishlistService(db);
        // Initialize middleware
        const authMiddleware = new AuthMiddleware(userService);

        // Initialize controllers
        const otpController = new OtpController(otpService);
        const userController = new UserController(userService, otpService, authMiddleware);
        const orgController = new OrganizationController(orgService, authMiddleware); // Pass AuthMiddleware
        const eventController = new EventController(eventService, authMiddleware);
        const notificationsController = new NotificationsController(notificationsService, authMiddleware);
        const wishlistController = new WishlistController(wishlistService, authMiddleware);
        // Register routes
        otpController.registerRoutes(app);
        userController.registerRoutes(app);
        orgController.registerRoutes(app); // Register organization routes
        eventController.registerRoutes(app);
        notificationsController.registerRoutes(app);
        wishlistController.registerRoutes(app);
        //log every request
        app.use("*", (c, next) => {
            console.log(`${c.req.method} ${c.req.url}`);
            return next();
        });

        return app.fetch(request, env, ctx);
    },
};
