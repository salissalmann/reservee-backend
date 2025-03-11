export const ticketsRoutes = {
    "/tickets": {
        post: {
            tags: ["Tickets"],
            summary: "Create a new ticket",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "description", "event_id", "org_id"],
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                seating_plan: { type: "object" },
                                event_id: { type: "integer" },
                                org_id: { type: "integer" },
                                quantity: { type: "integer" },
                                price: { type: "number" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Ticket created successfully",
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
                "400": { description: "Invalid input or missing required fields" },
                "500": { description: "Server error" }
            }
        }
    },

    "/tickets/multiple": {
        post: {
            tags: ["Tickets"],
            summary: "Create multiple tickets",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["tickets", "event_id", "org_id"],
                            properties: {
                                tickets: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            description: { type: "string" },
                                            quantity: { type: "integer" },
                                            price: { type: "number" }
                                        }
                                    }
                                },
                                event_id: { type: "integer" },
                                org_id: { type: "integer" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Tickets added successfully",
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
                "400": { description: "Invalid input" },
                "500": { description: "Server error" }
            }
        }
    }
}; 