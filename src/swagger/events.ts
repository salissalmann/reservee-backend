export const eventsRoutes = {
    "/create-event/{org_id}": {
        post: {
            tags: ["Events"],
            summary: "Create a new event",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "org_id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "event_title",
                                "event_type",
                                "date_times",
                                "price_starting_range",
                                "price_ending_range",
                                "currency"
                            ],
                            properties: {
                                event_title: { type: "string" },
                                event_type: { type: "string" },
                                date_times: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            date: { type: "string" },
                                            stime: { type: "string" },
                                            etime: { type: "string" }
                                        }
                                    }
                                },
                                price_starting_range: { type: "number" },
                                price_ending_range: { type: "number" },
                                currency: { type: "string" },
                                venue_name: { type: "string" },
                                venue_address: { type: "string" },
                                venue_coords: { type: "object" },
                                venue_config: { type: "object" },
                                event_desc: { type: "string" },
                                event_tags: { type: "array" },
                                images: { type: "array" },
                                video: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Event created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "object" }
                                }
                            }
                        }
                    }
                },
                "400": { description: "Invalid input" },
                "500": { description: "Server error" }
            }
        }
    },

    "/add-seat-map/{event_id}": {
        put: {
            tags: ["Events"],
            summary: "Add seat map to event",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "event_id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                seatmap: { type: "object" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": { description: "Seat map added successfully" },
                "500": { description: "Server error" }
            }
        }
    },

    "/delete-seat-map/{event_id}": {
        delete: {
            tags: ["Events"],
            summary: "Delete seat map from event",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "event_id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                "200": { description: "Seat map deleted successfully" },
                "500": { description: "Server error" }
            }
        }
    },

    "/get-recently-created-events": {
        get: {
            tags: ["Events"],
            summary: "Get recently created events",
            responses: {
                "200": {
                    description: "Events fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { 
                                        type: "array",
                                        items: { type: "object" }
                                    }
                                }
                            }
                        }
                    }
                },
                "500": { description: "Server error" }
            }
        }
    },

    "/get-event-analytics/{event_id}": {
        get: {
            tags: ["Events"],
            summary: "Get event analytics",
            parameters: [
                {
                    name: "event_id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                "200": {
                    description: "Analytics fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "object" }
                                }
                            }
                        }
                    }
                },
                "500": { description: "Server error" }
            }
        }
    }
};
