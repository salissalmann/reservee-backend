import { eventTable } from "@/schemas/events.schema";
import { wishlistTable } from "@/schemas/wishlist.schema";
import { eq, inArray } from "drizzle-orm";
export class WishlistService {
    private db: any; // Replace with your actual DB type

    constructor(db: any) {
        this.db = db;
    }


    async addToWishlist(userId: number, eventId: number) {
        try {
            // Check if user already has a wishlist
            const existingWishlist = await this.db
                .select()
                .from(wishlistTable)
                .where(eq(wishlistTable.user_id, userId))
                .limit(1)
                .execute();

            if (existingWishlist && existingWishlist.length > 0) {
                // Check if event is already in wishlist
                if (existingWishlist[0].event_ids && existingWishlist[0].event_ids.includes(eventId)) {
                    //remove the event from wishlist
                    const updatedEventIds = existingWishlist[0].event_ids.filter((id: any) => id !== eventId);
                    await this.db
                    .update(wishlistTable)
                    .set({ event_ids: updatedEventIds })
                    .where(eq(wishlistTable.user_id, userId))
                    .returning()
                    .execute();
                    return {
                        status: true,
                        statusCode: 200,
                        message: "Event removed from wishlist successfully",
                        data: updatedEventIds,
                        error: null
                    };
                }

                // Add event to existing wishlist
                const updatedEventIds = existingWishlist[0].event_ids ? [...existingWishlist[0].event_ids, eventId] : [eventId];
                
                const result = await this.db
                    .update(wishlistTable)
                    .set({ event_ids: updatedEventIds })
                    .where(eq(wishlistTable.user_id, userId))
                    .returning()
                    .execute();

                return {
                    status: true,
                    statusCode: 200,
                    message: "Event added to wishlist successfully",
                    data: updatedEventIds,
                    error: null
                };
            } else {
                // Create new wishlist for user
                const result = await this.db
                    .insert(wishlistTable)
                    .values({
                        user_id: userId,
                        event_ids: [eventId]
                    })
                    .returning()
                    .execute();

                return {
                    status: true,
                    statusCode: 201,
                    message: "Wishlist created successfully",
                    data: result[0],
                    error: null
                };
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            return {
                status: false,
                statusCode: 500,
                message: "Failed to add to wishlist",
                data: null,
                error: "Internal server error"
            };
        }
    }

    async getWishlist(userId: number) {
        try {
            // Get the wishlist for the user using standard SQL queries
            const wishlist = await this.db
                .select()
                .from(wishlistTable)
                .where(eq(wishlistTable.user_id, userId))
                .limit(1)
                .execute();
    
            if (!wishlist || wishlist.length === 0) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Wishlist not found",
                    data: null,
                    error: "Wishlist not found"
                };
            }
    
            // If there are no event IDs in the wishlist, return an empty array
            if (!wishlist[0].event_ids || wishlist[0].event_ids.length === 0) {
                return {
                    status: true,
                    statusCode: 200,
                    message: "Wishlist is empty",
                    data: [],
                    error: null
                };
            }
    
            // Get events from the event table
            // Using the in() operator to find all events with IDs in the array
            const events = await this.db
                .select()
                .from(eventTable)
                .where(inArray(eventTable.id, wishlist[0].event_ids))
                .execute();
    
            return {
                status: true,
                statusCode: 200,
                message: "Wishlist retrieved successfully",
                data: events,
                error: null
            };
        } catch (error) {
            console.error("Error getting wishlist:", error);
            return {
                status: false,
                statusCode: 500,
                message: "Failed to get wishlist",
                data: null,
                error: "Internal server error"
            };
        }
    }
   
}