export const queriesRoutes = {
    "/queries": {
        post: {
            tags: ["Queries"],
            summary: "Create a new query",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["user_id"],
                            properties: {
                                event_id: { 
                                    type: "integer",
                                    description: "Optional event ID if query is related to an event"
                                },
                                question: { type: "string" },
                                description: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Query created successfully",
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
                "400": { description: "Invalid input" }
            }
        }
    },

    "/queries/{id}": {
        get: {
            tags: ["Queries"],
            summary: "Get query by ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                "200": {
                    description: "Query fetched successfully",
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
                "404": { description: "Query not found" }
            }
        }
    },

    "/queries/event/{eventId}": {
        get: {
            tags: ["Queries"],
            summary: "Get queries by event ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "eventId",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                "200": {
                    description: "Queries fetched successfully",
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
                }
            }
        }
    },

    "/queries/{id}/mark-as-faq": {
        post: {
            tags: ["Queries"],
            summary: "Mark a query as FAQ",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                "200": {
                    description: "Query marked as FAQ successfully",
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
                "404": { description: "Query not found" }
            }
        }
    }
}; 