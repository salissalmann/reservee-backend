export const refundsRoutes = {
    "/refunds/request-refund": {
        post: {
            summary: "Request a refund",
            description: "Submit a refund request for an order",
            tags: ["Refunds"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["order_id", "reason", "refund_amount", "event_id"],
                            properties: {
                                order_id: {
                                    type: "integer",
                                    description: "ID of the order to be refunded"
                                },
                                reason: {
                                    type: "string",
                                    description: "Reason for requesting the refund"
                                },
                                refund_amount: {
                                    type: "number",
                                    description: "Amount to be refunded"
                                },
                                event_id: {
                                    type: "integer",
                                    description: "ID of the event associated with the order"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Refund request submitted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "object" },
                                    statusCode: { type: "integer" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Server error while processing refund request"
                }
            }
        }
    },
    "/refunds/change-refund-status/{refund_id}": {
        put: {
            summary: "Change refund status",
            description: "Update the status of a refund request",
            tags: ["Refunds"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "refund_id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "ID of the refund to update"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["status"],
                            properties: {
                                status: {
                                    type: "string",
                                    description: "New status for the refund"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Refund status updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "object" },
                                    statusCode: { type: "integer" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Server error while updating refund status"
                }
            }
        }
    },
    "/refunds/{event_id}": {
        get: {
            summary: "Get refunds by event",
            description: "Retrieve all refunds for a specific event",
            tags: ["Refunds"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "event_id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "ID of the event to get refunds for"
                }
            ],
            responses: {
                "200": {
                    description: "Refunds retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { 
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                order_id: { type: "integer" },
                                                reason: { type: "string" },
                                                status: { type: "string" },
                                                amount: { type: "number" }
                                            }
                                        }
                                    },
                                    statusCode: { type: "integer" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Server error while fetching refunds"
                }
            }
        }
    }
}; 