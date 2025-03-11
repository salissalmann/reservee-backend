export const categoriesRoutes = {
    "/create-category": {
        post: {
            tags: ["Categories"],
            summary: "Create a new category",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "description", "logo"],
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                logo: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Category created successfully",
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
                "409": { description: "Category name already exists" },
                "500": { description: "Server error" }
            }
        }
    },

    "/update-category/{categoryId}": {
        put: {
            tags: ["Categories"],
            summary: "Update an existing category",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "categoryId",
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
                            required: ["name", "description", "logo"],
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                logo: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": { description: "Category updated successfully" },
                "400": { description: "Invalid input" },
                "500": { description: "Server error" }
            }
        }
    },

    "/get-categories": {
        get: {
            tags: ["Categories"],
            summary: "Get all categories",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": {
                    description: "Categories fetched successfully",
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

    "/mark-category-as-published/{category_id}": {
        put: {
            tags: ["Categories"],
            summary: "Mark category as published",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "category_id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                "200": { description: "Category marked as published successfully" },
                "500": { description: "Server error" }
            }
        }
    },

    "/get-published-categories": {
        get: {
            tags: ["Categories"],
            summary: "Get all published categories",
            responses: {
                "200": {
                    description: "Published categories fetched successfully",
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
    }
}; 