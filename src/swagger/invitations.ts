export const invitationsRoutes = {
    "/invitations/send": {
        post: {
            tags: ["Invitations"],
            summary: "Send an invitation to join organization or event",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "message", "role_id", "modules"],
                            properties: {
                                email: { 
                                    type: "string",
                                    format: "email",
                                    description: "Email of the invitee"
                                },
                                message: { 
                                    type: "string",
                                    description: "Invitation message"
                                },
                                role_id: { 
                                    type: "integer",
                                    description: "Role ID to be assigned"
                                },
                                modules: { 
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Modules to be assigned"
                                },
                                event_id: { 
                                    type: "integer",
                                    description: "Optional event ID if invitation is for an event"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Invitation sent successfully",
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
                "400": { description: "Invalid input or missing fields" },
                "500": { description: "Server error" }
            }
        }
    },

    "/invitations": {
        get: {
            tags: ["Invitations"],
            summary: "Get all invitations with pagination",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: { type: "integer", default: 1 },
                    description: "Page number"
                },
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 },
                    description: "Items per page"
                },
                {
                    name: "event_id",
                    in: "query",
                    schema: { type: "integer" },
                    description: "Optional event ID to filter invitations"
                }
            ],
            responses: {
                "200": {
                    description: "Invitations fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            invitations: {
                                                type: "array",
                                                items: { type: "object" }
                                            },
                                            pagination: {
                                                type: "object",
                                                properties: {
                                                    total: { type: "integer" },
                                                    page: { type: "integer" },
                                                    limit: { type: "integer" },
                                                    totalPages: { type: "integer" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": { description: "Invalid event_id" },
                "500": { description: "Server error" }
            }
        }
    },

    "/invitation/{id}": {
        put: {
            tags: ["Invitations"],
            summary: "Update an invitation",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "Invitation ID"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                status: { type: "string" },
                                message: { type: "string" },
                                role_id: { type: "integer" },
                                modules: { 
                                    type: "array",
                                    items: { type: "string" }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Invitation updated successfully",
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
                "404": { description: "Invitation not found" },
                "500": { description: "Server error" }
            }
        }
    },

    "/validate-invitation/{link_id}": {
        get: {
            tags: ["Invitations"],
            summary: "Validate invitation link and get details",
            parameters: [
                {
                    name: "link_id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "Invitation link ID"
                }
            ],
            responses: {
                "200": {
                    description: "Invitation validated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    access_token: { type: "string" },
                                    refresh_token: { type: "string" },
                                    message: { type: "string" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            invitation: { type: "object" },
                                            user: { type: "object" }
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
    }
}; 