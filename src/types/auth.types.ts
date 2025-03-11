import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const GoogleLoginSchema = z.object({
    image: z.string().optional(),
    first_name: z.string(),
    last_name: z.string().optional(),
    email: z.string().email(),
    phone_no: z.string().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string(),
    new_password: z.string().min(8), // Example: password must be at least 8 characters
});

export const SignUpUserSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().optional(),
    email: z.string().email("Invalid email format"),
    country_code: z.string().min(1, "Country code is required"),
    phone_no: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    otp: z.string().min(4, "OTP must be at least 4 characters").optional(),
    image: z.string().optional(),
    invitation_id: z.number().optional()
});

export type SignUpUserDto = z.infer<typeof SignUpUserSchema>;
