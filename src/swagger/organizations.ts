export const organizationsRoutes = {
    "/create-organization": {
        post: {
            tags: ["Organizations"],
            summary: "Create a new organization",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "description", "logo", "categories"],
                            properties: {
                                name: { 
                                    type: "string",
                                    description: "Organization name"
                                },
                                description: { 
                                    type: "string",
                                    description: "Organization description"
                                },
                                logo: { 
                                    type: "string",
                                    description: "URL or base64 of organization logo"
                                },
                                categories: { 
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Categories the organization belongs to"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Organization created successfully",
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
                "400": { description: "Missing required fields" },
                "409": { description: "Organization name already exists" },
                "500": { description: "Server error" }
            }
        }
    },

    "/get-vendor-organization": {
        get: {
            tags: ["Organizations"],
            summary: "Get organizations created by the authenticated user",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": {
                    description: "Organizations fetched successfully",
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
                                                name: { type: "string" },
                                                description: { type: "string" },
                                                logo: { type: "string" },
                                                categories: { 
                                                    type: "array",
                                                    items: { type: "string" }
                                                }
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

    "/get-all-vendor-organizations": {
        get: {
            tags: ["Organizations"],
            summary: "Get all organizations accessible to the authenticated user",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": {
                    description: "Organizations fetched successfully",
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
                                                name: { type: "string" },
                                                description: { type: "string" },
                                                logo: { type: "string" },
                                                categories: { 
                                                    type: "array",
                                                    items: { type: "string" }
                                                }
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

    "/update-organization/{orgId}": {
        put: {
            tags: ["Organizations"],
            summary: "Update an organization",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "orgId",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "ID of the organization to update"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "description", "logo", "categories"],
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                logo: { type: "string" },
                                categories: { 
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
                    description: "Organization updated successfully",
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
                "400": { description: "Missing required fields" },
                "500": { description: "Server error" }
            }
        }
    },

    "/get-organization-by-id/{orgId}": {
        get: {
            tags: ["Organizations"],
            summary: "Get organization by ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "orgId",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "ID of the organization to retrieve"
                }
            ],
            responses: {
                "200": {
                    description: "Organization fetched successfully",
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
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            description: { type: "string" },
                                            logo: { type: "string" },
                                            categories: { 
                                                type: "array",
                                                items: { type: "string" }
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
    }
}; 