export const consumerRoutes = {
    "/auth/consumer/sign-up": {
        post: {
            tags: ["Consumer"],
            summary: "Register a new consumer",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "first_name",
                                "last_name",
                                "email",
                                "password",
                                "phone_no",
                                "country_code",
                                "otp"
                            ],
                            properties: {
                                first_name: { type: "string" },
                                last_name: { type: "string" },
                                email: { type: "string", format: "email" },
                                password: { type: "string" },
                                phone_no: { type: "string" },
                                country_code: { type: "string" },
                                otp: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Consumer registered successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    statusCode: { type: "integer" },
                                    status: { type: "boolean" },
                                    message: { type: "string" },
                                    data: { type: "object" },
                                    access_token: { type: "string" },
                                    refresh_token: { type: "string" }
                                }
                            }
                        }
                    }
                },
                "400": { description: "Missing required fields" },
                "409": { description: "Email or phone number already in use" }
            }
        }
    },

    "/users/onboard": {
        put: {
            tags: ["Consumer"],
            summary: "Update consumer profile during onboarding",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                first_name: { type: "string" },
                                last_name: { type: "string" },
                                phone_no: { type: "string" },
                                country_code: { type: "string" },
                                image: { type: "string" },
                                city: { type: "string" },
                                state: { type: "string" },
                                country: { type: "string" },
                                dob: { type: "string" },
                                gender: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": { description: "Profile updated successfully" },
                "400": { description: "Invalid input" },
                "401": { description: "Unauthorized" },
                "500": { description: "Server error" }
            }
        }
    }
}; 