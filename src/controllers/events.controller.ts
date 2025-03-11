import { EventService } from "@/services/events.service";
import { AuthMiddleware } from "@/utils/auth.middleware";
import { Context, Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";

export class EventController {
    private eventService: EventService;
    private authMiddleware: AuthMiddleware;

    constructor(eventService: EventService, authMiddleware: AuthMiddleware) {
        this.eventService = eventService;
        this.authMiddleware = authMiddleware;
    }

    registerRoutes(app: Hono) {

        app.post(
            "/create-event/:org_id",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const org_id = parseInt(c.req.param("org_id"), 10);
                    const user_id = c.get("user_id");
                    if (!org_id || !user_id) {
                        return c.json({
                            statusCode: 400,
                            status: false,
                            message: "Invalid organization ID or user authentication failed.",
                            data: null,
                            error: "Invalid organization ID or user authentication failed.",
                        }, 400);
                    }

                    const {
                        event_title,
                        event_type,
                        date_times,
                        price_starting_range,
                        price_ending_range,
                        currency,
                        event_desc,
                        event_tags,
                        images,
                        video,
                    } = await c.req.json();

                    // Validate required fields
                    if (
                        !event_title ||
                        !event_type ||
                        !date_times ||
                        !price_starting_range ||
                        !price_ending_range ||
                        !currency
                    ) {
                        return c.json({
                            statusCode: 400,
                            status: false,
                            message: "Missing required fields.",
                            data: null,
                            error: "Missing required fields: event_title, event_type, date_times, price_starting_range, price_ending_range, currency",
                        }, 400);
                    }

                    // Validate `date_times` structure
                    if (
                        !Array.isArray(date_times) ||
                        !date_times.every(
                            (dt) => typeof dt.date === "string" && typeof dt.stime === "string" && typeof dt.etime === "string"
                        )
                    ) {
                        return c.json({
                            statusCode: 400,
                            status: false,
                            message: "Invalid date_times format.",
                            data: null,
                            error: "Invalid date_times format.",
                        }, 400);
                    }


                    // Pass all fields, optional ones will be handled as undefined
                    const event = await this.eventService.createEvent(
                        event_title,
                        event_type,
                        date_times,
                        price_starting_range,
                        price_ending_range,
                        currency,
                        org_id,
                        user_id,
                        user_id, // `created_by` and `updated_by`
                        event_desc,
                        event_tags,
                        images,
                        video
                    );

                    // Normal event creation response
                    return c.json({
                        statusCode: 201,
                        status: true,
                        message: "Event created successfully.",
                        data: event.data.event,
                    }, 201);
                } catch (error) {
                    console.error("Error creating event:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to create event.",
                        data: null,
                        error: "Internal server error while creating event.",
                    }, 500);
                }
            }
        );

        app.get("/get-event-by-id/:event_id", async (c) => {
            try {
                const event_id = parseInt(c.req.param("event_id"));

                const event = await this.eventService.getEventById(event_id);
                if (!event) {
                    return c.json({
                        statusCode: 404,
                        status: false,
                        message: "Event not found.",
                        data: null,
                        error: "Event not found.",
                    }, 404);
                }

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Event fetched successfully.",
                    data: event.data,
                }, 200);
            } catch (error) {
                console.error("Error fetching event:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to fetch event.",
                    data: null,
                    error: "Internal server error while fetching event.",
                }, 500);
            }
        });

        app.put(
            "/update-event/:event_id",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const user_id = parseInt(c.get("user_id"), 10);
                    if (isNaN(user_id)) {
                        return c.json({
                            statusCode: 400,
                            status: false,
                            message: "User authentication failed.",
                            data: null,
                            error: "User ID is invalid or missing.",
                        }, 400);
                    }

                    const event_id = parseInt(c.req.param("event_id"), 10);
                    if (isNaN(event_id)) {
                        return c.json({
                            statusCode: 400,
                            status: false,
                            message: "Invalid event ID.",
                            data: null,
                            error: "Event ID must be a valid number.",
                        }, 400);
                    }

                    const updates = await c.req.json();

                    // Pass all three arguments: event_id, updates, and user_id
                    const updatedEvent = await this.eventService.updateEvent(event_id, updates, user_id);

                    if (!updatedEvent.status) {
                        return c.json({
                            statusCode: updatedEvent.status_code,
                            status: updatedEvent.status,
                            message: updatedEvent.message,
                            data: updatedEvent.data,
                        }, 400);
                    }

                    return c.json({
                        statusCode: 200,
                        status: true,
                        message: "Event updated successfully.",
                        data: updatedEvent.data,
                    }, 200);
                } catch (error) {
                    console.error("Error updating event:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to update event.",
                        data: null,
                        error: "Internal server error while updating event.",
                    }, 500);
                }
            }
        );

        app.put(
            "/mark-event-as-published/:event_id",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const event_id = parseInt(c.req.param("event_id"));

                    const updatedEvent = await this.eventService.markEventAsPublished(event_id);

                    return c.json({
                        statusCode: 200,
                        status: true,
                        message: "Event marked as published.",
                        data: updatedEvent.data,
                    }, 200);
                } catch (error) {
                    console.error("Error marking event as published:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to mark event as published.",
                        data: null,
                        error: "Internal server error while marking event as published.",
                    }, 500);
                }
            }
        );

        app.put(
            "/mark-event-as-featured/:event_id",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const event_id = parseInt(c.req.param("event_id"));

                    const updatedEvent = await this.eventService.markEventAsFeatured(event_id);

                    return c.json({
                        statusCode: 200,
                        status: true,
                        message: "Event marked as published.",
                        data: updatedEvent.data,
                    }, 200);
                } catch (error) {
                    console.error("Error marking event as published:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to mark event as published.",
                        data: null,
                        error: "Internal server error while marking event as published.",
                    }, 500);
                }
            }
        );

        app.get("/get-events-by-org-id/:org_id", async (c) => {
            try {
                const org_id = parseInt(c.req.param("org_id"));

                const events = await this.eventService.getEventsByOrgId(org_id);

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Events fetched successfully.",
                    data: events.data,
                }, 200);
            } catch (error) {
                console.error("Error fetching events by organization ID:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to fetch events.",
                    data: null,
                    error: "Internal server error while fetching events.",
                }, 500);
            }
        });

        app.get("/get-all-user-events",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                const user_id = c.get("user_id");
                const events = await this.eventService.getAllUserEvents(user_id);

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Events fetched successfully.",
                    data: events,
                }, 200);
            }
        )

        app.get(
            "/filter-user-events",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                const user_id = c.get("user_id");

                // Access query parameters using c.request.url.searchParams
                const {
                    title,
                    description,
                    price_start,
                    price_end,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                } = c.req.query()  // Oak uses searchParams for query params

                console.log('\n\n\n\nQuery params-------', title, description, price_start, price_end, start_date, end_date, start_time, end_time)

                // Convert to proper types if necessary
                const parsedPriceStart = price_start ? parseFloat(price_start) : undefined;
                const parsedPriceEnd = price_end ? parseFloat(price_end) : undefined;

                const events = await this.eventService.filterUserEvents({
                    user_id,
                    title,
                    description,
                    price_start: parsedPriceStart,
                    price_end: parsedPriceEnd,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                });

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Filtered events fetched successfully.",
                    data: events,
                });
            }
        );

        app.get("/get-all-featured-events",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                const user_id = c.get("user_id");
                const events = await this.eventService.getAllFeaturedEvents(user_id);

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Events fetched successfully.",
                    data: events,
                }, 200);
            }
        )


        app.get("/get-events-by-search-query", async (c) => {//-----
            let searchQuery = c.req.query("search");
            if (!searchQuery) {
                searchQuery = "";
            }
            const events = await this.eventService.getEventsBySearchQuery(searchQuery);

            return c.json({
                statusCode: 200,
                status: true,
                message: "Events fetched successfully.",
                data: events,
            }, 200);
        })

        //get upcoming events
        app.get("/get-upcoming-events", async (c) => {
            try {
                const eventType = c.req.query("type");
                const category = c.req.query("category");

                const events = await this.eventService.getUpcomingEvents(eventType, category);

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Events fetched successfully.",
                    data: events,
                }, 200);
            } catch (error) {
                console.error("Error fetching upcoming events:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to fetch upcoming events.",
                    data: null,
                    error: "Internal server error while fetching upcoming events.",
                }, 500);
            }
        })


        //get all events
        app.get("/get-all-events", async (c) => {
            try {
                const events = await this.eventService.getAllEvents();
                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Events fetched successfully.",
                    data: events,
                }, 200);
            } catch (error) {
                console.error("Error fetching all events:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to fetch all events.",
                    data: null,
                    error: "Internal server error while fetching all events.",
                }, 500);
            }
        })

        app.get("/get-recently-created-events", async (c) => {
            try {
                const events = await this.eventService.getRecentlyCreatedEvents();
                return c.json({
                    statusCode: 200,
                status: true,
                message: "Events fetched successfully.",
                    data: events,
                }, 200);
            } catch (error) {
                console.error("Error fetching recently created events:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to fetch recently created events.",
                    data: null,
                    error: "Internal server error while fetching recently created events.",
                }, 500);
            }
        })

     }
}
