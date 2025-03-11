import { Context, Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { AuthMiddleware } from "@/utils/auth.middleware";
import { WishlistService } from "@/services/wishlist.service";
// Create the controller similar to NotificationsController
export class WishlistController {
    private wishlistService: WishlistService;
    private authMiddleware: AuthMiddleware;

    constructor(wishlistService: WishlistService, authMiddleware: AuthMiddleware) {
        this.wishlistService = wishlistService;
        this.authMiddleware = authMiddleware;
    }

    registerRoutes(app: Hono) {
        // Add to wishlist
        app.post("/wishlist/add/:event_id", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const eventId = parseInt(c.req.param("event_id"));
                const userId = c.get("user_id");

                const result = await this.wishlistService.addToWishlist(userId, eventId);
                
                return c.json({
                    statusCode: result.statusCode,
                    status: result.status,
                    message: result.message,
                    data: result.data,
                    error: result.error,
                }, result.statusCode as StatusCode);
            } catch (error) {
                console.error("Error adding to wishlist:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to add to wishlist",
                    data: null,
                    error: "Internal server error while adding to wishlist",
                }, 500 as StatusCode);
            }
        });


        // Get user's wishlist
        app.get("/wishlist", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const userId = c.get("user_id");
                const result = await this.wishlistService.getWishlist(userId);
                
                return c.json({
                    statusCode: result.statusCode,
                    status: result.status,
                    message: result.message,
                    data: result.data,
                    error: result.error,
                }, result.statusCode as StatusCode);
            } catch (error) {
                console.error("Error getting wishlist:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to get wishlist",
                    data: null,
                    error: "Internal server error while getting wishlist",
                }, 500 as StatusCode);
            }
        });
    }
}