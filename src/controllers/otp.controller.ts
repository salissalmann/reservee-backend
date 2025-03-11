import { OtpService } from "../services/otp.service";
import { Context, Hono } from "hono";

export class OtpController {
    private otpService: OtpService;

    constructor(otpService: OtpService) {
        this.otpService = otpService;
    }

    registerRoutes(app: Hono) {
        app.post("/otp/send-otp", async (c: Context) => {
            try {
                // Parse request body
                const { email, name } = await c.req.json();
                if (!email || !name) {
                    return c.json({
                        statusCode: 400,
                        status: false,
                        message: "Email and name are required",
                        data: null,
                        error: "Email and name are required"
                    }, 400);
                }

                // Generate OTP
                await this.otpService.sendEmailOtp(name, email, false, c.env.SENDGRID_API_KEY);

                // Here, you can also send the OTP via email (integrate SendGrid or similar)
                return c.json({
                    statusCode: 200,
                    status: true,
                    message: `OTP has been sent to ${email} successfully`,
                    data: null
                }, 200);

            } catch (error) {
                console.error("Error in OtpController:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to send OTP",
                    data: null,
                    error: "Internal server error"
                }, 500);
            }
        });
    }
}
