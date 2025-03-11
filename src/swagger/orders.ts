export const ordersRoutes = {
    "/orders/create-checkout-session": {
        post: {
            tags: ["Orders"],
            summary: "Create a Stripe checkout session",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["orderId", "successUrl", "cancelUrl"],
                            properties: {
                                orderId: { type: "integer" },
                                successUrl: { type: "string" },
                                cancelUrl: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Checkout session created successfully",
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
                "400": { description: "Invalid input or order not found" },
                "500": { description: "Server error" }
            }
        }
    },

    "/webhooks/process-ticket-order": {
        post: {
            tags: ["Orders"],
            summary: "Process ticket order webhook",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["orderId", "items", "userId", "eventId"],
                            properties: {
                                orderId: { type: "integer" },
                                items: { type: "array" },
                                userId: { type: "integer" },
                                eventId: { type: "integer" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": { description: "Order processed successfully" },
                "401": { description: "Invalid signature" },
                "500": { description: "Processing error" }
            }
        }
    },

    "/webhooks/process-seatmap-order": {
        post: {
            tags: ["Orders"],
            summary: "Process seatmap order webhook",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["orderId", "items", "userId", "eventId"],
                            properties: {
                                orderId: { type: "integer" },
                                items: { type: "array" },
                                userId: { type: "integer" },
                                eventId: { type: "integer" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": { description: "Seatmap order processed successfully" },
                "401": { description: "Invalid signature" },
                "500": { description: "Processing error" }
            }
        }
    }
}; 