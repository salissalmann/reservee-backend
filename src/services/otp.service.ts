import { sendEmail, SendEmailOptions } from "@/utils/sendgrid";
import { otpTable } from "../schemas/otp.schema";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";

export class OtpService {
    private db: NeonHttpDatabase;

    constructor(db: NeonHttpDatabase) {
        this.db = db;
    }

    async generateOtp(name: string, email: string, is_for_password: boolean) {
        const generatedOtp = (Math.floor(Math.random() * 8998) + 1001).toString();
        const currentTime = new Date();

        await this.db.insert(otpTable).values({
            email,
            code: generatedOtp,
            is_disabled: false,
            is_used: false,
            is_for_password: is_for_password,
            provider: 'Email',
            created_at: currentTime,
            updated_at: currentTime,
        });

        return generatedOtp;
    }

    async validateOtp(email: string, otp: string): Promise<{ status: boolean; message: string }> {
        try {
            // Fetch OTP record
            const otpRecord = await this.db
                .select()
                .from(otpTable)
                .where(
                    and(
                        eq(otpTable.email, email),
                        eq(otpTable.code, otp),
                        eq(otpTable.is_disabled, false),
                        eq(otpTable.is_used, false)
                    )
                )
                .limit(1);

            console.log('otpRecord------', otpRecord)

            if (!otpRecord[0]) {
                throw new Error("Invalid OTP or email");
            }

            // Update OTP as used and disabled
            await this.db
                .update(otpTable)
                .set({
                    is_used: true,
                    is_disabled: true,
                })
                .where(eq(otpTable.email, email));

            return { status: true, message: "Email verified successfully." };
        } catch (error) {
            console.error("Error validating OTP:", error);
            throw new Error("Invalid OTP or email");
        }
    }

    async validatePasswordOtp(email: string, otp: string): Promise<{ status: boolean; message: string }> {
        try {
            // Fetch OTP record
            const otpRecord = await this.db
                .select()
                .from(otpTable)
                .where(
                    and(
                        eq(otpTable.email, email),
                        eq(otpTable.code, otp),
                        eq(otpTable.is_disabled, false),
                        eq(otpTable.is_used, false),
                        eq(otpTable.is_for_password, true)
                    )
                )
                .limit(1);

            if (!otpRecord[0]) {
                throw new Error("Invalid OTP or email");
            }

            // Update OTP as used and disabled
            await this.db
                .update(otpTable)
                .set({
                    is_used: true,
                    is_disabled: true,
                })
                .where(eq(otpTable.email, email));

            return { status: true, message: "Email verified successfully." };
        } catch (error) {
            console.error("Error validating OTP:", error);
            throw new Error("Invalid OTP or email");
        }
    }

    async sendEmailOtp(name: string, email: string, is_for_password: boolean, SENDGRID_API_KEY: string) {
        try {
            // Generate OTP
            const generatedOtp = await this.generateOtp(name, email, is_for_password);

            // Prepare email payload
            const emailPayload: SendEmailOptions = {
                to: email,
                from: "no-reply@fair-ticket.com",
                templateId: "d-bc90a2e9f5c04607900f4fe6780f2727",
                dynamic_template_data: {
                    first_name: name,
                    otp: generatedOtp,
                },
            };

            // Send email using SendGrid
            const response = await sendEmail(emailPayload, SENDGRID_API_KEY);

            if (response.status === 202) { // Use `status` instead of `statusCode`
                return {
                    status: true,
                    message: `OTP has been sent to ${email} successfully.`,
                };
            }

            throw new Error("Failed to send email");
        } catch (error) {
            console.error("Error sending email OTP:", error);
            throw new Error("Error sending email OTP: " + (error as Error).message);
        }
    }

}
