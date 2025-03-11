export const otpRoutes = {
    "/otp/send-otp": {
        post: {
            tags: ["OTP"],
            summary: "Send OTP to email",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "name"],
                            properties: {
                                email: { 
                                    type: "string",
                                    format: "email",
                                    description: "Email address to send OTP to"
                                },
                                name: { 
                                    type: "string",
                                    description: "Name of the recipient"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "OTP sent successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "null" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Invalid input",
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
                "500": {
                    description: "Server error",
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
                }
            }
        }
    }
}; 