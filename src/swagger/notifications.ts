export const notificationsRoutes = {
    "/create-notification": {
        post: {
            tags: ["Notifications"],
            summary: "Create a new notification",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["title", "message", "type"],
                            properties: {
                                title: { 
                                    type: "string",
                                    description: "Title of the notification"
                                },
                                message: { 
                                    type: "string",
                                    description: "Notification message content"
                                },
                                type: { 
                                    type: "string",
                                    description: "Type of notification"
                                },
                                metadata: { 
                                    type: "object",
                                    description: "Additional metadata for the notification"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Notification created successfully",
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

    "/get-notifications/{role}": {
        get: {
            tags: ["Notifications"],
            summary: "Get all notifications for a user by role",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "role",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "User role to filter notifications"
                }
            ],
            responses: {
                "200": {
                    description: "Notifications fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                title: { type: "string" },
                                                message: { type: "string" },
                                                type: { type: "string" },
                                                is_read: { type: "boolean" },
                                                created_at: { type: "string" },
                                                metadata: { type: "object" }
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

    "/mark-notification-as-read/{notification_id}": {
        post: {
            tags: ["Notifications"],
            summary: "Mark a specific notification as read",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "notification_id",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "ID of the notification to mark as read"
                }
            ],
            responses: {
                "200": {
                    description: "Notification marked as read successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    data: { type: "object" }
                                }
                            }
                        }
                    }
                },
                "404": { description: "Notification not found" },
                "500": { description: "Server error" }
            }
        }
    },

    "/mark-all-notifications-as-read": {
        post: {
            tags: ["Notifications"],
            summary: "Mark all notifications as read for the authenticated user",
            security: [{ bearerAuth: [] }],
            responses: {
                "200": {
                    description: "All notifications marked as read successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    data: { 
                                        type: "object",
                                        description: "Result of the operation"
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