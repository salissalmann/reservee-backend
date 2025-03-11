import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { and, eq, or, gte, lte, like, sql, inArray, desc, gt } from "drizzle-orm";
import { eventTable } from "@/schemas/events.schema";
import { organizationsTable } from "@/schemas/organizations.schema";

export class EventService {
    private db: NeonHttpDatabase;

    constructor(db: NeonHttpDatabase) {
        this.db = db;
    }

    async createEvent(
        eventTitle: string,
        eventType: string,
        dateTimes: Array<{ date: string; stime: string; etime: string }>,
        priceStartingRange: string,
        priceEndingRange: string,
        currency: string,
        orgId: number,
        userId: number,
        createdBy: number,
        eventDesc?: string, // Optional
        eventTags?: object, // Optional
        images?: object, // Optional
        video?: string, // Optional
    ) {
        try {

            
            const preparedEventData = {
                event_title: eventTitle,
                event_type: eventType,
                date_times: JSON.stringify(dateTimes),
                price_starting_range: priceStartingRange,
                price_ending_range: priceEndingRange,
                currency,
                org_id: orgId,
                user_id: userId,
                is_published: false,
                created_at: new Date(),
                updated_at: new Date(),
                created_by: createdBy,
                updated_by: createdBy,
                event_desc: eventDesc ?? null, // Default to null if not provided
                event_tags: eventTags ?? null, // Default to null if not provided
                images: images ?? null, // Default to null if not provided
                video: video ?? null, // Default to null if not provided
                is_deleted: false, // Set to true for first event
            };

            const [event] = await this.db.insert(eventTable).values(preparedEventData).returning();

            return {
                status: true,
                statusCode: 201,
                message: "Event created successfully.",
                data: { event, is_first_event: false },
            };
        } catch (error) {
            console.error("Error creating event:", error);
            throw new Error("Failed to create event. Please try again.");
        }
    }

    async getEventById(eventId: number) {
        try {
            const [eventAndOrg] = await this.db
                .select({
                    event: eventTable,
                    organization_name: organizationsTable.name,
                })
                .from(eventTable)
                .innerJoin(organizationsTable, eq(eventTable.org_id, organizationsTable.id))
                .where(and(
                    eq(eventTable.id, eventId),
                    eq(eventTable.is_deleted, false)
                ))
                .limit(1);

            let eventTags: (string | number)[] = [];

            if (eventAndOrg.event.event_tags) {
                if (typeof eventAndOrg.event.event_tags === "string") {
                    try {
                        eventTags = JSON.parse(eventAndOrg.event.event_tags) as (string | number)[];
                    } catch (error) {
                        console.error("Failed to parse event_tags:", error);
                    }
                } else if (Array.isArray(eventAndOrg.event.event_tags)) {
                    eventTags = eventAndOrg.event.event_tags as (string | number)[];
                }
            }

            // Ensure only valid tags exist
            eventTags = eventTags.filter(tag => typeof tag === "string" || typeof tag === "number");

            if (!eventAndOrg) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Event not found.",
                    data: null,
                };
            }

