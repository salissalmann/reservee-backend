export const faqRoutes = {
    "/faq": {
        post: {
            tags: ["FAQ"],
            summary: "Create a new FAQ",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["question", "answer"],
                            properties: {
                                question: { 
                                    type: "string",
                                    description: "FAQ question"
                                },
                                answer: { 
                                    type: "string",
                                    description: "FAQ answer"
                                },
                                status: { 
                                    type: "string",
                                    description: "Status of the FAQ",
                                    enum: ["active", "inactive"]
                                },
                                event_id: { 
                                    type: "integer",
                                    description: "Optional event ID if FAQ is related to an event"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "FAQ created successfully",
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
                "400": { 
                    description: "Missing required fields",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "null" },
                                    error: { type: "string" }
                                }
                            }
                        }
                    }
                },
                "500": { description: "Server error" }
            }
        },
        get: {
            tags: ["FAQ"],
            summary: "Get all FAQs",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "event_id",
                    in: "query",
                    schema: { type: "integer" },
                    description: "Optional event ID to filter FAQs"
                }
            ],
            responses: {
                "200": {
                    description: "FAQs fetched successfully",
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
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                question: { type: "string" },
                                                answer: { type: "string" },
                                                status: { type: "string" },
                                                event_id: { type: "integer" },
                                                created_at: { type: "string" },
                                                updated_at: { type: "string" }
                                            }
                                        }
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

    "/faq/{id}": {
        put: {
            tags: ["FAQ"],
            summary: "Update an existing FAQ",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "FAQ ID"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                answer: { type: "string" },
                                status: { 
                                    type: "string",
                                    enum: ["active", "inactive"]
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "FAQ updated successfully",
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
                "404": { description: "FAQ not found" },
                "500": { description: "Server error" }
            }
        },
        delete: {
            tags: ["FAQ"],
            summary: "Delete an FAQ",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "FAQ ID"
                }
            ],
            responses: {
                "200": {
                    description: "FAQ deleted successfully",
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
                "404": { description: "FAQ not found" },
                "500": { description: "Server error" }
            }
        }
    }
}; 