            return {
                status: true,
                statusCode: 200,
                message: "Event retrieved successfully.",
                data: {
                    ...eventAndOrg.event,
                    organization_name: eventAndOrg.organization_name,
                },
            };
        } catch (error) {
            console.error("Error retrieving event:", error);
            throw new Error("Failed to retrieve event. Please try again.");
        }
    }

    async getEventDetailsById(eventId: number) {
        const event = await this.db.select().from(eventTable).where(eq(eventTable.id, eventId)).limit(1);
        return event[0] || null
    }

    async updateEvent(eventId: number, updates: Partial<Record<string, any>>, user_id: number) {
        try {
            // Ensure updates include the user_id as `updated_by`
            const updatePayload = {
                ...updates,
                updated_at: new Date(),
                updated_by: user_id,
            };

            // Perform the update
            const [updatedEvent] = await this.db
                .update(eventTable)
                .set(updatePayload)
                .where(eq(eventTable.id, eventId))
                .returning();

            // Handle case where no event was updated
            if (!updatedEvent) {
                return {
                    status: false,
                    status_code: 404,
                    message: "Event not found or update failed.",
                    data: null,
                };
            }

            // Return success response
            return {
                status: true,
                status_code: 200,
                message: "Event updated successfully.",
                data: updatedEvent,
            };
        } catch (error) {
            // Log detailed error for debugging
            console.error("Error updating event:", {
                eventId,
                updates,
                user_id,
                error,
            });

            // Return a generic error response
            throw new Error("Failed to update event. Please try again.");
        }
    }


    async markEventAsPublished(eventId: number) {
        try {
            const event = await this.db
                .select({ is_published: eventTable.is_published })
                .from(eventTable)
                .where(eq(eventTable.id, eventId))
                .limit(1);

            if (!event[0]) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Event not found.",
                    data: null,
                };
            }

            const newStatus = !event[0].is_published;

            const [updatedEvent] = await this.db
                .update(eventTable)
                .set({ is_published: newStatus, updated_at: new Date() })
                .where(eq(eventTable.id, eventId))
                .returning();

            if (!updatedEvent) {
                throw new Error("Failed to update the publish status of the event.");
            }

            return {
                status: true,
                statusCode: 200,
                message: `Event marked as ${newStatus ? "published" : "unpublished"}.`,
                data: updatedEvent,
            };
        } catch (error) {
            console.error("Error marking event as published:", error);
            throw new Error("Failed to update event publish status. Please try again.");
        }
    }

    async markEventAsFeatured(eventId: number) {
        try {
            const event = await this.db
                .select({ is_featured: eventTable.is_featured })
                .from(eventTable)
                .where(eq(eventTable.id, eventId))
                .limit(1);

            if (!event[0]) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Event not found.",
                    data: null,
                };
            }

            const newStatus = !event[0].is_featured;

            const [updatedEvent] = await this.db
                .update(eventTable)
                .set({ is_featured: newStatus, updated_at: new Date() })
                .where(eq(eventTable.id, eventId))
                .returning();

            if (!updatedEvent) {
                throw new Error("Failed to update the feature status of the event.");
            }

            return {
                status: true,
                statusCode: 200,
                message: `Event marked as ${newStatus ? "featured" : "unfeatured"}.`,
                data: updatedEvent,
            };
        } catch (error) {
            console.error("Error marking event as featured:", error);
            throw new Error("Failed to update event publish status. Please try again.");
        }
    }

    async getEventsByOrgId(orgId: number) {
        try {
            const events = await this.db
                .select()
                .from(eventTable)
                .where(and(
                    eq(eventTable.org_id, orgId),
                    eq(eventTable.is_deleted, false)
                ));

            if (!events.length) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "No events found for this organization.",
                    data: [],
                };
            }

            return {
                status: true,
                statusCode: 200,
                message: "Events retrieved successfully.",
                data: events,
            };
        } catch (error) {
            console.error("Error retrieving events by organization ID:", error);
            throw new Error("Failed to retrieve events. Please try again.");
        }
    }

    async updateEventDetails(eventId: number, updates: Partial<Record<string, any>>): Promise<any> {
        try {
            const [updatedEvent] = await this.db
                .update(eventTable)
                .set({
                    ...updates,
                    updated_at: new Date(),
                })
                .where(eq(eventTable.id, eventId))
                .returning();

            if (!updatedEvent) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Event not found or update failed.",
                    data: null,
                };
            }

            return {
                status: true,
                statusCode: 200,
                message: "Event details updated successfully.",
                data: updatedEvent,
            };
        } catch (error) {
            console.error("Error updating event details:", error);
            throw new Error("Failed to update event details. Please try again.");
        }
    }

    async getAllUserEvents(user_id: number) {
        try {
            const eventsAndOrgName = await this.db
                .select({
                    event: eventTable,
                    organization_name: organizationsTable.name,
                })
                .from(eventTable)
                .innerJoin(organizationsTable, eq(eventTable.org_id, organizationsTable.id))
                .where(and(
                    eq(eventTable.user_id, user_id),
                    eq(eventTable.is_deleted, false)
                ));

            //concat organization name to the event and return
            const eventsWithOrgName = eventsAndOrgName.map((event) => ({
                ...event.event,
                organization_name: event.organization_name,
            }));

            return eventsWithOrgName;
        } catch (error) {
            throw new Error("Failed to fetch events. Please try again.");
        }
    }

    async filterUserEvents({
        user_id,
        title,
        description,
        price_start,
        price_end,
        start_date,
        end_date,
        start_time,
        end_time,
    }: {
        user_id: number;
        title?: string;
        description?: string;
        price_start?: number;
        price_end?: number;
        start_date?: string;
        end_date?: string;
        start_time?: string;
        end_time?: string;
    }) {
        try {
            // Query for events with filters and organization name
            const eventsAndOrgName = await this.db
                .select({
                    event: eventTable,
                    organization_name: organizationsTable.name,
                })
                .from(eventTable)
                .innerJoin(organizationsTable, eq(eventTable.org_id, organizationsTable.id))
                .where(
                    and(
                        eq(eventTable.user_id, user_id), // User ID filter
                        eq(eventTable.is_deleted, false), // Not deleted
                        eq(eventTable.is_disabled, false), // Not disabled
                        or( // OR condition for title and description filters
                            title ? like(eventTable.event_title, `%${title}%`) : undefined,
                            description ? like(eventTable.event_desc, `%${description}%`) : undefined
                        ),
                        price_start !== undefined
                            ? gte(eventTable.price_starting_range, price_start.toString())
                            : undefined, // Price start filter (cast to string)
                        price_end !== undefined
                            ? lte(eventTable.price_ending_range, price_end.toString())
                            : undefined // Price end filter (cast to string)
                    )
                );

            // Merge event data and organization name into a single array
            const mergedEvents = eventsAndOrgName.map((event) => ({
                ...event.event, // Spread the event data
                organization_name: event.organization_name, // Add organization name
            }));

            return mergedEvents; // Return merged events array
        } catch (error) {
            console.error(error);
            throw new Error("Failed to filter events. Please try again.");
        }
    }

    async getAllFeaturedEvents(user_id: number) {
        try {
            const eventsAndOrgName = await this.db.select({
                event: eventTable,
                organization_name: organizationsTable.name,
            })
                .from(eventTable)
                .innerJoin(organizationsTable, eq(eventTable.org_id, organizationsTable.id))
                .where(
                    and(
                        eq(eventTable.user_id, user_id),
                        eq(eventTable.is_featured, true),
                        eq(eventTable.is_deleted, false),
                        eq(eventTable.is_disabled, false),
                    ));

            //concat organization name to the event and return
            const eventsWithOrgName = eventsAndOrgName.map((event) => ({
                ...event.event,
                organization_name: event.organization_name,
            }));

            return eventsWithOrgName;
        } catch (error) {
            throw new Error("Failed to fetch events. Please try again.");
        }
    }

    async getEventsBySearchQuery(searchQuery: string) {
        try {
            if (!searchQuery || searchQuery.trim().length === 0) {
                //return all events that are published, limit to 30
                const events = await this.db
                    .select()
                    .from(eventTable)
                    .where(and(
                        eq(eventTable.is_published, true),
                        eq(eventTable.is_deleted, false)
                    ))
                    .limit(30);
                return {
                    status: true,
                    statusCode: 200,
                    message: "Events retrieved successfully",
                    data: events
                };
            }

            const sanitizedQuery = searchQuery.replace(/[%_]/g, '\\$&');

            const events = await this.db
                .select()
                .from(eventTable)
                .where(and(
                    like(sql`LOWER(${eventTable.event_title})`, `%${sanitizedQuery.toLowerCase()}%`),
                    eq(eventTable.is_deleted, false)
                ));

            return {
                status: true,
                statusCode: 200,
                message: events.length > 0
                    ? "Events retrieved successfully"
                    : "No events found matching the search criteria",
                data: events
            };

        } catch (error) {
            console.error("Error searching events:", error);
            throw new Error("Failed to fetch events. Please try again.");
        }
    }

    async getUpcomingEvents(eventType?: string, category?: string) {
        try {
            const events = await this.db
                .select()
                .from(eventTable)
                .where(
                    and(
                        eq(eventTable.is_published, true),
                        eq(eventTable.is_deleted, false),
                        category
                            ? sql`
                                (${eventTable.event_tags}::jsonb @> ${JSON.stringify([category])}
                                OR ${eventTable.event_tags}::jsonb @> ${JSON.stringify([parseFloat(category)])}
                                OR EXISTS (
                                    SELECT 1
                                    FROM jsonb_array_elements(${eventTable.event_tags}::jsonb) AS tag
                                    WHERE tag::text LIKE ${`%${category}%`}
                                    OR tag::text LIKE ${`%${parseFloat(category)}%`}
                                ))`
                            : undefined,
                        eventType
                            ? eq(eventTable.event_type, eventType)
                            : undefined
                    )
                );

            const upcomingEvents = events.filter(event => {
                const dateTimes = Array.isArray(event.date_times)
                    ? event.date_times
                    : (typeof event.date_times === 'string'
                        ? JSON.parse(event.date_times)
                        : event.date_times);

                return dateTimes.some((dt: { date: string }) => {
                    return new Date(dt.date) > new Date();
                });
            });

            return upcomingEvents;
        } catch (error) {
            console.error("Error fetching upcoming events:", error);
            throw new Error("Failed to fetch events. Please try again.");
        }
    }

    async getAllEvents() {
        try {
            const events = await this.db
                .select({
                    event: eventTable,
                    organization_name: organizationsTable.name,
                })
                .from(eventTable)
                .innerJoin(organizationsTable, eq(eventTable.org_id, organizationsTable.id))
                .where(eq(eventTable.is_deleted, false));

            return events;
        } catch (error) {
            console.error("Error fetching all events:", error);
            throw new Error("Failed to fetch events. Please try again.");
        }
    }

    async getRecentlyCreatedEvents() {
        try {
            const events = await this.db
                .select()
                .from(eventTable)
                .where(and(
                    eq(eventTable.is_published, true),
                    eq(eventTable.is_deleted, false)
                ))
                .orderBy(desc(eventTable.created_at))
                .limit(4);
            return events;
        } catch (error) {
            console.error("Error fetching recently created events:", error);
            throw new Error("Failed to fetch events. Please try again.");
        }
    }

}
